package com.spring.smbs.smbsbackend.repository;

import com.spring.smbs.smbsbackend.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product,Integer> {
    Optional<Product> findByBarcode(String barcode);
}
