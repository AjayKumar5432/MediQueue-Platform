package com.mediqueue.service;

import java.util.List;

import com.mediqueue.dto.request.DepartmentRequest;
import com.mediqueue.dto.response.DepartmentResponse;

public interface DepartmentService {

    DepartmentResponse createDepartment(DepartmentRequest request);

    List<DepartmentResponse> getAllDepartments();

    DepartmentResponse getDepartmentById(Long departmentId);

    DepartmentResponse updateDepartment(Long departmentId, DepartmentRequest request);

    void deleteDepartment(Long departmentId);

}