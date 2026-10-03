package com.mediqueue.service;

import java.util.List;

import com.mediqueue.dto.request.TokenRequest;
import com.mediqueue.dto.response.TokenResponse;

public interface TokenService {

    /**
     * Book a new token
     */
    TokenResponse bookToken(TokenRequest request);

    /**
     * Get token by id
     */
    TokenResponse getTokenById(Long tokenId);

    /**
     * Get all tokens of logged-in customer
     */
    List<TokenResponse> getMyTokens();

    /**
     * Cancel booked token
     */
    TokenResponse cancelMyToken(Long tokenId);
    
    

}