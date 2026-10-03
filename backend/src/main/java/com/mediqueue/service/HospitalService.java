package com.mediqueue.service;

import java.util.List;

import com.mediqueue.dto.request.HospitalRequest;
import com.mediqueue.dto.response.HospitalResponse;

public interface HospitalService {

    HospitalResponse createHospital(HospitalRequest request);

    List<HospitalResponse> getAllHospitals();

    HospitalResponse getHospitalById(Long hospitalId);

    HospitalResponse updateHospital(Long hospitalId, HospitalRequest request);

    void deleteHospital(Long hospitalId);

}