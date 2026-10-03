package com.mediqueue.service;

import java.util.List;

import com.mediqueue.dto.request.HospitalAdminRequest;
import com.mediqueue.dto.response.HospitalAdminResponse;
import com.mediqueue.dto.response.HospitalDepartmentResponse;

public interface HospitalAdminService {

    HospitalAdminResponse createHospitalAdmin(
            HospitalAdminRequest request);

    List<HospitalAdminResponse> getAllHospitalAdmins();

    HospitalAdminResponse getHospitalAdminById(Long userId);
       HospitalAdminResponse updateHospitalAdmin(
            Long userId,
            HospitalAdminRequest request);

    void deleteHospitalAdmin(Long userId);

    HospitalAdminResponse approveHospitalAdmin(Long userId);

    HospitalAdminResponse rejectHospitalAdmin(Long userId);

}