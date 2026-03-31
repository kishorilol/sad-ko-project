package com.spring.smbs.smbsbackend.repository;

import com.spring.smbs.smbsbackend.model.Cashier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CashierRepository extends JpaRepository<Cashier, Integer> {
    Integer countByStatus(String status);
    Integer countByShift(String shift);
}

