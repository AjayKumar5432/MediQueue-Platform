package com.mediqueue.service;

import com.mediqueue.dto.request.UserRequest;
import com.mediqueue.dto.response.UserResponse;

public interface UserService {

    UserResponse registerUser(UserRequest request);

}