package com.mediqueue.serviceimpl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.mediqueue.dto.request.HospitalDepartmentRequest;
import com.mediqueue.dto.response.HospitalDepartmentResponse;
import com.mediqueue.entity.Department;
import com.mediqueue.entity.Hospital;
import com.mediqueue.entity.HospitalDepartment;
import com.mediqueue.exception.BadRequestException;
import com.mediqueue.exception.ResourceNotFoundException;
import com.mediqueue.mapper.HospitalDepartmentMapper;
import com.mediqueue.repository.DepartmentRepository;
import com.mediqueue.repository.HospitalDepartmentRepository;
import com.mediqueue.repository.HospitalRepository;
import com.mediqueue.service.HospitalDepartmentService;

@Service
public class HospitalDepartmentServiceImpl
        implements HospitalDepartmentService {

    private final HospitalDepartmentRepository hospitalDepartmentRepository;
    private final HospitalRepository hospitalRepository;
    private final DepartmentRepository departmentRepository;
    private final HospitalDepartmentMapper hospitalDepartmentMapper;

    public HospitalDepartmentServiceImpl(
            HospitalDepartmentRepository hospitalDepartmentRepository,
            HospitalRepository hospitalRepository,
            DepartmentRepository departmentRepository,
            HospitalDepartmentMapper hospitalDepartmentMapper) {

        this.hospitalDepartmentRepository = hospitalDepartmentRepository;
        this.hospitalRepository = hospitalRepository;
        this.departmentRepository = departmentRepository;
        this.hospitalDepartmentMapper = hospitalDepartmentMapper;
    }

    @Override
    public HospitalDepartmentResponse createHospitalDepartment(
            HospitalDepartmentRequest request) {

        Hospital hospital = hospitalRepository
                .findByHospitalIdAndActiveTrue(request.getHospitalId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Hospital not found."));

        Department department = departmentRepository
                .findByDepartmentIdAndActiveTrue(request.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Department not found."));

        hospitalDepartmentRepository
                .findByHospitalAndDepartmentAndActiveTrue(hospital, department)
                .ifPresent(mapping -> {
                    throw new BadRequestException(
                            "Department already mapped to this hospital.");
                });

        HospitalDepartment mapping =
                hospitalDepartmentMapper.toEntity(request);

        mapping.setHospital(hospital);
        mapping.setDepartment(department);
        mapping.setAvailableToday(true);
        mapping.setActive(true);
        mapping.setCreatedAt(LocalDateTime.now());
        mapping.setUpdatedAt(LocalDateTime.now());

        HospitalDepartment saved =
                hospitalDepartmentRepository.save(mapping);

        return hospitalDepartmentMapper.toResponse(saved);
    }

    @Override
    public List<HospitalDepartmentResponse> getAllHospitalDepartments() {

        return hospitalDepartmentRepository.findByActiveTrue()
                .stream()
                .map(hospitalDepartmentMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public HospitalDepartmentResponse getHospitalDepartmentById(
            Long hospitalDepartmentId) {

        HospitalDepartment mapping = hospitalDepartmentRepository
                .findByHospitalDepartmentIdAndActiveTrue(
                        hospitalDepartmentId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Hospital Department mapping not found."));

        return hospitalDepartmentMapper.toResponse(mapping);
    }

    
    @Override
    public List<HospitalDepartmentResponse> getDepartmentsByHospital(
            Long hospitalId) {

        return hospitalDepartmentRepository
                .findByHospitalHospitalIdAndActiveTrue(hospitalId)
                .stream()
                .map(hospitalDepartmentMapper::toResponse)
                .toList();
    }
    
    @Override
    public HospitalDepartmentResponse updateHospitalDepartment(
            Long hospitalDepartmentId,
            HospitalDepartmentRequest request) {

        HospitalDepartment mapping = hospitalDepartmentRepository
                .findByHospitalDepartmentIdAndActiveTrue(
                        hospitalDepartmentId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Hospital Department mapping not found."));

        Hospital hospital = hospitalRepository
                .findByHospitalIdAndActiveTrue(request.getHospitalId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Hospital not found."));

        Department department = departmentRepository
                .findByDepartmentIdAndActiveTrue(request.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Department not found."));

        hospitalDepartmentRepository
                .findByHospitalAndDepartmentAndActiveTrue(
                        hospital,
                        department)
                .filter(existing -> !existing.getHospitalDepartmentId()
                        .equals(hospitalDepartmentId))
                .ifPresent(existing -> {
                    throw new BadRequestException(
                            "Department already mapped to this hospital.");
                });

        mapping.setHospital(hospital);
        mapping.setDepartment(department);
        mapping.setConsultationFee(request.getConsultationFee());
        mapping.setDailyTokenLimit(request.getDailyTokenLimit());
        mapping.setAverageConsultationTime(
                request.getAverageConsultationTime());
        mapping.setUpdatedAt(LocalDateTime.now());

        HospitalDepartment updated =
                hospitalDepartmentRepository.save(mapping);

        return hospitalDepartmentMapper.toResponse(updated);
    }

    @Override
    public void deleteHospitalDepartment(Long hospitalDepartmentId) {

        HospitalDepartment mapping = hospitalDepartmentRepository
                .findByHospitalDepartmentIdAndActiveTrue(
                        hospitalDepartmentId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Hospital Department mapping not found."));

        mapping.setActive(false);
        mapping.setUpdatedAt(LocalDateTime.now());

        hospitalDepartmentRepository.save(mapping);
    }
}