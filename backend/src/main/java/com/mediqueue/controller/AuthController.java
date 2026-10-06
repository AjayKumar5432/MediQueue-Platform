package com.mediqueue.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.mediqueue.dto.request.LoginRequest;
import com.mediqueue.dto.response.LoginResponse;
import com.mediqueue.service.AuthService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/auth")
@Validated
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private com.mediqueue.service.HospitalService hospitalService;

    @Autowired
    private com.mediqueue.repository.HospitalRepository hospitalRepository;

    @Autowired
    private com.mediqueue.mapper.HospitalMapper hospitalMapper;

    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest request) {

        return authService.login(request);

    }

    @PostMapping("/register-hospital-admin")
    public org.springframework.http.ResponseEntity<com.mediqueue.dto.response.HospitalAdminResponse> registerHospitalAdmin(
            @Valid @RequestBody com.mediqueue.dto.request.HospitalAdminRegistrationRequest request) {

        com.mediqueue.dto.response.HospitalAdminResponse response =
                authService.registerHospitalAdmin(request);

        return new org.springframework.http.ResponseEntity<>(response, org.springframework.http.HttpStatus.CREATED);
    }

    @Autowired
    private com.mediqueue.service.OtpService otpService;

    @PostMapping("/send-otp")
    public org.springframework.http.ResponseEntity<java.util.Map<String, Object>> sendOtp(
            @RequestBody java.util.Map<String, Object> request) {
        String email = request.containsKey("email") && request.get("email") != null ? request.get("email").toString() : null;
        String phone = request.containsKey("phone") && request.get("phone") != null ? request.get("phone").toString() : null;
        return org.springframework.http.ResponseEntity.ok(otpService.sendRegistrationOtp(email, phone));
    }

    @PostMapping("/verify-otp")
    public org.springframework.http.ResponseEntity<java.util.Map<String, Object>> verifyOtp(
            @RequestBody java.util.Map<String, Object> request) {
        String email = request.containsKey("email") && request.get("email") != null ? request.get("email").toString() : null;
        String otp = request.containsKey("otp") && request.get("otp") != null ? request.get("otp").toString() : null;
        return org.springframework.http.ResponseEntity.ok(otpService.verifyOtp(email, otp));
    }

    @PostMapping("/forgot-password/send-otp")
    public org.springframework.http.ResponseEntity<java.util.Map<String, Object>> sendForgotPasswordOtp(
            @RequestBody java.util.Map<String, Object> request) {
        String email = request.containsKey("email") && request.get("email") != null ? request.get("email").toString() : null;
        return org.springframework.http.ResponseEntity.ok(otpService.sendForgotPasswordOtp(email));
    }

    @PostMapping("/forgot-password/reset")
    public org.springframework.http.ResponseEntity<java.util.Map<String, Object>> resetPassword(
            @RequestBody java.util.Map<String, Object> request) {
        String email = request.containsKey("email") && request.get("email") != null ? request.get("email").toString() : null;
        String otp = request.containsKey("otp") && request.get("otp") != null ? request.get("otp").toString() : null;
        String newPassword = request.containsKey("newPassword") && request.get("newPassword") != null ? request.get("newPassword").toString() : null;
        return org.springframework.http.ResponseEntity.ok(otpService.resetPasswordWithOtp(email, otp, newPassword));
    }

    @GetMapping("/hospitals")
    public org.springframework.http.ResponseEntity<java.util.List<com.mediqueue.dto.response.HospitalResponse>> getPublicHospitals() {
        return org.springframework.http.ResponseEntity.ok(
                hospitalRepository.findAll()
                        .stream()
                        .map(hospitalMapper::toResponse)
                        .toList()
        );
    }

}