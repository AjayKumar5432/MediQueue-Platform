package com.mediqueue.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class HospitalAdminRequest {

    @NotBlank(message = "Full name is required.")
    @Size(max = 100)
    private String fullName;

    @NotBlank(message = "Email is required.")
    @Email(message = "Invalid email format.")
    private String email;

    @NotBlank(message = "Phone number is required.")
    @Pattern(regexp = "^[6-9]\\d{9}$",
            message = "Invalid phone number.")
    private String phone;

    @NotBlank(message = "Password is required.")
    @Size(min = 6, message = "Password must contain at least 6 characters.")
    private String password;

    @NotNull(message = "Hospital Id is required.")
    private Long hospitalId;

    public HospitalAdminRequest() {
    }


    public HospitalAdminRequest(@NotBlank(message = "Full name is required.") @Size(max = 100) String fullName,
			@NotBlank(message = "Email is required.") @Email(message = "Invalid email format.") String email,
			@NotBlank(message = "Phone number is required.") @Pattern(regexp = "^[6-9]\\d{9}$", message = "Invalid phone number.") String phone,
			@NotBlank(message = "Password is required.") @Size(min = 6, message = "Password must contain at least 6 characters.") String password,
			@NotNull(message = "Hospital Id is required.") Long hospitalId) {
		super();
		this.fullName = fullName;
		this.email = email;
		this.phone = phone;
		this.password = password;
		this.hospitalId = hospitalId;
	}



	public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Long getHospitalId() {
        return hospitalId;
    }

    public void setHospitalId(Long hospitalId) {
        this.hospitalId = hospitalId;
    }
}