package com.mediqueue.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mediqueue.entity.HospitalDepartment;
import com.mediqueue.entity.Token;
import com.mediqueue.entity.User;
import com.mediqueue.enums.QueueStatus;

public interface TokenRepository extends JpaRepository<Token, Long> {

    /*
     * Find all active tokens of a customer
     */
    List<Token> findByCustomerAndActiveTrue(User customer);

    /*
     * Find today's tokens of a hospital department
     */
    List<Token> findByHospitalDepartmentAndBookingDateAndActiveTrue(
            HospitalDepartment hospitalDepartment,
            LocalDate bookingDate);

    /*
     * Find today's tokens by status
     */
    List<Token> findByHospitalDepartmentAndBookingDateAndStatusAndActiveTrue(
            HospitalDepartment hospitalDepartment,
            LocalDate bookingDate,
            QueueStatus status);

    /*
     * Get the last generated token for today
     */
    Optional<Token> findTopByHospitalDepartmentAndBookingDateOrderByTokenIdDesc(
            HospitalDepartment hospitalDepartment,
            LocalDate bookingDate);

    /*
     * Check if customer already booked today
     */
    boolean existsByCustomerAndHospitalDepartmentAndBookingDateAndActiveTrue(
            User customer,
            HospitalDepartment hospitalDepartment,
            LocalDate bookingDate);
    
    /*
     * Get today's queue ordered by token
     */
    List<Token> findByHospitalDepartmentAndBookingDateAndActiveTrueOrderByTokenIdAsc(
            HospitalDepartment hospitalDepartment,
            LocalDate bookingDate);

    /*
     * Get first waiting token
     */
    Optional<Token> findFirstByHospitalDepartmentAndBookingDateAndStatusAndActiveTrueOrderByTokenIdAsc(
            HospitalDepartment hospitalDepartment,
            LocalDate bookingDate,
            QueueStatus status);

    /*
     * Get current serving token
     */
    Optional<Token> findFirstByHospitalDepartmentAndBookingDateAndStatusAndActiveTrue(
            HospitalDepartment hospitalDepartment,
            LocalDate bookingDate,
            QueueStatus status);
    

    /*
     * Count tokens by status for today's queue
     */
    long countByHospitalDepartmentAndBookingDateAndStatusAndActiveTrue(
            HospitalDepartment hospitalDepartment,
            LocalDate bookingDate,
            QueueStatus status);
}	









