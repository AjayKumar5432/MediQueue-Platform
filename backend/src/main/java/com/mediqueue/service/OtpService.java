package com.mediqueue.service;

import java.util.Map;

public interface OtpService {

    Map<String, Object> sendRegistrationOtp(String email, String phone);

    Map<String, Object> verifyOtp(String email, String otp);

    Map<String, Object> sendForgotPasswordOtp(String email);

    Map<String, Object> resetPasswordWithOtp(String email, String otp, String newPassword);

}
