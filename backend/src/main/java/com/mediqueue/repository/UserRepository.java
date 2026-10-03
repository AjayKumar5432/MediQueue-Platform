package com.mediqueue.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mediqueue.entity.Hospital;
import com.mediqueue.entity.User;
import com.mediqueue.enums.Role;

public interface UserRepository extends JpaRepository<User, Long> {

    /*
     * Authentication
     */
    Optional<User> findByEmail(String email);

    Optional<User> findByPhone(String phone);

    /*
     * Role Queries
     */
    List<User> findByRole(Role role);

    List<User> findByRoleAndActiveTrue(Role role);

    /*
     * Hospital Admin Queries
     */
    Optional<User> findByHospitalAndRoleAndActiveTrue(
            Hospital hospital,
            Role role);

    /*
     * Staff Queries
     */
    List<User> findAllByHospitalAndRoleAndActiveTrue(
            Hospital hospital,
            Role role);

    
}