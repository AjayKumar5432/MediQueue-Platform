package com.mediqueue.service;

public interface EmailService {

    /**
     * Sends booking receipt to customer email.
     *
     * @param tokenId Token ID
     */
    void sendTokenReceipt(Long tokenId);

    void sendNewRegistrationAlertToSuperAdmin(com.mediqueue.entity.Hospital hospital, com.mediqueue.entity.User admin);

    void sendRegistrationAcknowledgementToAdmin(com.mediqueue.entity.Hospital hospital, com.mediqueue.entity.User admin);

    void sendApprovalStatusEmail(com.mediqueue.entity.Hospital hospital, com.mediqueue.entity.User admin, boolean approved);

}