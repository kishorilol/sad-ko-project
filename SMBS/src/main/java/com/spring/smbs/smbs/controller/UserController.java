package com.spring.smbs.smbs.controller;

import com.spring.smbs.smbs.model.User;
import com.spring.smbs.smbs.DTO.Request.RegisterRequest;
import com.spring.smbs.smbs.service.UserService;
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
            return new ResponseEntity<>("Username already taken. Please try another username.",HttpStatus.NOT_ACCEPTABLE);
        }
        else{
            return new ResponseEntity<>(appuser,HttpStatus.OK);
        }
    }
}
