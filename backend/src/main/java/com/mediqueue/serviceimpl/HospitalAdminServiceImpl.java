package com.mediqueue.serviceimpl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.mediqueue.dto.request.HospitalAdminRequest;
import com.mediqueue.dto.response.HospitalAdminResponse;
import com.mediqueue.dto.response.HospitalDepartmentResponse;
import com.mediqueue.entity.Hospital;
import com.mediqueue.entity.User;
import com.mediqueue.enums.Role;
import com.mediqueue.exception.BadRequestException;
import com.mediqueue.exception.ResourceNotFoundException;
import com.mediqueue.mapper.HospitalAdminMapper;
import com.mediqueue.repository.HospitalRepository;
import com.mediqueue.repository.UserRepository;
import com.mediqueue.service.HospitalAdminService;

import com.mediqueue.enums.HospitalStatus;
import com.mediqueue.service.EmailService;

@Service
public class HospitalAdminServiceImpl implements HospitalAdminService {

    private final UserRepository userRepository;
    private final HospitalRepository hospitalRepository;
    private final HospitalAdminMapper hospitalAdminMapper;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    public HospitalAdminServiceImpl(
            UserRepository userRepository,
            HospitalRepository hospitalRepository,
            HospitalAdminMapper hospitalAdminMapper,
            PasswordEncoder passwordEncoder,
            EmailService emailService) {

        this.userRepository = userRepository;
        this.hospitalRepository = hospitalRepository;
        this.hospitalAdminMapper = hospitalAdminMapper;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
    }

    @Override
    public HospitalAdminResponse createHospitalAdmin(
            HospitalAdminRequest request) {

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new BadRequestException("Email already exists.");
        }

        if (userRepository.findByPhone(request.getPhone()).isPresent()) {
            throw new BadRequestException("Phone number already exists.");
        }

        Hospital hospital = hospitalRepository
                .findById(request.getHospitalId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Hospital not found."));

        userRepository
                .findByHospitalAndRoleAndActiveTrue(
                        hospital,
                        Role.HOSPITAL_ADMIN)
                .ifPresent(user -> {
                    throw new BadRequestException(
                            "Hospital already has an active admin.");
                });

        User user = hospitalAdminMapper.toEntity(request);

        user.setHospital(hospital);
        user.setRole(Role.HOSPITAL_ADMIN);
        user.setPassword(
                passwordEncoder.encode(request.getPassword()));
        user.setActive(true);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        User savedUser = userRepository.save(user);

        return hospitalAdminMapper.toResponse(savedUser);
    }

    @Override
    public List<HospitalAdminResponse> getAllHospitalAdmins() {

        return userRepository
                .findByRole(Role.HOSPITAL_ADMIN)
                .stream()
                .map(hospitalAdminMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public HospitalAdminResponse getHospitalAdminById(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Hospital Admin not found."));

        if (user.getRole() != Role.HOSPITAL_ADMIN) {
            throw new BadRequestException(
                    "User is not a Hospital Admin.");
        }

        return hospitalAdminMapper.toResponse(user);
    }

    @Override
    public HospitalAdminResponse updateHospitalAdmin(
            Long userId,
            HospitalAdminRequest request) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Hospital Admin not found."));

        if (user.getRole() != Role.HOSPITAL_ADMIN) {
            throw new BadRequestException(
                    "User is not a Hospital Admin.");
        }

        Hospital hospital = hospitalRepository
                .findById(request.getHospitalId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Hospital not found."));

        userRepository.findByHospitalAndRoleAndActiveTrue(
                hospital,
                Role.HOSPITAL_ADMIN)
                .filter(existing ->
                        !existing.getId().equals(userId))
                .ifPresent(existing -> {
                    throw new BadRequestException(
                            "Hospital already has an admin.");
                });

        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setHospital(hospital);

        if (request.getPassword() != null &&
                !request.getPassword().isBlank()) {

            user.setPassword(
                    passwordEncoder.encode(request.getPassword()));
        }

        user.setUpdatedAt(LocalDateTime.now());

        User updatedUser = userRepository.save(user);

        return hospitalAdminMapper.toResponse(updatedUser);
    }

    @Override
    public void deleteHospitalAdmin(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Hospital Admin not found."));

        if (user.getRole() != Role.HOSPITAL_ADMIN) {
            throw new BadRequestException(
                    "User is not a Hospital Admin.");
        }

        user.setActive(false);
        user.setUpdatedAt(LocalDateTime.now());

        if (user.getHospital() != null) {
            Hospital hospital = user.getHospital();
            hospital.setActive(false);
            hospital.setStatus(HospitalStatus.INACTIVE);
            hospital.setUpdatedAt(LocalDateTime.now());
            hospitalRepository.save(hospital);
        }

        userRepository.save(user);
    }

    @Override
    public HospitalAdminResponse approveHospitalAdmin(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Hospital Admin not found."));

        if (user.getRole() != Role.HOSPITAL_ADMIN) {
            throw new BadRequestException("User is not a Hospital Admin.");
        }

        user.setActive(true);
        user.setUpdatedAt(LocalDateTime.now());

        Hospital hospital = user.getHospital();
        if (hospital != null) {
            hospital.setActive(true);
            hospital.setStatus(HospitalStatus.ACTIVE);
            hospital.setUpdatedAt(LocalDateTime.now());
            hospitalRepository.save(hospital);
        }

        User savedUser = userRepository.save(user);

        // Send Approval Email Notification
        if (hospital != null) {
            emailService.sendApprovalStatusEmail(hospital, savedUser, true);
        }

        return hospitalAdminMapper.toResponse(savedUser);
    }

    @Override
    public HospitalAdminResponse rejectHospitalAdmin(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Hospital Admin not found."));

        if (user.getRole() != Role.HOSPITAL_ADMIN) {
            throw new BadRequestException("User is not a Hospital Admin.");
        }

        user.setActive(false);
        user.setUpdatedAt(LocalDateTime.now());

        Hospital hospital = user.getHospital();
        if (hospital != null) {
            hospital.setActive(false);
            hospital.setStatus(HospitalStatus.INACTIVE);
            hospital.setUpdatedAt(LocalDateTime.now());
            hospitalRepository.save(hospital);
        }

        User savedUser = userRepository.save(user);

        // Send Rejection Email Notification
        if (hospital != null) {
            emailService.sendApprovalStatusEmail(hospital, savedUser, false);
        }

        return hospitalAdminMapper.toResponse(savedUser);
    }
}