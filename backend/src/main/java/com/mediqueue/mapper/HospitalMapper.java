package com.mediqueue.mapper;

import org.springframework.stereotype.Component;

import com.mediqueue.dto.request.HospitalRequest;
import com.mediqueue.dto.response.HospitalResponse;
import com.mediqueue.entity.Hospital;

@Component
public class HospitalMapper {

    // Request DTO -> Entity
    public Hospital toEntity(HospitalRequest request) {

        Hospital hospital = new Hospital();

        hospital.setHospitalName(request.getHospitalName());
        hospital.setAddress(request.getAddress());
        hospital.setCity(request.getCity());
        hospital.setState(request.getState());
        hospital.setPhoneNumber(request.getPhoneNumber());
        hospital.setEmail(request.getEmail());

        return hospital;
    }

    // Entity -> Response DTO
    public HospitalResponse toResponse(Hospital hospital) {

        HospitalResponse response = new HospitalResponse();

        response.setHospitalId(hospital.getHospitalId());
        response.setHospitalName(hospital.getHospitalName());
        response.setAddress(hospital.getAddress());
        response.setCity(hospital.getCity());
        response.setState(hospital.getState());
        response.setPhoneNumber(hospital.getPhoneNumber());
        response.setEmail(hospital.getEmail());
        response.setActive(hospital.getActive());

        return response;
    }

}