package com.mediqueue.serviceimpl;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.mediqueue.dto.request.UserRequest;
import com.mediqueue.dto.response.UserResponse;
import com.mediqueue.entity.User;
import com.mediqueue.enums.Role;
import com.mediqueue.exception.DuplicateResourceException;
import com.mediqueue.mapper.UserMapper;
import com.mediqueue.repository.UserRepository;
import com.mediqueue.service.UserService;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public UserResponse registerUser(UserRequest request) {

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new DuplicateResourceException("Email already registered.");
        }

        if (userRepository.findByPhone(request.getPhone()).isPresent()) {
            throw new DuplicateResourceException("Phone number already registered.");
        }

        User user = userMapper.toEntity(request);

        // Encrypt Password
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        // ===== Business Rules =====
        user.setRole(Role.CUSTOMER);      // Assign default role
        user.setActive(true);             // Active by default
        user.setHospital(null);           // Customer is not linked to a hospital
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        User savedUser = userRepository.save(user);

        return userMapper.toResponse(savedUser);
    }
}