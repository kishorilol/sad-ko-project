package com.spring.smbs_backend.repository;

import com.spring.smbs_backend.model.BillItems;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BillItemRepository extends JpaRepository<BillItems, Integer> {
}
