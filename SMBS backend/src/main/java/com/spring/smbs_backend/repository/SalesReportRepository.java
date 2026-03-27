package com.spring.smbs_backend.repository;

import com.spring.smbs_backend.DTO.Response.ProductSales;
import com.spring.smbs_backend.DTO.Response.SalesSummary;
import com.spring.smbs_backend.DTO.Response.YearlyProfit;
import com.spring.smbs_backend.model.Bill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SalesReportRepository extends JpaRepository<Bill, Integer> {

    @Query(value = """
        SELECT 
            (SELECT SUM(b.total_amt) 
             FROM bill b
             WHERE YEAR(b.created_at) = :year) AS totalSales,

            (SELECT SUM((bi.selling_price - bi.cost_price) * bi.quantity)
            FROM bill_items bi
            JOIN bill b ON bi.bill_id = b.bill_id
            WHERE YEAR(b.created_at) = :year) AS totalProfit,

            (SELECT SUM(ib.cost_price * (ib.stock + COALESCE(sold_qty.sold_quantity, 0)))
             FROM inventory_batch ib
             LEFT JOIN (
                 SELECT bi.product_id, SUM(bi.quantity) AS sold_quantity
                 FROM bill_items bi
                 JOIN bill b ON b.bill_id = bi.bill_id
                 WHERE YEAR(b.created_at) = :year
                 GROUP BY bi.product_id
             ) sold_qty ON sold_qty.product_id = ib.product_id
             WHERE YEAR(ib.purchase_date) = :year) AS totalCost,

            (SELECT SUM(bi.quantity)
             FROM bill_items bi
             JOIN bill b ON b.bill_id = bi.bill_id
             WHERE YEAR(b.created_at) = :year) AS totalProductsSold
        """, nativeQuery = true)
    SalesSummary getSummary(@Param("year") int year);


    @Query(value = """
    SELECT 
        p.name AS productName,
        COALESCE(sold.soldQuantity, 0) AS soldQuantity,
        COALESCE(bought.purchasedQuantity, 0) AS boughtQuantity,
        COALESCE(bought.weightedAvgCostPrice, 0) AS avgCostPrice,
        COALESCE(sold.weightedAvgSellingPrice, 0) AS avgSellingPrice,
        COALESCE(sold.totalProfit, 0) AS totalProfit
    FROM product p
    LEFT JOIN (
        SELECT 
            bi.product_id,
            SUM(bi.quantity) AS soldQuantity,
            SUM(bi.quantity * bi.selling_price) / SUM(bi.quantity) AS weightedAvgSellingPrice,
            SUM((bi.selling_price - bi.cost_price) * bi.quantity) AS totalProfit
        FROM bill_items bi
        JOIN bill b ON bi.bill_id = b.bill_id
        WHERE YEAR(b.created_at) = :year
        GROUP BY bi.product_id
    ) sold ON sold.product_id = p.product_id
    LEFT JOIN (
        SELECT 
            ib.product_id,
            SUM(ib.initial_purchase) AS purchasedQuantity,
            SUM(ib.initial_purchase * ib.cost_price) / SUM(ib.initial_purchase) AS weightedAvgCostPrice
        FROM inventory_batch ib
        WHERE YEAR(ib.purchase_date) = :year
        GROUP BY ib.product_id
    ) bought ON bought.product_id = p.product_id
    WHERE sold.soldQuantity > 0 OR bought.purchasedQuantity > 0
    ORDER BY p.name
    """, nativeQuery = true)
    List<ProductSales> getProductSales(@Param("year") int year);


    @Query("""
    SELECT 
        YEAR(b.createdAt) as year,
        SUM((bi.sellingPrice - bi.costPrice) * bi.quantity) as profit
    FROM BillItems bi
    JOIN bi.bill b
    GROUP BY YEAR(b.createdAt)
    ORDER BY YEAR(b.createdAt)
    """)
    List<YearlyProfit> getYearlyProfit();
}