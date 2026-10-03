package com.mediqueue.config;

import java.time.LocalDateTime;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.mediqueue.entity.User;
import com.mediqueue.enums.Role;
import com.mediqueue.repository.UserRepository;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {

        // Check whether a SUPER_ADMIN already exists
        if (userRepository.findByRole(Role.SUPER_ADMIN).isEmpty()) {

            User superAdmin = new User();

            superAdmin.setFullName("System Super Admin");
            superAdmin.setEmail("superadmin@mediqueue.com");
            superAdmin.setPhone("9999999999");
            superAdmin.setPassword(passwordEncoder.encode("Admin@123"));
            superAdmin.setRole(Role.SUPER_ADMIN);

            superAdmin.setHospital(null);

            superAdmin.setActive(true);
            superAdmin.setCreatedAt(LocalDateTime.now());
            superAdmin.setUpdatedAt(LocalDateTime.now());

            userRepository.save(superAdmin);

            System.out.println("======================================");
            System.out.println(" Default SUPER_ADMIN created.");
            System.out.println(" Email    : superadmin@mediqueue.com");
            System.out.println(" Password : Admin@123");
            System.out.println("======================================");

        } else {

            System.out.println("SUPER_ADMIN already exists.");
        }
    }
}