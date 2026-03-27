package com.spring.smbs_backend.repository;

import com.spring.smbs_backend.model.Bill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;

@Repository
public interface BillRepository extends JpaRepository<Bill,Integer> {
    Integer countByCreatedAt(LocalDate now);
}
