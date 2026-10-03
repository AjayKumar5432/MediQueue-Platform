package com.mediqueue.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.mediqueue.dto.request.HospitalAdminRequest;
import com.mediqueue.dto.response.HospitalAdminResponse;
import com.mediqueue.service.HospitalAdminService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/super-admin/hospital-admins")
@Validated
public class HospitalAdminController {

    private final HospitalAdminService hospitalAdminService;

    public HospitalAdminController(HospitalAdminService hospitalAdminService) {
        this.hospitalAdminService = hospitalAdminService;
    }

    /**
     * Create Hospital Admin
     */
    @PostMapping
    public ResponseEntity<HospitalAdminResponse> createHospitalAdmin(
            @Valid @RequestBody HospitalAdminRequest request) {

        HospitalAdminResponse response =
                hospitalAdminService.createHospitalAdmin(request);

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /**
     * Get All Hospital Admins
     */
    @GetMapping
    public ResponseEntity<List<HospitalAdminResponse>> getAllHospitalAdmins() {

        return ResponseEntity.ok(
                hospitalAdminService.getAllHospitalAdmins());
    }

    /**
     * Get Hospital Admin By Id
     */
    @GetMapping("/{adminId}")
    public ResponseEntity<HospitalAdminResponse> getHospitalAdminById(
            @PathVariable Long adminId) {

        return ResponseEntity.ok(
                hospitalAdminService.getHospitalAdminById(adminId));
    }

    /**
     * Update Hospital Admin
     */
    @PutMapping("/{adminId}")
    public ResponseEntity<HospitalAdminResponse> updateHospitalAdmin(
            @PathVariable Long adminId,
            @Valid @RequestBody HospitalAdminRequest request) {

        return ResponseEntity.ok(
                hospitalAdminService.updateHospitalAdmin(adminId, request));
    }

    /**
     * Soft Delete Hospital Admin
     */
    @DeleteMapping("/{adminId}")
    public ResponseEntity<String> deleteHospitalAdmin(
            @PathVariable Long adminId) {

        hospitalAdminService.deleteHospitalAdmin(adminId);

        return ResponseEntity.ok(
                "Hospital Admin deleted successfully.");
    }

    /**
     * Approve Hospital Admin Request
     */
    @PutMapping("/{adminId}/approve")
    public ResponseEntity<HospitalAdminResponse> approveHospitalAdmin(
            @PathVariable Long adminId) {

        return ResponseEntity.ok(
                hospitalAdminService.approveHospitalAdmin(adminId));
    }

    /**
     * Reject Hospital Admin Request
     */
    @PutMapping("/{adminId}/reject")
    public ResponseEntity<HospitalAdminResponse> rejectHospitalAdmin(
            @PathVariable Long adminId) {

        return ResponseEntity.ok(
                hospitalAdminService.rejectHospitalAdmin(adminId));
    }

}