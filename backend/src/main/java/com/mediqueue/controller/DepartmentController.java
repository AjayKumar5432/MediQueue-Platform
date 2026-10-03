package com.mediqueue.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.mediqueue.dto.request.DepartmentRequest;
import com.mediqueue.dto.response.DepartmentResponse;
import com.mediqueue.service.DepartmentService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/super-admin/departments")
@Validated
public class DepartmentController {

    private final DepartmentService departmentService;

    public DepartmentController(DepartmentService departmentService) {
        this.departmentService = departmentService;
    }

    /**
     * Create Department
     */
    @PostMapping
    public ResponseEntity<DepartmentResponse> createDepartment(
            @Valid @RequestBody DepartmentRequest request) {

        DepartmentResponse response =
                departmentService.createDepartment(request);

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /**
     * Get All Departments
     */
    @GetMapping
    public ResponseEntity<List<DepartmentResponse>> getAllDepartments() {

        List<DepartmentResponse> departments =
                departmentService.getAllDepartments();

        return ResponseEntity.ok(departments);
    }

    /**
     * Get Department By Id
     */
    @GetMapping("/{departmentId}")
    public ResponseEntity<DepartmentResponse> getDepartmentById(
            @PathVariable Long departmentId) {

        DepartmentResponse response =
                departmentService.getDepartmentById(departmentId);

        return ResponseEntity.ok(response);
    }

    /**
     * Update Department
     */
    @PutMapping("/{departmentId}")
    public ResponseEntity<DepartmentResponse> updateDepartment(
            @PathVariable Long departmentId,
            @Valid @RequestBody DepartmentRequest request) {

        DepartmentResponse response =
                departmentService.updateDepartment(departmentId, request);

        return ResponseEntity.ok(response);
    }

    /**
     * Soft Delete Department
     */
    @DeleteMapping("/{departmentId}")
    public ResponseEntity<String> deleteDepartment(
            @PathVariable Long departmentId) {

        departmentService.deleteDepartment(departmentId);

        return ResponseEntity.ok("Department deleted successfully.");
    }
}