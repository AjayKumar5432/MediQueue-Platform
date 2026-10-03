package com.mediqueue.serviceimpl;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.mediqueue.dto.response.TokenResponse;
import com.mediqueue.dto.websocket.QueueMessage;
import com.mediqueue.entity.HospitalDepartment;
import com.mediqueue.entity.Token;
import com.mediqueue.enums.QueueStatus;
import com.mediqueue.exception.BadRequestException;
import com.mediqueue.exception.ResourceNotFoundException;
import com.mediqueue.mapper.TokenMapper;
import com.mediqueue.repository.HospitalDepartmentRepository;
import com.mediqueue.repository.TokenRepository;
import com.mediqueue.service.QueueService;

@Service
public class QueueServiceImpl implements QueueService {

    private final TokenRepository tokenRepository;
    private final HospitalDepartmentRepository hospitalDepartmentRepository;
    private final TokenMapper tokenMapper;
    private final  SimpMessagingTemplate messagingTemplate;

   
    
    public QueueServiceImpl(TokenRepository tokenRepository, HospitalDepartmentRepository hospitalDepartmentRepository,
			TokenMapper tokenMapper, SimpMessagingTemplate messagingTemplate) {
		super();
		this.tokenRepository = tokenRepository;
		this.hospitalDepartmentRepository = hospitalDepartmentRepository;
		this.tokenMapper = tokenMapper;
		this.messagingTemplate = messagingTemplate;
	}

	@Override
    public List<TokenResponse> getTodayQueue(Long hospitalDepartmentId) {

        HospitalDepartment hospitalDepartment =
                hospitalDepartmentRepository
                        .findByHospitalDepartmentIdAndActiveTrue(hospitalDepartmentId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Hospital Department not found."));

        List<Token> tokens =
                tokenRepository
                        .findByHospitalDepartmentAndBookingDateAndActiveTrueOrderByTokenIdAsc(
                                hospitalDepartment,
                                LocalDate.now());

        return tokens.stream()
                .map(tokenMapper::toResponse)
                .collect(Collectors.toList());
    }
    
    
    @Override
    public TokenResponse callNextToken(Long hospitalDepartmentId) {

        HospitalDepartment hospitalDepartment =
                hospitalDepartmentRepository
                        .findByHospitalDepartmentIdAndActiveTrue(hospitalDepartmentId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Hospital Department not found."));

        // Check if another token is already being served
        tokenRepository
                .findFirstByHospitalDepartmentAndBookingDateAndStatusAndActiveTrueOrderByTokenIdAsc(
                        hospitalDepartment,
                        LocalDate.now(),
                        QueueStatus.SERVING)
                .ifPresent(token -> {

                    throw new BadRequestException(
                            "Another token is already being served.");
                });

        // Get next waiting token
        Token nextToken =
                tokenRepository
                        .findFirstByHospitalDepartmentAndBookingDateAndStatusAndActiveTrueOrderByTokenIdAsc(
                                hospitalDepartment,
                                LocalDate.now(),
                                QueueStatus.WAITING)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "No waiting tokens."));

        nextToken.setStatus(QueueStatus.SERVING);
        nextToken.setUpdatedAt(LocalDateTime.now());

        Token savedToken = tokenRepository.save(nextToken);

        // 🔥 Broadcast to all connected clients
        sendQueueUpdate(savedToken);

        return tokenMapper.toResponse(savedToken);
    }
    
    @Override
    public TokenResponse getCurrentServingToken(Long hospitalDepartmentId) {

        HospitalDepartment hospitalDepartment =
                hospitalDepartmentRepository
                        .findByHospitalDepartmentIdAndActiveTrue(hospitalDepartmentId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Hospital Department not found."));

        Token token = tokenRepository
                .findFirstByHospitalDepartmentAndBookingDateAndStatusAndActiveTrueOrderByTokenIdAsc(
                        hospitalDepartment,
                        LocalDate.now(),
                        QueueStatus.SERVING)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "No token is currently serving."));

        return tokenMapper.toResponse(token);
    }
    
    @Override
    public TokenResponse completeToken(Long tokenId) {

        Token token = tokenRepository.findById(tokenId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Token not found."));

        if (token.getStatus() != QueueStatus.SERVING) {

            throw new BadRequestException(
                    "Only serving token can be completed.");
        }

        token.setStatus(QueueStatus.COMPLETED);
        token.setUpdatedAt(LocalDateTime.now());

        Token savedToken = tokenRepository.save(token);
        
        sendQueueUpdate(savedToken);
        return tokenMapper.toResponse(savedToken);
    }
    
    
    
    private void sendQueueUpdate(Token SavedToken) {

        QueueMessage message = new QueueMessage();

        message.setTokenId(SavedToken.getTokenId());

        message.setTokenNumber(SavedToken.getTokenNumber());

        message.setCustomerName(
        		SavedToken.getCustomer().getFullName());

        message.setDepartmentName(
        		SavedToken.getHospitalDepartment()
                     .getDepartment()
                     .getDepartmentName());

        message.setStatus(SavedToken.getStatus());

        message.setEstimatedTime(
        		SavedToken.getEstimatedTime());

        messagingTemplate.convertAndSend(

                "/topic/queue/" +
                		SavedToken.getHospitalDepartment()
                     .getHospitalDepartmentId(),message );
    }
   
    
}