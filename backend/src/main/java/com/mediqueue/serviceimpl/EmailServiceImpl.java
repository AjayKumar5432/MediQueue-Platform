package com.mediqueue.serviceimpl;

import java.io.ByteArrayOutputStream;

import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.mediqueue.entity.Token;
import com.mediqueue.exception.ResourceNotFoundException;
import com.mediqueue.repository.TokenRepository;
import com.mediqueue.service.EmailService;
import com.mediqueue.service.ReceiptService;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    private final ReceiptService receiptService;

    private final TokenRepository tokenRepository;

    public EmailServiceImpl(JavaMailSender mailSender,
                            ReceiptService receiptService,
                            TokenRepository tokenRepository) {

        this.mailSender = mailSender;
        this.receiptService = receiptService;
        this.tokenRepository = tokenRepository;
    }

    @Override
    public void sendTokenReceipt(Long tokenId) {

        Token token = tokenRepository.findById(tokenId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Token not found."));

        if (token.getCustomer() == null || token.getCustomer().getEmail() == null || token.getCustomer().getEmail().isBlank()) {
            System.out.println("No customer email provided for token " + tokenId + ", skipping email.");
            return;
        }

        if (token.getCustomer().getEmail().toLowerCase().endsWith("@mediqueue.com")) {
            System.out.println("Walk-in dummy email detected (" + token.getCustomer().getEmail() + "), skipping email dispatch.");
            return;
        }

        byte[] pdf = null;
        try {
            pdf = receiptService.generateReceipt(tokenId);
        } catch (Exception e) {
            System.err.println("⚠️ Warning: Could not generate PDF receipt for token " + tokenId + ": " + e.getMessage());
        }

        try {

            MimeMessage message =
                    mailSender.createMimeMessage();

            MimeMessageHelper helper =
                    new MimeMessageHelper(message, pdf != null, "UTF-8");

            helper.setFrom("gundala.ajay4321@gmail.com", "MediQueue Platform");

            helper.setTo(
                    token.getCustomer().getEmail());

            helper.setSubject(
                    "MediQueue - Token Booking Confirmation (" + token.getTokenNumber() + ")");

            String body =
                    """
                    Hello %s,

                    Your token has been booked successfully!

                    Token Number   : %s
                    Hospital       : %s
                    Department     : %s
                    Booking Date   : %s
                    Estimated Time : %s

                    %s

                    Thank you for choosing MediQueue.

                    Regards,
                    MediQueue Team
                    """
                    .formatted(
                            token.getCustomer().getFullName(),
                            token.getTokenNumber(),
                            token.getHospitalDepartment()
                                    .getHospital()
                                    .getHospitalName(),
                            token.getHospitalDepartment()
                                    .getDepartment()
                                    .getDepartmentName(),
                            token.getBookingDate(),
                            token.getEstimatedTime(),
                            pdf != null ? "Please find your digital receipt attached." : ""
                    );

            helper.setText(body);

            if (pdf != null) {
                helper.addAttachment(
                        "TokenReceipt_"
                                + token.getTokenNumber()
                                + ".pdf",
                        new ByteArrayResource(pdf)
                );
            }

            mailSender.send(message);
            System.out.println("✅ Token receipt email sent successfully to: " + token.getCustomer().getEmail());

        } catch (Exception e) {
            System.err.println("❌ Failed to send token receipt email to " + token.getCustomer().getEmail() + ": " + e.getMessage());
            e.printStackTrace();
        }

    }

    @Override
    public void sendNewRegistrationAlertToSuperAdmin(com.mediqueue.entity.Hospital hospital, com.mediqueue.entity.User admin) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, false, "UTF-8");
            helper.setFrom("gundala.ajay4321@gmail.com", "MediQueue Platform");

            // Send to default superadmin / system notification mail
            helper.setTo("gundala.ajay4321@gmail.com");
            helper.setSubject("[MediQueue Alert] New Hospital Registration Request: " + hospital.getHospitalName());

            String body = """
                    Hello Super Admin,

                    A new Hospital Admin registration request has been submitted and is pending your review.

                    HOSPITAL DETAILS:
                    - Hospital Name: %s
                    - City / State: %s, %s
                    - Address: %s
                    - Phone: %s
                    - Email: %s

                    ADMIN DETAILS:
                    - Full Name: %s
                    - Email: %s
                    - Phone: %s

                    Please log into the MediQueue Super Admin Console to Approve or Reject this request.

                    Regards,
                    MediQueue System
                    """.formatted(
                        hospital.getHospitalName(),
                        hospital.getCity(), hospital.getState(),
                        hospital.getAddress(),
                        hospital.getPhoneNumber(),
                        hospital.getEmail(),
                        admin.getFullName(),
                        admin.getEmail(),
                        admin.getPhone()
                    );

            helper.setText(body);
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Failed to send Super Admin alert email: " + e.getMessage());
        }
    }

    @Override
    public void sendRegistrationAcknowledgementToAdmin(com.mediqueue.entity.Hospital hospital, com.mediqueue.entity.User admin) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, false, "UTF-8");
            helper.setFrom("gundala.ajay4321@gmail.com", "MediQueue Platform");

            helper.setTo(admin.getEmail());
            helper.setSubject("[MediQueue] Application Received for " + hospital.getHospitalName());

            String body = """
                    Hello %s,

                    Thank you for submitting a Hospital Admin application for %s.

                    Your application has been received and is currently under review by our Super Admin team.

                    APPLICATION STATUS: Application Pending Review
                    "Admin will approve or reject your application soon."

                    You will receive an email update once your application has been reviewed.

                    Regards,
                    MediQueue Administration Team
                    """.formatted(admin.getFullName(), hospital.getHospitalName());

            helper.setText(body);
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Failed to send applicant acknowledgement email: " + e.getMessage());
        }
    }

    @Override
    public void sendApprovalStatusEmail(com.mediqueue.entity.Hospital hospital, com.mediqueue.entity.User admin, boolean approved) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, false, "UTF-8");
            helper.setFrom("gundala.ajay4321@gmail.com", "MediQueue Platform");

            helper.setTo(admin.getEmail());

            if (approved) {
                helper.setSubject("[MediQueue] APPROVED! Hospital Registration for " + hospital.getHospitalName());
                String body = """
                        Dear %s,

                        Great news! Your Hospital Admin registration request for %s has been APPROVED.

                        Your account is now ACTIVE. You can now sign in to the Hospital Admin Portal to onboard staff, set up departments, and manage OPD queues.

                        Sign In Portal: http://localhost:5173/hospital-admin/login

                        Thank you for partnering with MediQueue!

                        Best regards,
                        MediQueue Management Team
                        """.formatted(admin.getFullName(), hospital.getHospitalName());
                helper.setText(body);
            } else {
                helper.setSubject("[MediQueue] Update regarding your Hospital Application for " + hospital.getHospitalName());
                String body = """
                        Dear %s,

                        We regret to inform you that your Hospital Admin registration request for %s was not approved by the Super Admin team at this time.

                        If you believe this is in error or require further details, please contact system support.

                        Regards,
                        MediQueue Administration Team
                        """.formatted(admin.getFullName(), hospital.getHospitalName());
                helper.setText(body);
            }

            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Failed to send approval status email: " + e.getMessage());
        }
    }

}