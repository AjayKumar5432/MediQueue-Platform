package com.mediqueue.service;

public interface ReceiptService {

    /**
     * Generate PDF receipt for a token.
     *
     * @param tokenId Token ID
     * @return PDF as byte array
     */
    byte[] generateReceipt(Long tokenId);

}