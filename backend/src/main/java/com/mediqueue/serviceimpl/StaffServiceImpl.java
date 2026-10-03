package com.mediqueue.serviceimpl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.mediqueue.dto.request.StaffRequest;
import com.mediqueue.dto.response.StaffResponse;
import com.mediqueue.entity.User;
import com.mediqueue.enums.Role;
import com.mediqueue.exception.BadRequestException;
import com.mediqueue.exception.ResourceNotFoundException;
import com.mediqueue.mapper.StaffMapper;
import com.mediqueue.repository.UserRepository;
import com.mediqueue.service.StaffService;

@Service
public class StaffServiceImpl implements StaffService {

    private final UserRepository userRepository;
    private final StaffMapper staffMapper;
    private final PasswordEncoder passwordEncoder;

    public StaffServiceImpl(UserRepository userRepository,
                            StaffMapper staffMapper,
                            PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.staffMapper = staffMapper;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public StaffResponse createStaff(StaffRequest request) {

        validateStaff(request, null);

        User hospitalAdmin = getLoggedInHospitalAdmin();

        User staff = staffMapper.toEntity(request);

        staff.setHospital(hospitalAdmin.getHospital());
        staff.setRole(Role.STAFF);
        staff.setPassword(passwordEncoder.encode(request.getPassword()));
        staff.setActive(true);
        staff.setCreatedAt(LocalDateTime.now());
        staff.setUpdatedAt(LocalDateTime.now());

        User savedStaff = userRepository.save(staff);

        return staffMapper.toResponse(savedStaff);
    }

    @Override
    public List<StaffResponse> getAllStaff() {

        User hospitalAdmin = getLoggedInHospitalAdmin();

        return userRepository
                .findAllByHospitalAndRoleAndActiveTrue(
                        hospitalAdmin.getHospital(),
                        Role.STAFF)
                .stream()
                .map(staffMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public StaffResponse getStaffById(Long staffId) {

        User hospitalAdmin = getLoggedInHospitalAdmin();

        User staff = userRepository.findById(staffId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Staff not found."));

        if (staff.getRole() != Role.STAFF) {
            throw new BadRequestException("User is not a Staff.");
        }

        if (!staff.getHospital().getHospitalId()
                .equals(hospitalAdmin.getHospital().getHospitalId())) {

            throw new BadRequestException(
                    "You are not allowed to access this staff.");
        }

        return staffMapper.toResponse(staff);
    }

    @Override
    public StaffResponse updateStaff(Long staffId,
            StaffRequest request) {

        // We will implement later
        return null;
    }

    @Override
    public void deleteStaff(Long staffId) {

        // We will implement later
    }

    /**
     * Email & Phone Validation
     */
    private void validateStaff(StaffRequest request, Long userId) {

        userRepository.findByEmail(request.getEmail())
                .filter(existing ->
                        userId == null ||
                        !existing.getId().equals(userId))
                .ifPresent(existing -> {
                    throw new BadRequestException(
                            "Email already exists.");
                });

        userRepository.findByPhone(request.getPhone())
                .filter(existing ->
                        userId == null ||
                        !existing.getId().equals(userId))
                .ifPresent(existing -> {
                    throw new BadRequestException(
                            "Phone number already exists.");
                });
    }

    /**
     * Returns Logged-in Hospital Admin
     */
    private User getLoggedInHospitalAdmin() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        String email = authentication.getName();

        User admin = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Hospital Admin not found."));

        if (admin.getRole() != Role.HOSPITAL_ADMIN) {
            throw new BadRequestException(
                    "Access denied.");
        }

        return admin;
    }

}