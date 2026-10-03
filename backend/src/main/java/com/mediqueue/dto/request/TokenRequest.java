package com.mediqueue.dto.request;

import jakarta.validation.constraints.NotNull;

import com.mediqueue.enums.BookingSource;

public class TokenRequest {

    @NotNull(message = "Hospital Department Id is required.")
    private Long hospitalDepartmentId;

    @NotNull(message = "Booking source is required.")
    private BookingSource bookingSource;
   
    
        // Required only for WALK_IN booking
        private Long customerId;

       

    

    public TokenRequest() {
    }

    public Long getHospitalDepartmentId() {
        return hospitalDepartmentId;
    }

    public void setHospitalDepartmentId(Long hospitalDepartmentId) {
        this.hospitalDepartmentId = hospitalDepartmentId;
    }

    public BookingSource getBookingSource() {
        return bookingSource;
    }

    public void setBookingSource(BookingSource bookingSource) {
        this.bookingSource = bookingSource;
    }

	public Long getCustomerId() {
		return customerId;
	}

	public void setCustomerId(Long customerId) {
		this.customerId = customerId;
	}
    
}