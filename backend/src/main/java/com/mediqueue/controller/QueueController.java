package com.mediqueue.controller;

import java.util.List;


import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.mediqueue.dto.response.TokenResponse;
import com.mediqueue.service.QueueService;

@RestController
@RequestMapping("/staff/queue")
public class QueueController {

    private final QueueService queueService;

    public QueueController(QueueService queueService) {
        this.queueService = queueService;
    }

    /**
     * Get today's queue
     */
    @GetMapping("/{hospitalDepartmentId}")
    public ResponseEntity<List<TokenResponse>> getTodayQueue(
            @PathVariable Long hospitalDepartmentId) {

        return ResponseEntity.ok(
                queueService.getTodayQueue(hospitalDepartmentId));
    }

    /**
     * Call next token
     */
    @PutMapping("/call-next/{hospitalDepartmentId}")
    public ResponseEntity<TokenResponse> callNextToken(
            @PathVariable Long hospitalDepartmentId) {

        return ResponseEntity.ok(
                queueService.callNextToken(hospitalDepartmentId));
    }

    /**
     * Get current serving token
     */
    @GetMapping("/current/{hospitalDepartmentId}")
    public ResponseEntity<TokenResponse> getCurrentServingToken(
            @PathVariable Long hospitalDepartmentId) {

        return ResponseEntity.ok(
                queueService.getCurrentServingToken(hospitalDepartmentId));
    }

    /**
     * Complete current token
     */
    @PutMapping("/complete/{tokenId}")
    public ResponseEntity<TokenResponse> completeToken(
            @PathVariable Long tokenId) {

        return ResponseEntity.ok(
                queueService.completeToken(tokenId));
    }

   

}