package com.spring.smbs_backend.controller;

import com.spring.smbs_backend.DTO.Request.CustomerRegistrationRequest;
import com.spring.smbs_backend.DTO.Response.CustomerDetailsResponse;
import com.spring.smbs_backend.DTO.Response.CustomerDetailsForBillProcessingResponse;
import com.spring.smbs_backend.model.Customer;
import com.spring.smbs_backend.service.CustomerService;
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

    @PostMapping("cashier/customer/addNewCustomer")
    public ResponseEntity<?> addNewCustomer(@RequestBody CustomerRegistrationRequest customer){
        if(customer == null){
            return new ResponseEntity<>(customer, HttpStatus.BAD_REQUEST);
        }
        CustomerDetailsForBillProcessingResponse response = customerService.addAndReturnCustomerDetails(customer);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("admin/getAllCustomersAndStats")
    public ResponseEntity<?> getAllCustomers(){
        try{
            CustomerDetailsResponse response = customerService.getAllCustomers();
            return new ResponseEntity<>(response, HttpStatus.OK);
        }
        catch(Exception e){
            return new ResponseEntity<>(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}