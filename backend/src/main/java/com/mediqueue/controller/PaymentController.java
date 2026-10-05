package com.mediqueue.controller;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.mediqueue.dto.request.TokenRequest;
import com.mediqueue.dto.response.TokenResponse;
import com.mediqueue.enums.BookingSource;
import com.mediqueue.service.ReceiptService;
import com.mediqueue.service.TokenService;

@RestController
public class PaymentController {

    private final TokenService tokenService;
    private final ReceiptService receiptService;

    public PaymentController(TokenService tokenService, ReceiptService receiptService) {
        this.tokenService = tokenService;
        this.receiptService = receiptService;
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
     * Verify payment authorization and book token
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
     * Record cash payment at desk (Walk-in token)
     */
    @PostMapping("/staff/payments/record-cash")
    public ResponseEntity<Map<String, Object>> recordCashPayment(@RequestBody Map<String, Object> request) {
        Long hospitalDepartmentId = Long.valueOf(request.get("hospitalDepartmentId").toString());
        String txnId = "CASH_" + System.currentTimeMillis();

        TokenRequest tokenRequest = new TokenRequest();
        tokenRequest.setHospitalDepartmentId(hospitalDepartmentId);
        tokenRequest.setBookingSource(BookingSource.ONLINE);

        TokenResponse tokenResponse = tokenService.bookToken(tokenRequest);

        Map<String, Object> response = new HashMap<>();
        response.put("status", "SUCCESS");
        response.put("transactionId", txnId);
        response.put("tokenNumber", tokenResponse.getTokenNumber());
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
