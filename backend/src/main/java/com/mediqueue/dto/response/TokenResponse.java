package com.mediqueue.dto.response;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.mediqueue.enums.BookingSource;
import com.mediqueue.enums.QueueStatus;

public class TokenResponse {

    private Long tokenId;

    private String tokenNumber;

    private String customerName;

    private String hospitalName;

    private String departmentName;

    private BookingSource bookingSource;

    private QueueStatus status;

    private LocalDate bookingDate;

    private LocalDateTime bookedAt;

    private LocalDateTime estimatedTime;

    private java.math.BigDecimal consultationFee;

    public TokenResponse() {
    }

    public Long getTokenId() {
        return tokenId;
    }

    public void setTokenId(Long tokenId) {
        this.tokenId = tokenId;
    }

    public String getTokenNumber() {
        return tokenNumber;
    }

    public void setTokenNumber(String tokenNumber) {
        this.tokenNumber = tokenNumber;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getHospitalName() {
        return hospitalName;
    }

    public void setHospitalName(String hospitalName) {
        this.hospitalName = hospitalName;
    }

    public String getDepartmentName() {
        return departmentName;
    }

    public void setDepartmentName(String departmentName) {
        this.departmentName = departmentName;
    }

    public BookingSource getBookingSource() {
        return bookingSource;
    }

    public void setBookingSource(BookingSource bookingSource) {
        this.bookingSource = bookingSource;
    }

    public QueueStatus getStatus() {
        return status;
    }

    public void setStatus(QueueStatus status) {
        this.status = status;
    }

    public LocalDate getBookingDate() {
        return bookingDate;
    }

    public void setBookingDate(LocalDate bookingDate) {
        this.bookingDate = bookingDate;
    }

    public LocalDateTime getBookedAt() {
        return bookedAt;
    }

    public void setBookedAt(LocalDateTime bookedAt) {
        this.bookedAt = bookedAt;
    }

    public LocalDateTime getEstimatedTime() {
        return estimatedTime;
    }

    public void setEstimatedTime(LocalDateTime estimatedTime) {
        this.estimatedTime = estimatedTime;
    }

    public java.math.BigDecimal getConsultationFee() {
        return consultationFee;
    }

    public void setConsultationFee(java.math.BigDecimal consultationFee) {
        this.consultationFee = consultationFee;
    }
}