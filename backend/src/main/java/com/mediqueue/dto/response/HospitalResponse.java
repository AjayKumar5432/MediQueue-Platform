package com.mediqueue.dto.response;

public class HospitalResponse {

    private Long hospitalId;

    private String hospitalName;

    private String address;

    private String city;

    private String state;

    private String phoneNumber;

    private String email;

    private boolean active;
    
    

	public HospitalResponse() {
		super();
		// TODO Auto-generated constructor stub
	}


	public HospitalResponse(Long hospitalId, String hospitalName, String address, String city, String state,
			String phoneNumber, String email, boolean active) {
		super();
		this.hospitalId = hospitalId;
		this.hospitalName = hospitalName;
		this.address = address;
		this.city = city;
		this.state = state;
		this.phoneNumber = phoneNumber;
		this.email = email;
		this.active = active;
	}

	
	public Long getHospitalId() {
		return hospitalId;
	}

	public void setHospitalId(Long hospitalId) {
		this.hospitalId = hospitalId;
	}

	public String getHospitalName() {
		return hospitalName;
	}

	public void setHospitalName(String hospitalName) {
		this.hospitalName = hospitalName;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public String getCity() {
		return city;
	}

	public void setCity(String city) {
		this.city = city;
	}

	public String getState() {
		return state;
	}

	public void setState(String state) {
		this.state = state;
	}

	public String getPhoneNumber() {
		return phoneNumber;
	}

	public void setPhoneNumber(String phoneNumber) {
		this.phoneNumber = phoneNumber;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public boolean isActive() {
		return active;
	}

	public void setActive(boolean active) {
		this.active = active;
	}

    
}