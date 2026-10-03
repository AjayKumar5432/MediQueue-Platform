package com.mediqueue.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.mediqueue.entity.Department;
import com.mediqueue.entity.Hospital;
import com.mediqueue.entity.HospitalDepartment;

@Repository
public interface HospitalDepartmentRepository
        extends JpaRepository<HospitalDepartment, Long> {

    Optional<HospitalDepartment> findByHospitalDepartmentIdAndActiveTrue(
            Long hospitalDepartmentId);

    List<HospitalDepartment> findByActiveTrue();

    List<HospitalDepartment> findByHospitalAndActiveTrue(Hospital hospital);

    List<HospitalDepartment> findByDepartmentAndActiveTrue(Department department);

    Optional<HospitalDepartment> findByHospitalAndDepartmentAndActiveTrue(
            Hospital hospital,
            Department department);

    List<HospitalDepartment> findByHospitalHospitalIdAndActiveTrue(
            Long hospitalId);
}