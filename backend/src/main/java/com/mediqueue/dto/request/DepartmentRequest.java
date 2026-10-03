package com.mediqueue.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class DepartmentRequest {

    @NotBlank(message = "Department name is required.")
    @Size(max = 100, message = "Department name cannot exceed 100 characters.")
    private String departmentName;

    @Size(max = 500, message = "Description cannot exceed 500 characters.")
    private String description;

    @NotBlank(message = "Department code is required")
    private String departmentCode;
    
    public DepartmentRequest() {
    }

  
    public DepartmentRequest(
			@NotBlank(message = "Department name is required.") @Size(max = 100, message = "Department name cannot exceed 100 characters.") String departmentName,
			@Size(max = 500, message = "Description cannot exceed 500 characters.") String description,
			@NotBlank(message = "Department code is required") String departmentCode) {
		super();
		this.departmentName = departmentName;
		this.description = description;
		this.departmentCode = departmentCode;
	}


	public String getDepartmentName() {
        return departmentName;
    }

    public void setDepartmentName(String departmentName) {
        this.departmentName = departmentName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }


	public String getDepartmentCode() {
		return departmentCode;
	}


	public void setDepartmentCode(String departmentCode) {
		this.departmentCode = departmentCode;
	}
    
}