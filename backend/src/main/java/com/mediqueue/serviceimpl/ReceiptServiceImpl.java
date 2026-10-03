package com.mediqueue.serviceimpl;

import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;

import org.springframework.stereotype.Service;

import com.lowagie.text.Document;
import com.lowagie.text.DocumentException;
import com.lowagie.text.Font;
import com.lowagie.text.FontFactory;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfWriter;
import com.mediqueue.entity.Token;
import com.mediqueue.exception.ResourceNotFoundException;
import com.mediqueue.repository.TokenRepository;
import com.mediqueue.service.ReceiptService;

@Service
public class ReceiptServiceImpl implements ReceiptService {

    private final TokenRepository tokenRepository;

    public ReceiptServiceImpl(TokenRepository tokenRepository) {
        this.tokenRepository = tokenRepository;
    }
    

    @Override
    public byte[] generateReceipt(Long tokenId) {

        Token token = tokenRepository.findById(tokenId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Token not found."));

        try {

            ByteArrayOutputStream outputStream =
                    new ByteArrayOutputStream();

            Document document =
                    new Document(PageSize.A4);

            PdfWriter.getInstance(document, outputStream);

            document.open();

            Font titleFont =
                    FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18);

            Font headingFont =
                    FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14);

            Font normalFont =
                    FontFactory.getFont(FontFactory.HELVETICA, 12);

            Font footerFont =
                    FontFactory.getFont(FontFactory.HELVETICA_OBLIQUE, 11);

            DateTimeFormatter dateFormatter =
                    DateTimeFormatter.ofPattern("dd-MMM-yyyy");

            DateTimeFormatter timeFormatter =
                    DateTimeFormatter.ofPattern("hh:mm a");

            Paragraph title =
                    new Paragraph("MEDIQUEUE", titleFont);

            title.setAlignment(Paragraph.ALIGN_CENTER);

            document.add(title);

            Paragraph subTitle =
                    new Paragraph(
                            "Smart Hospital Queue Management System",
                            normalFont);

            subTitle.setAlignment(Paragraph.ALIGN_CENTER);

            document.add(subTitle);

            document.add(new Paragraph("------------------------------------------------------------"));

            Paragraph receiptTitle =
                    new Paragraph("TOKEN RECEIPT", headingFont);

            receiptTitle.setAlignment(Paragraph.ALIGN_CENTER);

            document.add(receiptTitle);

            document.add(new Paragraph(" "));

            document.add(new Paragraph(
                    "Token Number : " + token.getTokenNumber(),
                    headingFont));

            document.add(new Paragraph(
                    "Status : " + token.getStatus(),
                    normalFont));

            document.add(new Paragraph(" "));

            document.add(new Paragraph(
                    "Patient Name : "
                            + token.getCustomer().getFullName(),
                    normalFont));

            document.add(new Paragraph(
                    "Phone Number : "
                            + token.getCustomer().getPhone(),
                    normalFont));

            document.add(new Paragraph(" "));

            document.add(new Paragraph(
                    "Hospital : "
                            + token.getHospitalDepartment()
                                   .getHospital()
                                   .getHospitalName(),
                    normalFont));

            document.add(new Paragraph(
                    "Department : "
                            + token.getHospitalDepartment()
                                   .getDepartment()
                                   .getDepartmentName(),
                    normalFont));

            document.add(new Paragraph(
                    "Consultation Fee : ₹"
                            + token.getHospitalDepartment()
                                   .getConsultationFee(),
                    normalFont));

            document.add(new Paragraph(" "));

            document.add(new Paragraph(
                    "Booking Source : "
                            + token.getBookingSource(),
                    normalFont));

            document.add(new Paragraph(
                    "Booking Date : "
                            + token.getBookingDate()
                                   .format(dateFormatter),
                    normalFont));

            document.add(new Paragraph(
                    "Booking Time : "
                            + token.getBookedAt()
                                   .format(timeFormatter),
                    normalFont));

            if (token.getEstimatedTime() != null) {

                document.add(new Paragraph(
                        "Estimated Time : "
                                + token.getEstimatedTime()
                                       .format(timeFormatter),
                        normalFont));
            }

            document.add(new Paragraph(" "));

            document.add(new Paragraph(
                    "Instructions",
                    headingFont));

            document.add(new Paragraph(
                    "• Please arrive at least 10 minutes before your turn.",
                    normalFont));

            document.add(new Paragraph(
                    "• Keep this receipt until your consultation is completed.",
                    normalFont));

            document.add(new Paragraph(
                    "• This token is valid only for the selected booking date.",
                    normalFont));

            document.add(new Paragraph(" "));

            Paragraph footer =
                    new Paragraph(
                            "Thank you for choosing MediQueue!\n"
                                    + "Wishing you good health!",
                            footerFont);

            footer.setAlignment(Paragraph.ALIGN_CENTER);

            document.add(footer);

            document.close();

            return outputStream.toByteArray();

        } catch (DocumentException e) {

            throw new RuntimeException(
                    "Unable to generate receipt.",
                    e);
        }
    }
}