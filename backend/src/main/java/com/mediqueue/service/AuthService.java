package com.mediqueue.service;

import com.mediqueue.dto.request.LoginRequest;
import com.mediqueue.dto.response.LoginResponse;

public interface AuthService {

    LoginResponse login(LoginRequest request);

    com.mediqueue.dto.response.HospitalAdminResponse registerHospitalAdmin(com.mediqueue.dto.request.HospitalAdminRegistrationRequest request);

}