package com.mediqueue.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.mediqueue.dto.request.HospitalRequest;
import com.mediqueue.dto.response.HospitalResponse;
import com.mediqueue.service.HospitalService;

import jakarta.validation.Valid;

@RestController
@Validated
public class HospitalController {

    private final HospitalService hospitalService;

    public HospitalController(HospitalService hospitalService) {
        this.hospitalService = hospitalService;
    }

    // =========================================================
    // SUPER ADMIN APIs
    // =========================================================

    /**
     * Create Hospital
     */
    @PostMapping("/super-admin/hospitals")
    public ResponseEntity<HospitalResponse> createHospital(
            @Valid @RequestBody HospitalRequest request) {

        HospitalResponse response = hospitalService.createHospital(request);

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /**
     * Get All Hospitals
     */
    @GetMapping("/super-admin/hospitals")
    public ResponseEntity<List<HospitalResponse>> getAllHospitals() {

        return ResponseEntity.ok(
                hospitalService.getAllHospitals());
    }

    /**
     * Get Hospital By Id
     */
    @GetMapping("/super-admin/hospitals/{hospitalId}")
    public ResponseEntity<HospitalResponse> getHospitalById(
            @PathVariable Long hospitalId) {

        return ResponseEntity.ok(
                hospitalService.getHospitalById(hospitalId));
    }

    /**
     * Update Hospital
     */
    @PutMapping("/super-admin/hospitals/{hospitalId}")
    public ResponseEntity<HospitalResponse> updateHospital(
            @PathVariable Long hospitalId,
            @Valid @RequestBody HospitalRequest request) {

        return ResponseEntity.ok(
                hospitalService.updateHospital(hospitalId, request));
    }

    /**
     * Soft Delete Hospital
     */
    @DeleteMapping("/super-admin/hospitals/{hospitalId}")
    public ResponseEntity<String> deleteHospital(
            @PathVariable Long hospitalId) {

        hospitalService.deleteHospital(hospitalId);

        return ResponseEntity.ok(
                "Hospital deleted successfully.");
    }

    // =========================================================
    // CUSTOMER APIs
    // =========================================================

    /**
     * Get All Active Hospitals (Customer)
     */
    @GetMapping("/customer/hospitals")
    public ResponseEntity<List<HospitalResponse>> getHospitalsForCustomer() {

        return ResponseEntity.ok(
                hospitalService.getAllHospitals());
    }

    /**
     * Get Hospital By Id (Customer)
     */
    @GetMapping("/customer/hospitals/{hospitalId}")
    public ResponseEntity<HospitalResponse> getHospitalForCustomer(
            @PathVariable Long hospitalId) {

        return ResponseEntity.ok(
                hospitalService.getHospitalById(hospitalId));
    }
}