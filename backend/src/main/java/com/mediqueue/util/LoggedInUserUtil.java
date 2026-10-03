package com.mediqueue.util;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import com.mediqueue.entity.User;
import com.mediqueue.exception.ResourceNotFoundException;
import com.mediqueue.repository.UserRepository;

@Component
public class LoggedInUserUtil {

    private final UserRepository userRepository;

    public LoggedInUserUtil(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Returns currently logged-in user
     */
    public User getLoggedInUser() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Logged-in user not found."));
    }

}