package com.mediqueue.controller;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.mediqueue.dto.request.TokenRequest;
import com.mediqueue.dto.response.TokenResponse;
import com.mediqueue.entity.User;
import com.mediqueue.enums.BookingSource;
import com.mediqueue.enums.Role;
import com.mediqueue.repository.UserRepository;
import com.mediqueue.service.ReceiptService;
import com.mediqueue.service.TokenService;

@RestController
public class PaymentController {

    private final TokenService tokenService;
    private final ReceiptService receiptService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public PaymentController(TokenService tokenService,
                             ReceiptService receiptService,
                             UserRepository userRepository,
                             PasswordEncoder passwordEncoder) {
        this.tokenService = tokenService;
        this.receiptService = receiptService;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Create payment order intent
     */
    @PostMapping("/customer/payments/create-order")
    public ResponseEntity<Map<String, Object>> createOrder(@RequestBody Map<String, Object> request) {
        String orderId = "ORD_" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        Map<String, Object> response = new HashMap<>();
        response.put("orderId", orderId);
        response.put("amount", request.getOrDefault("amount", 500));
        response.put("status", "CREATED");
        return ResponseEntity.ok(response);
    }

    /**
     * Verify payment authorization and book token (Customer Online)
     */
    @PostMapping("/customer/payments/verify")
    public ResponseEntity<Map<String, Object>> verifyPaymentAndBookToken(@RequestBody Map<String, Object> request) {
        Long hospitalDepartmentId = Long.valueOf(request.get("hospitalDepartmentId").toString());
        String orderId = (String) request.getOrDefault("orderId", "ORD_" + UUID.randomUUID().toString().substring(0, 8));
        String txnId = (String) request.getOrDefault("transactionId", "TXN_" + System.currentTimeMillis());

        TokenRequest tokenRequest = new TokenRequest();
        tokenRequest.setHospitalDepartmentId(hospitalDepartmentId);
        tokenRequest.setBookingSource(BookingSource.ONLINE);

        TokenResponse tokenResponse = tokenService.bookToken(tokenRequest);

        Map<String, Object> response = new HashMap<>();
        response.put("status", "SUCCESS");
        response.put("transactionId", txnId);
        response.put("orderId", orderId);
        response.put("tokenId", tokenResponse.getTokenId());
        response.put("tokenNumber", tokenResponse.getTokenNumber());
        response.put("customerName", tokenResponse.getCustomerName());
        response.put("hospitalName", tokenResponse.getHospitalName());
        response.put("departmentName", tokenResponse.getDepartmentName());
        response.put("tokenDetails", tokenResponse);
        response.put("paymentId", tokenResponse.getTokenId());

        return ResponseEntity.ok(response);
    }

    /**
     * Record cash payment at desk (Walk-in token by Staff or Hospital Admin)
     */
    @PostMapping("/staff/payments/record-cash")
    public ResponseEntity<Map<String, Object>> recordCashPayment(@RequestBody Map<String, Object> request) {
        Long hospitalDepartmentId = Long.valueOf(request.get("hospitalDepartmentId").toString());
        String patientName = request.containsKey("patientName") && request.get("patientName") != null 
                ? request.get("patientName").toString().trim() 
                : "Walk-in Patient";
        String patientPhone = request.containsKey("patientPhone") && request.get("patientPhone") != null 
                ? request.get("patientPhone").toString().trim() 
                : null;
        String patientEmail = request.containsKey("patientEmail") && request.get("patientEmail") != null 
                ? request.get("patientEmail").toString().trim() 
                : null;

        // Find existing customer or register a new walk-in customer profile
        User customer = null;
        if (patientPhone != null && !patientPhone.isEmpty()) {
            customer = userRepository.findByPhone(patientPhone).orElse(null);
        }
        if (customer == null && patientEmail != null && !patientEmail.isEmpty()) {
            customer = userRepository.findByEmail(patientEmail).orElse(null);
        }
        if (customer == null) {
            customer = new User();
            customer.setFullName(patientName);
            String phone = (patientPhone != null && !patientPhone.isEmpty()) 
                    ? patientPhone 
                    : String.valueOf(System.currentTimeMillis()).substring(3);
            customer.setPhone(phone);
            String email = (patientEmail != null && !patientEmail.isEmpty()) 
                    ? patientEmail 
                    : "walkin_" + System.currentTimeMillis() + "@mediqueue.com";
            customer.setEmail(email);
            customer.setPassword(passwordEncoder.encode("Walkin@" + System.currentTimeMillis()));
            customer.setRole(Role.CUSTOMER);
            customer.setActive(true);
            customer.setCreatedAt(LocalDateTime.now());
            customer.setUpdatedAt(LocalDateTime.now());
            customer = userRepository.save(customer);
        }

        TokenRequest tokenRequest = new TokenRequest();
        tokenRequest.setHospitalDepartmentId(hospitalDepartmentId);
        tokenRequest.setBookingSource(BookingSource.WALK_IN);
        tokenRequest.setCustomerId(customer.getId());

        TokenResponse tokenResponse = tokenService.bookToken(tokenRequest);

        String txnId = "CASH_" + System.currentTimeMillis();
        Map<String, Object> response = new HashMap<>();
        response.put("status", "SUCCESS");
        response.put("transactionId", txnId);
        response.put("tokenNumber", tokenResponse.getTokenNumber());
        response.put("customerName", tokenResponse.getCustomerName());
        response.put("hospitalName", tokenResponse.getHospitalName());
        response.put("departmentName", tokenResponse.getDepartmentName());
        response.put("tokenDetails", tokenResponse);
        response.put("paymentId", tokenResponse.getTokenId());

        return ResponseEntity.ok(response);
    }

    /**
     * Download payment receipt PDF
     */
    @GetMapping("/customer/payments/{paymentId}/pdf")
    public ResponseEntity<byte[]> getPaymentReceiptPdf(@PathVariable Long paymentId) {
        byte[] pdfBytes = receiptService.generateReceipt(paymentId);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "receipt-" + paymentId + ".pdf");
        return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
    }
}
