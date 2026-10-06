package com.mediqueue.serviceimpl;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.mediqueue.dto.request.TokenRequest;
import com.mediqueue.dto.response.TokenResponse;
import com.mediqueue.entity.HospitalDepartment;
import com.mediqueue.entity.Token;
import com.mediqueue.entity.User;
import com.mediqueue.enums.BookingSource;
import com.mediqueue.enums.QueueStatus;
import com.mediqueue.enums.Role;
import com.mediqueue.exception.BadRequestException;
import com.mediqueue.exception.ResourceNotFoundException;
import com.mediqueue.mapper.TokenMapper;
import com.mediqueue.repository.HospitalDepartmentRepository;
import com.mediqueue.repository.TokenRepository;
import com.mediqueue.repository.UserRepository;
import com.mediqueue.service.EmailService;
import com.mediqueue.service.TokenService;
import com.mediqueue.util.LoggedInUserUtil;

@Service
public class TokenServiceImpl implements TokenService {

    private final TokenRepository tokenRepository;
    private final HospitalDepartmentRepository hospitalDepartmentRepository;
    private final UserRepository userRepository;
    private final TokenMapper tokenMapper;
    private final LoggedInUserUtil loggedInUserUtil;
    private final EmailService emailService;

    
    
    public TokenServiceImpl(TokenRepository tokenRepository, HospitalDepartmentRepository hospitalDepartmentRepository,
			UserRepository userRepository, TokenMapper tokenMapper, LoggedInUserUtil loggedInUserUtil,
			EmailService emailService) {
		super();
		this.tokenRepository = tokenRepository;
		this.hospitalDepartmentRepository = hospitalDepartmentRepository;
		this.userRepository = userRepository;
		this.tokenMapper = tokenMapper;
		this.loggedInUserUtil = loggedInUserUtil;
		this.emailService = emailService;
	}

	@Override
    public TokenResponse bookToken(TokenRequest request) {

        // Logged-in user
        User loggedInUser = loggedInUserUtil.getLoggedInUser();

        // Hospital Department
        HospitalDepartment hospitalDepartment =
                hospitalDepartmentRepository
                        .findByHospitalDepartmentIdAndActiveTrue(
                                request.getHospitalDepartmentId())
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Hospital Department not found."));

        // ===========================
        // VALIDATION 1
        // Department Active
        // ===========================
        if (!hospitalDepartment.getActive()) {
            throw new BadRequestException(
                    "Hospital Department is inactive.");
        }

        // ===========================
        // VALIDATION 2
        // Department Available Today
        // ===========================
        if (!hospitalDepartment.getAvailableToday()) {
            throw new BadRequestException(
                    "Department is not available today.");
        }

        // ===========================
        // VALIDATION 3
        // Daily Token Limit
        // ===========================
        long bookedTokens = tokenRepository
                .findByHospitalDepartmentAndBookingDateAndActiveTrue(
                        hospitalDepartment,
                        LocalDate.now())
                .size();

        if (bookedTokens >= hospitalDepartment.getDailyTokenLimit()) {
            throw new BadRequestException(
                    "Today's token limit reached.");
        }

        // ===========================
        // VALIDATION 4
        // Identify Customer
        // ===========================
        User customer;

        if (request.getBookingSource() == BookingSource.ONLINE) {

            if (loggedInUser.getRole() != Role.CUSTOMER) {
                throw new BadRequestException(
                        "Only customers can book online.");
            }

            customer = loggedInUser;

        } else {

            if (loggedInUser.getRole() != Role.STAFF && loggedInUser.getRole() != Role.HOSPITAL_ADMIN && loggedInUser.getRole() != Role.SUPER_ADMIN) {
                throw new BadRequestException(
                        "Only hospital staff or administrators can create walk-in tokens.");
            }

            if (request.getCustomerId() == null) {
                throw new BadRequestException(
                        "Customer Id is required for walk-in booking.");
            }

            customer = userRepository.findById(request.getCustomerId())
                    .orElseThrow(() ->
                            new ResourceNotFoundException(
                                    "Customer not found."));

            if (customer.getRole() != Role.CUSTOMER) {
                throw new BadRequestException(
                        "Selected user is not a customer.");
            }

            if (!customer.getActive()) {
                throw new BadRequestException(
                        "Customer account is inactive.");
            }
        }

        // ===========================
        // VALIDATION 5
        // Duplicate Booking
        // ===========================
        boolean alreadyBooked =
                tokenRepository
                        .existsByCustomerAndHospitalDepartmentAndBookingDateAndActiveTrue(
                                customer,
                                hospitalDepartment,
                                LocalDate.now());

        if (alreadyBooked) {
            throw new BadRequestException(
                    "Customer already booked a token today.");
        }

        // ===========================
        // TOKEN CREATION
        // ===========================
        Token token = new Token();

        token.setTokenNumber(generateTokenNumber(hospitalDepartment));
        token.setCustomer(customer);
        token.setHospitalDepartment(hospitalDepartment);
        token.setBookingSource(request.getBookingSource());
        token.setStatus(QueueStatus.WAITING);
        token.setCreatedBy(loggedInUser);
        token.setBookingDate(LocalDate.now());
        token.setBookedAt(LocalDateTime.now());
        token.setEstimatedTime(calculateEstimatedTime(hospitalDepartment));
        token.setActive(true);
        token.setCreatedAt(LocalDateTime.now());
        token.setUpdatedAt(LocalDateTime.now());

        Token savedToken = tokenRepository.save(token);
        

        try {

            emailService.sendTokenReceipt(savedToken.getTokenId());

            System.out.println("Receipt email sent successfully.");

        } catch (Exception e) {

            e.printStackTrace();
        }

     

        return tokenMapper.toResponse(savedToken);
    }
        
    private String generateTokenNumber(HospitalDepartment hospitalDepartment) {

        String departmentCode =
                hospitalDepartment
                        .getDepartment()
                        .getDepartmentCode();

        Optional<Token> lastToken =
                tokenRepository
                        .findTopByHospitalDepartmentAndBookingDateOrderByTokenIdDesc(
                                hospitalDepartment,
                                LocalDate.now());

        int nextNumber = 1;

        if (lastToken.isPresent()) {

            String lastTokenNumber =
                    lastToken.get().getTokenNumber();

            String[] parts =
                    lastTokenNumber.split("-");

            nextNumber =
                    Integer.parseInt(parts[1]) + 1;
        }

        return String.format(
                "%s-%03d",
                departmentCode,
                nextNumber);
    }
        
    private LocalDateTime calculateEstimatedTime(
            HospitalDepartment hospitalDepartment) {

        long waitingCount =
                tokenRepository
                        .countByHospitalDepartmentAndBookingDateAndStatusAndActiveTrue(
                                hospitalDepartment,
                                LocalDate.now(),
                                QueueStatus.WAITING);

        long servingCount =
                tokenRepository
                        .countByHospitalDepartmentAndBookingDateAndStatusAndActiveTrue(
                                hospitalDepartment,
                                LocalDate.now(),
                                QueueStatus.SERVING);

        long totalPatientsAhead =
                waitingCount + servingCount;

        return LocalDateTime.now().plusMinutes(
                totalPatientsAhead *
                hospitalDepartment.getAverageConsultationTime());
    }
        
    
    @Override
    public List<TokenResponse> getMyTokens() {

        User customer = loggedInUserUtil.getLoggedInUser();

        List<Token> tokens =
                tokenRepository.findByCustomerAndActiveTrue(customer);

        return tokens.stream()
                .map(tokenMapper::toResponse)
                .toList();
    }
    
    @Override
    public TokenResponse getTokenById(Long tokenId) {

        User customer = loggedInUserUtil.getLoggedInUser();

        Token token = tokenRepository.findById(tokenId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Token not found."));

        if (!token.getCustomer().getId().equals(customer.getId())) {

            throw new BadRequestException(
                    "You are not authorized to view this token.");
        }

        return tokenMapper.toResponse(token);
    }
    
    @Override
    public TokenResponse cancelMyToken(Long tokenId) {

        User customer = loggedInUserUtil.getLoggedInUser();

        Token token = tokenRepository.findById(tokenId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Token not found."));

        if (!token.getCustomer().getId().equals(customer.getId())) {

            throw new BadRequestException(
                    "You are not authorized to cancel this token.");
        }

        if (token.getStatus() == QueueStatus.SERVING ||
            token.getStatus() == QueueStatus.COMPLETED) {

            throw new BadRequestException(
                    "Token cannot be cancelled.");
        }

        token.setStatus(QueueStatus.CANCELLED);
        token.setUpdatedAt(LocalDateTime.now());

        Token savedToken = tokenRepository.save(token);
        return tokenMapper.toResponse(savedToken);
    }
        
        
    }