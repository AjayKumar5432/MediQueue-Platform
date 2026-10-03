package com.mediqueue.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.mediqueue.dto.request.HospitalDepartmentRequest;
import com.mediqueue.dto.response.HospitalDepartmentResponse;
import com.mediqueue.service.HospitalDepartmentService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/super-admin/hospital-departments")
@Validated
public class HospitalDepartmentController {

    private final HospitalDepartmentService hospitalDepartmentService;

    public HospitalDepartmentController(
            HospitalDepartmentService hospitalDepartmentService) {
        this.hospitalDepartmentService = hospitalDepartmentService;
    }

    /**
     * Create Hospital Department Mapping
     */
    @PostMapping
    public ResponseEntity<HospitalDepartmentResponse> createHospitalDepartment(
            @Valid @RequestBody HospitalDepartmentRequest request) {

        HospitalDepartmentResponse response =
                hospitalDepartmentService.createHospitalDepartment(request);

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /**
     * Get All Hospital Department Mappings
     */
    @GetMapping
    public ResponseEntity<List<HospitalDepartmentResponse>> getAllHospitalDepartments() {

        return ResponseEntity.ok(
                hospitalDepartmentService.getAllHospitalDepartments());
    }

    /**
     * Get Hospital Department Mapping By Id
     */
    @GetMapping("/{hospitalDepartmentId}")
    public ResponseEntity<HospitalDepartmentResponse> getHospitalDepartmentById(
            @PathVariable Long hospitalDepartmentId) {

        return ResponseEntity.ok(
                hospitalDepartmentService.getHospitalDepartmentById(
                        hospitalDepartmentId));
    }
    
    
    /**
     * Get Departments By Hospital
     */
    @GetMapping("/hospital/{hospitalId}")
    public ResponseEntity<List<HospitalDepartmentResponse>>
    getDepartmentsByHospital(
            @PathVariable Long hospitalId) {

        return ResponseEntity.ok(
                hospitalDepartmentService
                        .getDepartmentsByHospital(hospitalId));
    }

    /**
     * Update Hospital Department Mapping
     */
    @PutMapping("/{hospitalDepartmentId}")
    public ResponseEntity<HospitalDepartmentResponse> updateHospitalDepartment(
            @PathVariable Long hospitalDepartmentId,
            @Valid @RequestBody HospitalDepartmentRequest request) {

        return ResponseEntity.ok(
                hospitalDepartmentService.updateHospitalDepartment(
                        hospitalDepartmentId,
                        request));
    }

    /**
     * Soft Delete Hospital Department Mapping
     */
    @DeleteMapping("/{hospitalDepartmentId}")
    public ResponseEntity<String> deleteHospitalDepartment(
            @PathVariable Long hospitalDepartmentId) {

        hospitalDepartmentService.deleteHospitalDepartment(
                hospitalDepartmentId);

        return ResponseEntity.ok(
                "Hospital Department deleted successfully.");
    }
    
    
    
}