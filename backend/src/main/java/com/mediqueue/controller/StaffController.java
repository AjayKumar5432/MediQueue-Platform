package com.mediqueue.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.mediqueue.dto.request.StaffRequest;
import com.mediqueue.dto.response.StaffResponse;
import com.mediqueue.service.StaffService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/hospital-admin/staff")
@Validated
public class StaffController {

    private final StaffService staffService;

    public StaffController(StaffService staffService) {
        this.staffService = staffService;
    }

    /**
     * Create Staff
     */
    @PostMapping
    public ResponseEntity<StaffResponse> createStaff(
            @Valid @RequestBody StaffRequest request) {

        StaffResponse response = staffService.createStaff(request);

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /**
     * Get All Staff
     */
    @GetMapping
    public ResponseEntity<List<StaffResponse>> getAllStaff() {

        return ResponseEntity.ok(staffService.getAllStaff());
    }

    /**
     * Get Staff By Id
     */
    @GetMapping("/{staffId}")
    public ResponseEntity<StaffResponse> getStaffById(
            @PathVariable Long staffId) {

        return ResponseEntity.ok(
                staffService.getStaffById(staffId));
    }

    /**
     * Update Staff
     * (Implementation later)
     */
    @PutMapping("/{staffId}")
    public ResponseEntity<StaffResponse> updateStaff(
            @PathVariable Long staffId,
            @Valid @RequestBody StaffRequest request) {

        return ResponseEntity.ok(
                staffService.updateStaff(staffId, request));
    }

    /**
     * Soft Delete Staff
     * (Implementation later)
     */
    @DeleteMapping("/{staffId}")
    public ResponseEntity<String> deleteStaff(
            @PathVariable Long staffId) {

        staffService.deleteStaff(staffId);

        return ResponseEntity.ok("Staff deleted successfully.");
    }

}