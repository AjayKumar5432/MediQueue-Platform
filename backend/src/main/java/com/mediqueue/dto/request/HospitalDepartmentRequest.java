package com.mediqueue.dto.request;

import java.math.BigDecimal;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class HospitalDepartmentRequest {

    @NotNull(message = "Hospital Id is required.")
    private Long hospitalId;

    @NotNull(message = "Department Id is required.")
    private Long departmentId;

    @NotNull(message = "Consultation fee is required.")
    @DecimalMin(value = "0.0", inclusive = false,
            message = "Consultation fee must be greater than zero.")
    private BigDecimal consultationFee;

    @NotNull(message = "Daily token limit is required.")
    @Min(value = 1, message = "Daily token limit must be at least 1.")
    private Integer dailyTokenLimit;

    @NotNull(message = "Average consultation time is required.")
    @Min(value = 1,
            message = "Average consultation time must be at least 1 minute.")
    private Integer averageConsultationTime;

    public HospitalDepartmentRequest() {
    }

    public Long getHospitalId() {
        return hospitalId;
    }

    public void setHospitalId(Long hospitalId) {
        this.hospitalId = hospitalId;
    }

    public Long getDepartmentId() {
        return departmentId;
    }

    public void setDepartmentId(Long departmentId) {
        this.departmentId = departmentId;
    }

    public BigDecimal getConsultationFee() {
        return consultationFee;
    }

    public void setConsultationFee(BigDecimal consultationFee) {
        this.consultationFee = consultationFee;
    }

    public Integer getDailyTokenLimit() {
        return dailyTokenLimit;
    }

    public void setDailyTokenLimit(Integer dailyTokenLimit) {
        this.dailyTokenLimit = dailyTokenLimit;
    }

    public Integer getAverageConsultationTime() {
        return averageConsultationTime;
    }

    public void setAverageConsultationTime(Integer averageConsultationTime) {
        this.averageConsultationTime = averageConsultationTime;
    }
}