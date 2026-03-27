package com.spring.smbs_backend.repository;

import com.spring.smbs_backend.model.Cashier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CashierRepository extends JpaRepository<Cashier, Integer> {
    Integer countByStatusAndShift(String status, String shift);
    Integer countByStatus(String status);
    Integer countByShift(String shift);

}

