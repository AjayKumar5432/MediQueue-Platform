package com.mediqueue.serviceimpl;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.mediqueue.dto.request.HospitalRequest;
import com.mediqueue.dto.response.HospitalResponse;
import com.mediqueue.entity.Hospital;
import com.mediqueue.exception.BadRequestException;
import com.mediqueue.exception.ResourceNotFoundException;
import com.mediqueue.mapper.HospitalMapper;
import com.mediqueue.repository.HospitalRepository;
import com.mediqueue.service.HospitalService;

@Service
public class HospitalServiceImpl implements HospitalService {

    private final HospitalRepository hospitalRepository;
    private final HospitalMapper hospitalMapper;

    public HospitalServiceImpl(HospitalRepository hospitalRepository,
                               HospitalMapper hospitalMapper) {
        this.hospitalRepository = hospitalRepository;
        this.hospitalMapper = hospitalMapper;
    }

    @Override
    public HospitalResponse createHospital(HospitalRequest request) {

        validateHospital(request, null);

        Hospital hospital = hospitalMapper.toEntity(request);

        hospital.setActive(true);
        hospital.setCreatedAt(LocalDateTime.now());
        hospital.setUpdatedAt(LocalDateTime.now());

        Hospital savedHospital = hospitalRepository.save(hospital);

        return hospitalMapper.toResponse(savedHospital);
    }

    @Override
    public List<HospitalResponse> getAllHospitals() {

        return hospitalRepository.findByActiveTrue()
                .stream()
                .map(hospitalMapper::toResponse)
                .toList();
    }

    @Override
    public HospitalResponse getHospitalById(Long hospitalId) {

        Hospital hospital = getActiveHospital(hospitalId);

        return hospitalMapper.toResponse(hospital);
    }

    @Override
    public HospitalResponse updateHospital(Long hospitalId, HospitalRequest request) {

        Hospital hospital = getActiveHospital(hospitalId);

        validateHospital(request, hospitalId);

        hospital.setHospitalName(request.getHospitalName());
        hospital.setAddress(request.getAddress());
        hospital.setCity(request.getCity());
        hospital.setState(request.getState());
        hospital.setPhoneNumber(request.getPhoneNumber());
        hospital.setEmail(request.getEmail());
        hospital.setUpdatedAt(LocalDateTime.now());

        Hospital updatedHospital = hospitalRepository.save(hospital);

        return hospitalMapper.toResponse(updatedHospital);
    }

    @Override
    public void deleteHospital(Long hospitalId) {

        Hospital hospital = getActiveHospital(hospitalId);

        hospital.setActive(false);
        hospital.setUpdatedAt(LocalDateTime.now());

        hospitalRepository.save(hospital);
    }

    /**
     * Fetch Active Hospital
     */
    private Hospital getActiveHospital(Long hospitalId) {

        return hospitalRepository.findByHospitalIdAndActiveTrue(hospitalId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Hospital not found with id : " + hospitalId));
    }

    /**
     * Common Validation for Create & Update
     */
    private void validateHospital(HospitalRequest request, Long hospitalId) {

        hospitalRepository.findByHospitalName(request.getHospitalName())
                .filter(existing ->
                        hospitalId == null ||
                        !existing.getHospitalId().equals(hospitalId))
                .ifPresent(existing -> {
                    throw new BadRequestException("Hospital name already exists.");
                });

        hospitalRepository.findByEmail(request.getEmail())
                .filter(existing ->
                        hospitalId == null ||
                        !existing.getHospitalId().equals(hospitalId))
                .ifPresent(existing -> {
                    throw new BadRequestException("Hospital email already exists.");
                });

        hospitalRepository.findByPhoneNumber(request.getPhoneNumber())
                .filter(existing ->
                        hospitalId == null ||
                        !existing.getHospitalId().equals(hospitalId))
                .ifPresent(existing -> {
                    throw new BadRequestException("Hospital phone number already exists.");
                });
    }
}