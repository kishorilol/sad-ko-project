package com.spring.smbs_backend.controller;

import com.spring.smbs_backend.DTO.Request.LoginRequest;
import com.spring.smbs_backend.DTO.Request.RegisterRequest;
import com.spring.smbs_backend.model.User;
import com.spring.smbs_backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@Controller
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/registerUser")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest registerRequest) {
        User appuser = userService.validateAndRegister(registerRequest.getUser(),registerRequest.getCashier());
        if(appuser == null){
            return new ResponseEntity<>("Username already taken. Please try another username.", HttpStatus.NOT_ACCEPTABLE);
        }
        else{
            return new ResponseEntity<>(appuser,HttpStatus.OK);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        return userService.verify(loginRequest);
    }
}
