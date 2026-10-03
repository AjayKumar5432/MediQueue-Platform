package com.mediqueue.mapper;

import org.springframework.stereotype.Component;

import com.mediqueue.dto.request.DepartmentRequest;
import com.mediqueue.dto.response.DepartmentResponse;
import com.mediqueue.entity.Department;

@Component
public class DepartmentMapper {

    /**
     * Request DTO -> Entity
     */
    public Department toEntity(DepartmentRequest request) {

        if (request == null) {
            return null;
        }

        Department department = new Department();

        department.setDepartmentName(request.getDepartmentName());
        department.setDescription(request.getDescription());
        department.setDepartmentCode(request.getDepartmentCode());

        return department;
    }

    /**
     * Entity -> Response DTO
     */
    public DepartmentResponse toResponse(Department department) {

        if (department == null) {
            return null;
        }

        DepartmentResponse response = new DepartmentResponse();

        response.setDepartmentId(department.getDepartmentId());
        response.setDepartmentName(department.getDepartmentName());
        response.setDepartmentCode(department.getDepartmentCode());
        response.setDescription(department.getDescription());
        response.setActive(department.getActive());
        response.setCreatedAt(department.getCreatedAt());
        response.setUpdatedAt(department.getUpdatedAt());

        return response;
    }
}