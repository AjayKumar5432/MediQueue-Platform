package com.mediqueue.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.mediqueue.dto.request.TokenRequest;
import com.mediqueue.dto.response.TokenResponse;
import com.mediqueue.service.TokenService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/customer/tokens")
public class TokenController {

    private final TokenService tokenService;

    public TokenController(TokenService tokenService) {
        this.tokenService = tokenService;
    }

    /**
     * Book Token
     */
    @PostMapping("/book")
    public ResponseEntity<TokenResponse> bookToken(
            @Valid @RequestBody TokenRequest request) {

        return ResponseEntity.ok(
                tokenService.bookToken(request));
    }

    /**
     * My Tokens
     */
    @GetMapping
    public ResponseEntity<List<TokenResponse>> getMyTokens() {

        return ResponseEntity.ok(
                tokenService.getMyTokens());
    }

    /**
     * Get Token By Id
     */
    @GetMapping("/{tokenId}")
    public ResponseEntity<TokenResponse> getTokenById(
            @PathVariable Long tokenId) {

        return ResponseEntity.ok(
                tokenService.getTokenById(tokenId));
    }

    /**
     * Cancel Token
     */
    @PutMapping("/cancel/{tokenId}")
    public ResponseEntity<TokenResponse> cancelToken(
            @PathVariable Long tokenId) {

        return ResponseEntity.ok(
                tokenService.cancelMyToken(tokenId));
    }

}