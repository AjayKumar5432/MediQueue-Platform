package com.mediqueue.service;

import java.util.List;

import com.mediqueue.dto.response.TokenResponse;

public interface QueueService {

    /**
     * Get today's queue of a hospital department
     */
    List<TokenResponse> getTodayQueue(Long hospitalDepartmentId);

    /**
     * Call next waiting token
     */
    TokenResponse callNextToken(Long hospitalDepartmentId);

    /**
     * Get currently serving token
     */
    TokenResponse getCurrentServingToken(Long hospitalDepartmentId);

    /**
     * Complete current token
     */
    TokenResponse completeToken(Long tokenId);


}
