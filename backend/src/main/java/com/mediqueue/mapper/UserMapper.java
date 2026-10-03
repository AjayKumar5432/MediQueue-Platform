package com.mediqueue.mapper;

import java.time.LocalDateTime;

import org.springframework.stereotype.Component;

import com.mediqueue.dto.request.UserRequest;
import com.mediqueue.dto.response.UserResponse;
import com.mediqueue.entity.User;

@Component
public class UserMapper {

    // Request DTO -> Entity
    public User toEntity(UserRequest request) {

        User user = new User();

        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setPassword(request.getPassword());
        user.setRole(request.getRole());

        user.setActive(true);

        user.setCreatedAt(LocalDateTime.now());

        user.setUpdatedAt(LocalDateTime.now());

        return user;
    }

    // Entity -> Response DTO
    public UserResponse toResponse(User user) {

        UserResponse response = new UserResponse();

        response.setId(user.getId());
        response.setFullName(user.getFullName());
        response.setEmail(user.getEmail());
        response.setPhone(user.getPhone());
        response.setRole(user.getRole());
        response.setActive(user.getActive());
        response.setCreatedAt(user.getCreatedAt());

        return response;
    }

}