package com.spring.smbs.smbs.service;

import com.spring.smbs.smbs.DTO.Request.CustomerRegistrationRequest;
import com.spring.smbs.smbs.DTO.Response.CustomerDetailsForBillProcessingResponse;
import com.spring.smbs.smbs.model.Customer;
import com.spring.smbs.smbs.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CustomerService {
    @Autowired
    private CustomerRepository customerRepository;

    public Customer getCustomerByPhone(String phone){
        return customerRepository.findByPhone(phone);
    }

    public CustomerDetailsForBillProcessingResponse addAndReturnCustomerDetails(CustomerRegistrationRequest customer){
        Customer existingCustomer = customerRepository.findByPhone(customer.getPhone());
        if(existingCustomer != null){
            throw new RuntimeException("Customer already exists");
        }

        Customer savedCustomer = new Customer();
        savedCustomer.setName(customer.getName());
        savedCustomer.setAddress(customer.getAddress());
        savedCustomer.setPhone(customer.getPhone());

        customerRepository.save(savedCustomer);

        CustomerDetailsForBillProcessingResponse customerDetails = new CustomerDetailsForBillProcessingResponse();
        customerDetails.setCustomerId(savedCustomer.getCustomerId());
        customerDetails.setCustomerName(savedCustomer.getName());
        customerDetails.setPhoneNumber(savedCustomer.getPhone());

        return customerDetails;
    }
}
