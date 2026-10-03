package com.mediqueue.dto.response;

public class LoginResponse {

    private String token;

    private String type;

    private String fullName;

    private String email;

    private String role;

    private String status;

    private Long hospitalId;

    public LoginResponse() {
    }

    public LoginResponse(String token, String type, String fullName,
                         String email, String role, String status, Long hospitalId) {
        this.token = token;
        this.type = type;
        this.fullName = fullName;
        this.email = email;
        this.role = role;
        this.status = status;
        this.hospitalId = hospitalId;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
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

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Long getHospitalId() {
        return hospitalId;
    }

    public void setHospitalId(Long hospitalId) {
        this.hospitalId = hospitalId;
    }
}