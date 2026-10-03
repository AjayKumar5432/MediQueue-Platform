package com.mediqueue.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mediqueue.entity.Hospital;

public interface HospitalRepository extends JpaRepository<Hospital, Long> {

    Optional<Hospital> findByHospitalName(String hospitalName);

    Optional<Hospital> findByEmail(String email);

    Optional<Hospital> findByPhoneNumber(String phoneNumber);

    List<Hospital> findByActiveTrue();

    Optional<Hospital> findByHospitalIdAndActiveTrue(Long hospitalId);
}