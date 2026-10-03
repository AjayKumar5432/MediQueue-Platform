package com.mediqueue.dto.response;

import java.time.LocalDateTime;

import com.mediqueue.enums.Role;

public class UserResponse {

    private Long id;

    private String fullName;

    private String email;

    private String phone;

    private Role role;

    private Boolean active;

    private LocalDateTime createdAt;

	public UserResponse() {
		super();
		// TODO Auto-generated constructor stub
	}

	public UserResponse(Long id, String fullName, String email, String phone, Role role, Boolean active,
			LocalDateTime createdAt) {
		super();
		this.id = id;
		this.fullName = fullName;
		this.email = email;
		this.phone = phone;
		this.role = role;
		this.active = active;
		this.createdAt = createdAt;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
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

	public Role getRole() {
		return role;
	}

	public void setRole(Role role) {
		this.role = role;
	}

	public Boolean getActive() {
		return active;
	}

	public void setActive(Boolean active) {
		this.active = active;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}

    
	
    
}