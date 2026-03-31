package com.spring.smbs.smbsbackend.repository;

import com.spring.smbs.smbsbackend.model.BillItems;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BillItemRepository extends JpaRepository<BillItems, Integer> {
}
