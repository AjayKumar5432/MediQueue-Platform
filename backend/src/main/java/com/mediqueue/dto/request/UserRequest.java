package com.mediqueue.dto.request;

import com.mediqueue.enums.Role;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class UserRequest {

    @NotBlank(message = "Full name is required")
    private String fullName;

    @Email(message = "Invalid email format")
    @NotBlank(message = "Email is required")
    private String email;

    @Pattern(regexp = "^[6-9]\\d{9}$",
             message = "Phone number must be a valid 10-digit Indian mobile number")
    private String phone;

    @Size(min = 6, message = "Password must contain at least 6 characters")
    private String password;

    private Role role;

	public UserRequest() {
		super();
		// TODO Auto-generated constructor stub
	}

	public UserRequest(@NotBlank(message = "Full name is required") String fullName,
			@Email(message = "Invalid email format") @NotBlank(message = "Email is required") String email,
			@Pattern(regexp = "^[6-9]\\d{9}$", message = "Phone number must be a valid 10-digit Indian mobile number") String phone,
			@Size(min = 6, message = "Password must contain at least 6 characters") String password, Role role) {
		super();
		this.fullName = fullName;
		this.email = email;
		this.phone = phone;
		this.password = password;
		this.role = role;
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

	public Role getRole() {
		return role;
	}

	public void setRole(Role role) {
		this.role = role;
	}

   
	
}