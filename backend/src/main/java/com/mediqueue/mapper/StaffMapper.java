package com.mediqueue.mapper;

import org.springframework.stereotype.Component;

import com.mediqueue.dto.request.StaffRequest;
import com.mediqueue.dto.response.StaffResponse;
import com.mediqueue.entity.User;

@Component
public class StaffMapper {

    /**
     * Convert StaffRequest to User Entity
     */
    public User toEntity(StaffRequest request) {

        if (request == null) {
            return null;
        }

        User user = new User();

        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setPassword(request.getPassword());

        return user;
    }

    /**
     * Convert User Entity to StaffResponse
     */
    public StaffResponse toResponse(User user) {

        if (user == null) {
            return null;
        }

        StaffResponse response = new StaffResponse();

        response.setId(user.getId());
        response.setFullName(user.getFullName());
        response.setEmail(user.getEmail());
        response.setPhone(user.getPhone());

        if (user.getHospital() != null) {

            response.setHospitalId(user.getHospital().getHospitalId());
            response.setHospitalName(user.getHospital().getHospitalName());
        }

        if (user.getRole() != null) {
            response.setRole(user.getRole().name());
        }

        response.setActive(user.getActive());
        response.setCreatedAt(user.getCreatedAt());
        response.setUpdatedAt(user.getUpdatedAt());

        return response;
    }
}