package com.mediqueue.mapper;

import org.springframework.stereotype.Component;

import com.mediqueue.dto.request.HospitalDepartmentRequest;
import com.mediqueue.dto.response.HospitalDepartmentResponse;
import com.mediqueue.entity.HospitalDepartment;

@Component
public class HospitalDepartmentMapper {

    /**
     * Request DTO -> Entity
     */
    public HospitalDepartment toEntity(HospitalDepartmentRequest request) {

        if (request == null) {
            return null;
        }

        HospitalDepartment mapping = new HospitalDepartment();

        mapping.setConsultationFee(request.getConsultationFee());
        mapping.setDailyTokenLimit(request.getDailyTokenLimit());
        mapping.setAverageConsultationTime(
                request.getAverageConsultationTime());

        return mapping;
    }

    /**
     * Entity -> Response DTO
     */
    public HospitalDepartmentResponse toResponse(
            HospitalDepartment mapping) {

        if (mapping == null) {
            return null;
        }

        HospitalDepartmentResponse response =
                new HospitalDepartmentResponse();

        response.setHospitalDepartmentId(
                mapping.getHospitalDepartmentId());

        response.setHospitalId(
                mapping.getHospital().getHospitalId());

        response.setHospitalName(
                mapping.getHospital().getHospitalName());

        response.setDepartmentId(
                mapping.getDepartment().getDepartmentId());

        response.setDepartmentName(
                mapping.getDepartment().getDepartmentName());

        response.setConsultationFee(
                mapping.getConsultationFee());

        response.setDailyTokenLimit(
                mapping.getDailyTokenLimit());

        response.setAverageConsultationTime(
                mapping.getAverageConsultationTime());

        response.setAvailableToday(
                mapping.getAvailableToday());

        response.setActive(
                mapping.getActive());

        response.setCreatedAt(
                mapping.getCreatedAt());

        response.setUpdatedAt(
                mapping.getUpdatedAt());

        return response;
    }
}