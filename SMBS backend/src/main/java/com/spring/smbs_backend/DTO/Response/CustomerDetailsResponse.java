package com.spring.smbs_backend.DTO.Response;

import com.spring.smbs_backend.model.Cashier;
import com.spring.smbs_backend.model.Customer;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CustomerDetailsResponse {
    List<Customer> customers;
    Integer totalCustomer;
    Integer customersArrivedToday;
    Integer regularCustomer;
}
