	package com.mediqueue.controller;
	
	import org.springframework.beans.factory.annotation.Autowired;
	import org.springframework.validation.annotation.Validated;
	import org.springframework.web.bind.annotation.PostMapping;
	import org.springframework.web.bind.annotation.RequestBody;
	import org.springframework.web.bind.annotation.RequestMapping;
	import org.springframework.web.bind.annotation.RestController;
	
	import com.mediqueue.dto.request.UserRequest;
	import com.mediqueue.dto.response.UserResponse;
	import com.mediqueue.service.UserService;
	
	import jakarta.validation.Valid;
	
	@RestController
	@RequestMapping("/users")
	@Validated
	public class UserController {
	
		@Autowired
	    private  UserService userService;
	
	   
	
	    @PostMapping("/register")
	    public UserResponse registerUser(@Valid @RequestBody UserRequest request) {
	    	
	    	
	
	        return userService.registerUser(request);
	
	    }
	
	}