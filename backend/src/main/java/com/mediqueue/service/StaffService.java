package com.mediqueue.service;

import java.util.List;

import com.mediqueue.dto.request.StaffRequest;
import com.mediqueue.dto.response.StaffResponse;

public interface StaffService {

    StaffResponse createStaff(StaffRequest request);

    List<StaffResponse> getAllStaff();

    StaffResponse getStaffById(Long staffId);

    StaffResponse updateStaff(Long staffId, StaffRequest request);

    void deleteStaff(Long staffId);

}