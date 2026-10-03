package com.mediqueue.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.mediqueue.entity.Department;

@Repository
public interface DepartmentRepository extends JpaRepository<Department, Long> {

    Optional<Department> findByDepartmentName(String departmentName);

    List<Department> findByActiveTrue();

    Optional<Department> findByDepartmentIdAndActiveTrue(Long departmentId);

}