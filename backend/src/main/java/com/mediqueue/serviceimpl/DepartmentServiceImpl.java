package com.mediqueue.serviceimpl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.mediqueue.dto.request.DepartmentRequest;
import com.mediqueue.dto.response.DepartmentResponse;
import com.mediqueue.entity.Department;
import com.mediqueue.exception.BadRequestException;
import com.mediqueue.exception.ResourceNotFoundException;
import com.mediqueue.mapper.DepartmentMapper;
import com.mediqueue.repository.DepartmentRepository;
import com.mediqueue.service.DepartmentService;

@Service
public class DepartmentServiceImpl implements DepartmentService {

    private final DepartmentRepository departmentRepository;
    private final DepartmentMapper departmentMapper;

    public DepartmentServiceImpl(DepartmentRepository departmentRepository,
                                 DepartmentMapper departmentMapper) {

        this.departmentRepository = departmentRepository;
        this.departmentMapper = departmentMapper;
    }

    @Override
    public DepartmentResponse createDepartment(DepartmentRequest request) {

        validateDepartment(request, null);

        Department department = departmentMapper.toEntity(request);

        department.setActive(true);
        department.setCreatedAt(LocalDateTime.now());
        department.setUpdatedAt(LocalDateTime.now());

        Department savedDepartment = departmentRepository.save(department);

        return departmentMapper.toResponse(savedDepartment);
    }

    @Override
    public List<DepartmentResponse> getAllDepartments() {

        return departmentRepository.findByActiveTrue()
                .stream()
                .map(departmentMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public DepartmentResponse getDepartmentById(Long departmentId) {

        Department department = departmentRepository
                .findByDepartmentIdAndActiveTrue(departmentId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Department not found with id : " + departmentId));

        return departmentMapper.toResponse(department);
    }

    @Override
    public DepartmentResponse updateDepartment(Long departmentId,
                                               DepartmentRequest request) {

        Department department = departmentRepository
                .findByDepartmentIdAndActiveTrue(departmentId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Department not found with id : " + departmentId));

        validateDepartment(request, departmentId);

        department.setDepartmentName(request.getDepartmentName());
        department.setDescription(request.getDescription());
        department.setUpdatedAt(LocalDateTime.now());

        Department updatedDepartment = departmentRepository.save(department);

        return departmentMapper.toResponse(updatedDepartment);
    }

    @Override
    public void deleteDepartment(Long departmentId) {

        Department department = departmentRepository
                .findByDepartmentIdAndActiveTrue(departmentId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Department not found with id : " + departmentId));

        department.setActive(false);
        department.setUpdatedAt(LocalDateTime.now());

        departmentRepository.save(department);
    }

    /**
     * Common validation for Create & Update
     */
    private void validateDepartment(DepartmentRequest request,
                                    Long departmentId) {

        departmentRepository.findByDepartmentName(request.getDepartmentName())
                .filter(existing ->
                        departmentId == null ||
                        !existing.getDepartmentId().equals(departmentId))
                .ifPresent(existing -> {
                    throw new BadRequestException(
                            "Department name already exists.");
                });
    }
}