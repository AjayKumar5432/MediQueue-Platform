package com.mediqueue.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.*;

@Entity
@Table(name = "hospital_departments")
public class HospitalDepartment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long hospitalDepartmentId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hospital_id", nullable = false)
    private Hospital hospital;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id", nullable = false)
    private Department department;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal consultationFee;

    @Column(nullable = false)
    private Integer dailyTokenLimit;

    @Column(nullable = false)
    private Integer averageConsultationTime;

    @Column(nullable = false)
    private Boolean availableToday = true;

    @Column(nullable = false)
    private Boolean active = true;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

	public HospitalDepartment() {
		super();
		// TODO Auto-generated constructor stub
	}

	public HospitalDepartment(Long hospitalDepartmentId, Hospital hospital, Department department,
			BigDecimal consultationFee, Integer dailyTokenLimit, Integer averageConsultationTime,
			Boolean availableToday, Boolean active, LocalDateTime createdAt, LocalDateTime updatedAt) {
		super();
		this.hospitalDepartmentId = hospitalDepartmentId;
		this.hospital = hospital;
		this.department = department;
		this.consultationFee = consultationFee;
		this.dailyTokenLimit = dailyTokenLimit;
		this.averageConsultationTime = averageConsultationTime;
		this.availableToday = availableToday;
		this.active = active;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
	}

	public Long getHospitalDepartmentId() {
		return hospitalDepartmentId;
	}

	public void setHospitalDepartmentId(Long hospitalDepartmentId) {
		this.hospitalDepartmentId = hospitalDepartmentId;
	}

	public Hospital getHospital() {
		return hospital;
	}

	public void setHospital(Hospital hospital) {
		this.hospital = hospital;
	}

	public Department getDepartment() {
		return department;
	}

	public void setDepartment(Department department) {
		this.department = department;
	}

	public BigDecimal getConsultationFee() {
		return consultationFee;
	}

	public void setConsultationFee(BigDecimal consultationFee) {
		this.consultationFee = consultationFee;
	}

	public Integer getDailyTokenLimit() {
		return dailyTokenLimit;
	}

	public void setDailyTokenLimit(Integer dailyTokenLimit) {
		this.dailyTokenLimit = dailyTokenLimit;
	}

	public Integer getAverageConsultationTime() {
		return averageConsultationTime;
	}

	public void setAverageConsultationTime(Integer averageConsultationTime) {
		this.averageConsultationTime = averageConsultationTime;
	}

	public Boolean getAvailableToday() {
		return availableToday;
	}

	public void setAvailableToday(Boolean availableToday) {
		this.availableToday = availableToday;
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