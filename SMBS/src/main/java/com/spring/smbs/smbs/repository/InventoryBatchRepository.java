package com.spring.smbs.smbs.repository;

import com.spring.smbs.smbs.model.InventoryBatch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


public interface InventoryBatchRepository extends JpaRepository<InventoryBatch, Integer>{
    @Query(value = """
       SELECT COUNT(*) FROM (
           SELECT p.product_id
           FROM product p
           JOIN inventory_batch b ON p.product_id = b.product_id
           GROUP BY p.product_id
           HAVING SUM(b.stock) <= :threshold
       ) AS low_stock
       """, nativeQuery = true)
    Integer countLowStockProducts(@Param("threshold") int threshold);

    @Query(value = """
       SELECT COUNT(*) FROM (
           SELECT p.product_id
           FROM product p
           JOIN inventory_batch b ON p.product_id = b.product_id
           GROUP BY p.product_id
           HAVING SUM(b.stock) > :threshold
       ) AS on_stock
       """, nativeQuery = true)
    Integer countHighStockProducts(@Param("threshold") int threshold);
}

