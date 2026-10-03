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