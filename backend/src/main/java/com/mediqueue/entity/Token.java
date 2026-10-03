package com.mediqueue.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.mediqueue.enums.BookingSource;
import com.mediqueue.enums.QueueStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "tokens")
public class Token {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long tokenId;

    // Token Number (GEN-001, CAR-015)
    @Column(nullable = false)
    private String tokenNumber;

    // Customer who booked
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private User customer;

    // Hospital + Department Mapping
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hospital_department_id", nullable = false)
    private HospitalDepartment hospitalDepartment;

    // ONLINE / WALK_IN
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BookingSource bookingSource;

    // WAITING / IN_PROGRESS / COMPLETED...
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private QueueStatus status;

    // Staff or Customer who created this booking
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;

    // Booking date (used for daily token reset)
    @Column(nullable = false)
    private LocalDate bookingDate;

    // Time of booking
    @Column(nullable = false)
    private LocalDateTime bookedAt;

    // Estimated consultation time
    private LocalDateTime estimatedTime;

    @Column(nullable = false)
    private Boolean active = true;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

	public Token() {
		super();
		// TODO Auto-generated constructor stub
	}

	public Token(Long tokenId, String tokenNumber, User customer, HospitalDepartment hospitalDepartment,
			BookingSource bookingSource, QueueStatus status, User createdBy, LocalDate bookingDate,
			LocalDateTime bookedAt, LocalDateTime estimatedTime, Boolean active, LocalDateTime createdAt,
			LocalDateTime updatedAt) {
		super();
		this.tokenId = tokenId;
		this.tokenNumber = tokenNumber;
		this.customer = customer;
		this.hospitalDepartment = hospitalDepartment;
		this.bookingSource = bookingSource;
		this.status = status;
		this.createdBy = createdBy;
		this.bookingDate = bookingDate;
		this.bookedAt = bookedAt;
		this.estimatedTime = estimatedTime;
		this.active = active;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
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

	public User getCustomer() {
		return customer;
	}

	public void setCustomer(User customer) {
		this.customer = customer;
	}

	public HospitalDepartment getHospitalDepartment() {
		return hospitalDepartment;
	}

	public void setHospitalDepartment(HospitalDepartment hospitalDepartment) {
		this.hospitalDepartment = hospitalDepartment;
	}

	public BookingSource getBookingSource() {
		return bookingSource;
	}

	public void setBookingSource(BookingSource bookingSource) {
		this.bookingSource = bookingSource;
	}

	public QueueStatus getStatus() {
		return status;
	}

	public void setStatus(QueueStatus status) {
		this.status = status;
	}

	public User getCreatedBy() {
		return createdBy;
	}

	public void setCreatedBy(User createdBy) {
		this.createdBy = createdBy;
	}

	public LocalDate getBookingDate() {
		return bookingDate;
	}

	public void setBookingDate(LocalDate bookingDate) {
		this.bookingDate = bookingDate;
	}

	public LocalDateTime getBookedAt() {
		return bookedAt;
	}

	public void setBookedAt(LocalDateTime bookedAt) {
		this.bookedAt = bookedAt;
	}

	public LocalDateTime getEstimatedTime() {
		return estimatedTime;
	}

	public void setEstimatedTime(LocalDateTime estimatedTime) {
		this.estimatedTime = estimatedTime;
	}

	public Boolean getActive() {
		return active;
	}

	public void setActive(Boolean active) {
		this.active = active;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}

	public LocalDateTime getUpdatedAt() {
		return updatedAt;
	}

	public void setUpdatedAt(LocalDateTime updatedAt) {
		this.updatedAt = updatedAt;
	}

   
}