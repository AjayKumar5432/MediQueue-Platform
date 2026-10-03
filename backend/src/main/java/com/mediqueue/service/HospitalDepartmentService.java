package com.mediqueue.service;

import java.util.List;

import com.mediqueue.dto.request.HospitalDepartmentRequest;
import com.mediqueue.dto.response.HospitalDepartmentResponse;

public interface HospitalDepartmentService {

    HospitalDepartmentResponse createHospitalDepartment(
            HospitalDepartmentRequest request);

    List<HospitalDepartmentResponse> getAllHospitalDepartments();

    HospitalDepartmentResponse getHospitalDepartmentById(
            Long hospitalDepartmentId);

    List<HospitalDepartmentResponse> getDepartmentsByHospital(
            Long hospitalId);

    HospitalDepartmentResponse updateHospitalDepartment(
            Long hospitalDepartmentId,
            HospitalDepartmentRequest request);

    void deleteHospitalDepartment(Long hospitalDepartmentId);

}