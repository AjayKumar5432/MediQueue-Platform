package com.mediqueue.mapper;

import org.springframework.stereotype.Component;

import com.mediqueue.dto.request.HospitalAdminRequest;
import com.mediqueue.dto.response.HospitalAdminResponse;
import com.mediqueue.entity.User;

@Component
public class HospitalAdminMapper {

    /**
     * Request DTO -> User Entity
     */
    public User toEntity(HospitalAdminRequest request) {

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
     * User Entity -> Response DTO
     */
    public HospitalAdminResponse toResponse(User user) {

        if (user == null) {
            return null;
        }

        HospitalAdminResponse response = new HospitalAdminResponse();

        response.setId(user.getId());
        response.setFullName(user.getFullName());
        response.setEmail(user.getEmail());
        response.setPhone(user.getPhone());

        if (user.getHospital() != null) {

            response.setHospitalId(
                    user.getHospital().getHospitalId());

            response.setHospitalName(
                    user.getHospital().getHospitalName());
        }

        if (user.getRole() != null) {
            response.setRole(user.getRole().name());
        }

        response.setActive(user.getActive());
        if (user.getHospital() != null && user.getHospital().getStatus() != null) {
            response.setStatus(user.getHospital().getStatus().name());
        } else {
            response.setStatus(Boolean.TRUE.equals(user.getActive()) ? "ACTIVE" : "PENDING");
        }
        response.setCreatedAt(user.getCreatedAt());
        response.setUpdatedAt(user.getUpdatedAt());


        return response;
    }
}