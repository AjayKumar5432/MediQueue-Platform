package com.mediqueue.serviceimpl;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.mediqueue.dto.request.HospitalAdminRegistrationRequest;
import com.mediqueue.dto.request.LoginRequest;
import com.mediqueue.dto.response.HospitalAdminResponse;
import com.mediqueue.dto.response.LoginResponse;
import com.mediqueue.entity.Hospital;
import com.mediqueue.entity.User;
import com.mediqueue.enums.HospitalStatus;
import com.mediqueue.enums.Role;
import com.mediqueue.exception.BadRequestException;
import com.mediqueue.exception.ResourceNotFoundException;
import com.mediqueue.mapper.HospitalAdminMapper;
import com.mediqueue.repository.HospitalRepository;
import com.mediqueue.repository.UserRepository;
import com.mediqueue.security.JwtService;
import com.mediqueue.service.AuthService;
import com.mediqueue.service.EmailService;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private HospitalRepository hospitalRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private HospitalAdminMapper hospitalAdminMapper;

    @Autowired
    private EmailService emailService;

    @Override
    public LoginResponse login(LoginRequest request) {

        // Step 1: Authenticate the user
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()));

        // Step 2: Fetch user details from database
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Step 3: Generate JWT token
        String token = jwtService.generateToken(user.getEmail());

        // Step 4: Prepare response
        LoginResponse response = new LoginResponse();

        response.setToken(token);
        response.setType("Bearer");
        response.setFullName(user.getFullName());
        response.setEmail(user.getEmail());
        response.setRole(user.getRole().name());

        if (user.getHospital() != null) {
            response.setHospitalId(user.getHospital().getHospitalId());
            if (user.getHospital().getStatus() != null) {
                response.setStatus(user.getHospital().getStatus().name());
            } else {
                response.setStatus(Boolean.TRUE.equals(user.getActive()) ? "ACTIVE" : "PENDING");
            }
        } else {
            response.setStatus(Boolean.TRUE.equals(user.getActive()) ? "ACTIVE" : "PENDING");
        }

        return response;
    }

    @Override
    public HospitalAdminResponse registerHospitalAdmin(HospitalAdminRegistrationRequest request) {

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new BadRequestException("Admin email already exists.");
        }

        if (userRepository.findByPhone(request.getPhone()).isPresent()) {
            throw new BadRequestException("Admin phone number already exists.");
        }

        // Check if hospital already exists by name or email
        Optional<Hospital> existingHospitalOpt = hospitalRepository.findByHospitalName(request.getHospitalName());
        if (!existingHospitalOpt.isPresent() && request.getHospitalEmail() != null && !request.getHospitalEmail().isBlank()) {
            existingHospitalOpt = hospitalRepository.findByEmail(request.getHospitalEmail());
        }

        Hospital hospital;
        if (existingHospitalOpt.isPresent()) {
            final Hospital existingHospital = existingHospitalOpt.get();

            // Check if hospital already has an active admin
            userRepository.findByHospitalAndRoleAndActiveTrue(existingHospital, Role.HOSPITAL_ADMIN)
                    .ifPresent(existingAdmin -> {
                        throw new BadRequestException("The hospital '" + existingHospital.getHospitalName() + "' already has an assigned active administrator.");
                    });
            hospital = existingHospital;
        } else {

            String finalHospEmail = (request.getHospitalEmail() != null && !request.getHospitalEmail().isBlank())
                    ? request.getHospitalEmail() : request.getEmail();
            String finalHospPhone = (request.getPhoneNumber() != null && !request.getPhoneNumber().isBlank())
                    ? request.getPhoneNumber() : request.getPhone();

            // Create new Hospital entity with status PENDING
            hospital = new Hospital();
            hospital.setHospitalName(request.getHospitalName());
            hospital.setAddress(request.getAddress());
            hospital.setCity(request.getCity());
            hospital.setState(request.getState());
            hospital.setPhoneNumber(finalHospPhone);
            hospital.setEmail(finalHospEmail);
            hospital.setActive(false);
            hospital.setStatus(HospitalStatus.PENDING);
            hospital.setCreatedAt(LocalDateTime.now());
            hospital.setUpdatedAt(LocalDateTime.now());

            hospital = hospitalRepository.save(hospital);

        }

        // Create User entity for Hospital Admin with status PENDING
        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.HOSPITAL_ADMIN);
        user.setHospital(hospital);
        user.setActive(false);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        User savedUser = userRepository.save(user);

        // Send Email Notifications
        emailService.sendNewRegistrationAlertToSuperAdmin(hospital, savedUser);
        emailService.sendRegistrationAcknowledgementToAdmin(hospital, savedUser);

        HospitalAdminResponse response = hospitalAdminMapper.toResponse(savedUser);
        response.setStatus(HospitalStatus.PENDING.name());
        return response;
    }
}