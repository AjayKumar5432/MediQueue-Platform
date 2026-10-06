package com.mediqueue.mapper;

import org.springframework.stereotype.Component;

import com.mediqueue.dto.response.TokenResponse;
import com.mediqueue.entity.Token;

@Component
public class TokenMapper {

    /**
     * Convert Token Entity to Response DTO
     */
    public TokenResponse toResponse(Token token) {

        if (token == null) {
            return null;
        }

        TokenResponse response = new TokenResponse();

        response.setTokenId(token.getTokenId());

        response.setTokenNumber(token.getTokenNumber());

        response.setCustomerName(token.getCustomer().getFullName());

        response.setHospitalName(
                token.getHospitalDepartment()
                     .getHospital()
                     .getHospitalName());

        response.setDepartmentName(
                token.getHospitalDepartment()
                     .getDepartment()
                     .getDepartmentName());

        response.setBookingSource(
                token.getBookingSource());

        response.setStatus(
                token.getStatus());

        response.setBookingDate(
                token.getBookingDate());

        response.setBookedAt(
                token.getBookedAt());

        response.setEstimatedTime(
                token.getEstimatedTime());

        if (token.getHospitalDepartment() != null) {
            response.setConsultationFee(token.getHospitalDepartment().getConsultationFee());
        }

        return response;
    }

}