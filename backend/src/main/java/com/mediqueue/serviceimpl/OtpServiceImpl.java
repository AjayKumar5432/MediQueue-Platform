package com.mediqueue.serviceimpl;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.mediqueue.entity.User;
import com.mediqueue.exception.BadRequestException;
import com.mediqueue.exception.ResourceNotFoundException;
import com.mediqueue.repository.UserRepository;
import com.mediqueue.service.OtpService;

import jakarta.mail.internet.MimeMessage;

@Service
public class OtpServiceImpl implements OtpService {

    private final JavaMailSender mailSender;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // Cache to hold OTP entries (email -> OtpEntry)
    private final Map<String, OtpEntry> registrationOtpMap = new ConcurrentHashMap<>();
    private final Map<String, OtpEntry> forgotPasswordOtpMap = new ConcurrentHashMap<>();

    private final SecureRandom secureRandom = new SecureRandom();

    public OtpServiceImpl(JavaMailSender mailSender,
                          UserRepository userRepository,
                          PasswordEncoder passwordEncoder) {
        this.mailSender = mailSender;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    private static class OtpEntry {
        final String otp;
        final LocalDateTime expiry;

        OtpEntry(String otp, LocalDateTime expiry) {
            this.otp = otp;
            this.expiry = expiry;
        }

        boolean isExpired() {
            return LocalDateTime.now().isAfter(expiry);
        }
    }

    @Override
    public Map<String, Object> sendRegistrationOtp(String email, String phone) {
        if (email == null || email.trim().isEmpty()) {
            throw new BadRequestException("Email address is required.");
        }
        String cleanEmail = email.trim().toLowerCase();

        // Check if email already registered
        if (userRepository.existsByEmail(cleanEmail)) {
            throw new BadRequestException("An account with this email address already exists. Please log in.");
        }

        // Check if phone already registered (if provided)
        if (phone != null && !phone.trim().isEmpty()) {
            if (userRepository.existsByPhone(phone.trim())) {
                throw new BadRequestException("An account with this phone number already exists.");
            }
        }

        String otp = String.format("%06d", secureRandom.nextInt(1000000));
        registrationOtpMap.put(cleanEmail, new OtpEntry(otp, LocalDateTime.now().plusMinutes(10)));

        boolean emailSent = sendEmail(
            cleanEmail,
            "[MediQueue] Your Registration Verification OTP: " + otp,
            """
            Hello,

            Thank you for signing up with MediQueue!

            Your 6-digit verification code is:

                    %s

            This OTP is valid for 10 minutes. Please enter this code on the registration page to verify your email address.

            If you did not request this code, please safely ignore this email.

            Regards,
            MediQueue Healthcare Platform
            """.formatted(otp)
        );

        Map<String, Object> response = new HashMap<>();
        response.put("status", "SUCCESS");
        response.put("emailSent", emailSent);
        response.put("otp", otp);
        if (emailSent) {
            response.put("message", "Verification OTP sent to " + cleanEmail);
        } else {
            response.put("message", "Verification OTP generated: " + otp);
        }
        return response;
    }

    @Override
    public Map<String, Object> verifyOtp(String email, String otp) {
        if (email == null || otp == null) {
            throw new BadRequestException("Email and OTP code are required.");
        }
        String cleanEmail = email.trim().toLowerCase();
        String cleanOtp = otp.trim();

        OtpEntry entry = registrationOtpMap.get(cleanEmail);

        Map<String, Object> response = new HashMap<>();
        if (entry == null) {
            response.put("verified", false);
            response.put("message", "No OTP requested for this email or it has expired. Please request a new OTP.");
            return response;
        }

        if (entry.isExpired()) {
            registrationOtpMap.remove(cleanEmail);
            response.put("verified", false);
            response.put("message", "OTP has expired. Please click 'Resend OTP'.");
            return response;
        }

        if (!entry.otp.equals(cleanOtp)) {
            response.put("verified", false);
            response.put("message", "Incorrect OTP code. Please enter the valid 6-digit code.");
            return response;
        }

        // Verified successfully
        registrationOtpMap.remove(cleanEmail);
        response.put("verified", true);
        response.put("message", "Email verified successfully.");
        return response;
    }

    @Override
    public Map<String, Object> sendForgotPasswordOtp(String email) {
        if (email == null || email.trim().isEmpty()) {
            throw new BadRequestException("Email address is required.");
        }
        String cleanEmail = email.trim().toLowerCase();

        User user = userRepository.findByEmail(cleanEmail)
                .orElseThrow(() -> new ResourceNotFoundException("No active account found with email: " + cleanEmail));

        String otp = String.format("%06d", secureRandom.nextInt(1000000));
        forgotPasswordOtpMap.put(cleanEmail, new OtpEntry(otp, LocalDateTime.now().plusMinutes(10)));

        boolean emailSent = sendEmail(
            cleanEmail,
            "[MediQueue] Password Reset OTP Code: " + otp,
            """
            Hello %s,

            We received a request to reset your password for your MediQueue account.

            Your password reset OTP code is:

                    %s

            This OTP is valid for 10 minutes. If you did not make this request, your account is secure and you can ignore this email.

            Regards,
            MediQueue Healthcare Platform
            """.formatted(user.getFullName(), otp)
        );

        Map<String, Object> response = new HashMap<>();
        response.put("status", "SUCCESS");
        response.put("emailSent", emailSent);
        response.put("otp", otp);
        if (emailSent) {
            response.put("message", "Password reset OTP sent to " + cleanEmail);
        } else {
            response.put("message", "Password reset OTP generated: " + otp);
        }
        return response;
    }

    @Override
    public Map<String, Object> resetPasswordWithOtp(String email, String otp, String newPassword) {
        if (email == null || otp == null || newPassword == null || newPassword.trim().isEmpty()) {
            throw new BadRequestException("Email, OTP, and new password are required.");
        }
        String cleanEmail = email.trim().toLowerCase();
        String cleanOtp = otp.trim();

        OtpEntry entry = forgotPasswordOtpMap.get(cleanEmail);
        if (entry == null || entry.isExpired() || !entry.otp.equals(cleanOtp)) {
            throw new BadRequestException("Invalid or expired OTP code.");
        }

        User user = userRepository.findByEmail(cleanEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found."));

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);

        forgotPasswordOtpMap.remove(cleanEmail);

        Map<String, Object> response = new HashMap<>();
        response.put("status", "SUCCESS");
        response.put("message", "Password has been reset successfully. Please log in with your new password.");
        return response;
    }

    private boolean sendEmail(String to, String subject, String body) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, false, "UTF-8");
            helper.setFrom("gundala.ajay4321@gmail.com", "MediQueue Platform");
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(body);
            mailSender.send(message);
            System.out.println("✅ OTP email sent successfully to: " + to);
            return true;
        } catch (Exception e) {
            System.err.println("⚠️ Warning: Could not deliver email directly to " + to + " via SMTP: " + e.getMessage());
            return false;
        }
    }
}
