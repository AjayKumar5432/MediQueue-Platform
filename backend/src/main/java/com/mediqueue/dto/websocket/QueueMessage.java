package com.mediqueue.dto.websocket;

import java.time.LocalDateTime;

import com.mediqueue.enums.QueueStatus;

public class QueueMessage {

    private Long tokenId;

    private String tokenNumber;

    private String customerName;

    private String departmentName;

    private QueueStatus status;

    private LocalDateTime estimatedTime;

    public QueueMessage() {
    }

    public QueueMessage(Long tokenId,
                        String tokenNumber,
                        String customerName,
                        String departmentName,
                        QueueStatus status,
                        LocalDateTime estimatedTime) {
        this.tokenId = tokenId;
        this.tokenNumber = tokenNumber;
        this.customerName = customerName;
        this.departmentName = departmentName;
        this.status = status;
        this.estimatedTime = estimatedTime;
    }

    public Long getTokenId() {
        return tokenId;
    }

    public void setTokenId(Long tokenId) {
        this.tokenId = tokenId;
    }

    public String getTokenNumber() {
        return tokenNumber;
    }

    public void setTokenNumber(String tokenNumber) {
        this.tokenNumber = tokenNumber;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getDepartmentName() {
        return departmentName;
    }

    public void setDepartmentName(String departmentName) {
        this.departmentName = departmentName;
    }

    public QueueStatus getStatus() {
        return status;
    }

    public void setStatus(QueueStatus status) {
        this.status = status;
    }

    public LocalDateTime getEstimatedTime() {
        return estimatedTime;
    }

    public void setEstimatedTime(LocalDateTime estimatedTime) {
        this.estimatedTime = estimatedTime;
    }
}