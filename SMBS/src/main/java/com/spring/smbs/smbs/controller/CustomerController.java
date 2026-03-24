package com.spring.smbs.smbs.controller;

import com.spring.smbs.smbs.DTO.Request.CustomerRegistrationRequest;
import com.spring.smbs.smbs.DTO.Response.CustomerDetailsForBillProcessingResponse;
import com.spring.smbs.smbs.model.Customer;
import com.spring.smbs.smbs.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@Controller
public class CustomerController {

    @Autowired
    CustomerService customerService;

    @GetMapping("/customer/getByPhone/{phone}")
    public ResponseEntity<?> getCustomerByPhone(@PathVariable String phone){
        Customer customer = customerService.getCustomerByPhone(phone);
        if(customer == null){
            return new ResponseEntity<>(customer, HttpStatus.NOT_FOUND);
        }
        else{
            return new ResponseEntity<>(customer, HttpStatus.OK);
        }
    }

    @PostMapping("/customer/addNewCustomer")
    public ResponseEntity<?> addNewCustomer(@RequestBody CustomerRegistrationRequest customer){
        if(customer == null){
            return new ResponseEntity<>(customer, HttpStatus.BAD_REQUEST);
        }
        CustomerDetailsForBillProcessingResponse response = customerService.addAndReturnCustomerDetails(customer);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

}
