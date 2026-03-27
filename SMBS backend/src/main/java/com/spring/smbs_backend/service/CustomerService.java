package com.spring.smbs_backend.service;

import com.spring.smbs_backend.DTO.Request.CustomerRegistrationRequest;
import com.spring.smbs_backend.DTO.Response.CustomerDetailsForBillProcessingResponse;
import com.spring.smbs_backend.DTO.Response.CustomerDetailsResponse;
import com.spring.smbs_backend.model.Customer;
import com.spring.smbs_backend.repository.BillRepository;
import com.spring.smbs_backend.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class CustomerService {
    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private BillRepository billRepository;

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
        savedCustomer.setLastVisited(LocalDate.now());

        customerRepository.save(savedCustomer);

        CustomerDetailsForBillProcessingResponse customerDetails = new CustomerDetailsForBillProcessingResponse();
        customerDetails.setCustomerId(savedCustomer.getCustomerId());
        customerDetails.setCustomerName(savedCustomer.getName());
        customerDetails.setPhoneNumber(savedCustomer.getPhone());

        return customerDetails;
    }

    public CustomerDetailsResponse getAllCustomers() {
        List<Customer> customer = customerRepository.findAll();
        Integer totalCustomer = customerRepository.findAll().size();
        Integer customersArrivedToday = billRepository.countByCreatedAt(LocalDate.now());
        Integer regularCustomer = 0;

        List<LocalDate> dates = new ArrayList<LocalDate>();
        for(Customer c : customer){
            dates.add(c.getLastVisited());
        }

        for (LocalDate date : dates) {
            if (date != null && date.isAfter(LocalDate.now().minusDays(5))) {
                regularCustomer++;
            }
        }

        CustomerDetailsResponse customerDetails = new CustomerDetailsResponse();
        customerDetails.setCustomers(customer);
        customerDetails.setTotalCustomer(totalCustomer);
        customerDetails.setCustomersArrivedToday(customersArrivedToday);
        customerDetails.setRegularCustomer(regularCustomer);
        return customerDetails;
    }
}