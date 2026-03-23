package com.spring.smbs.smbs.repository;

import com.spring.smbs.smbs.DTO.Response.CustomerDetailsForBillProcessingResponse;
import com.spring.smbs.smbs.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Integer> {
    Customer findByPhone(String phone);
}
