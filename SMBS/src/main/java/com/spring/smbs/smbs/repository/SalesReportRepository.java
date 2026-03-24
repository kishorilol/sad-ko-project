package com.spring.smbs.smbs.repository;

import com.spring.smbs.smbs.DTO.Response.ProductSales;
import com.spring.smbs.smbs.DTO.Response.SalesSummary;
import com.spring.smbs.smbs.DTO.Response.YearlyProfit;
import com.spring.smbs.smbs.model.Bill;
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

            (SELECT SUM((bi.selling_price - ib.cost_price) * bi.quantity)
             FROM bill_items bi
             JOIN inventory_batch ib ON ib.product_id = bi.product_id
             JOIN bill b ON b.bill_id = bi.bill_id
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


    @Query("""
    SELECT 
        p.name as productName,
        SUM(bi.quantity) as soldQuantity,
        SUM(bi.sellingPrice * bi.quantity) as totalRevenue,
        SUM((bi.sellingPrice - bi.costPrice) * bi.quantity) as totalProfit
    FROM BillItems bi
    JOIN bi.product p
    JOIN bi.bill b
    WHERE YEAR(b.createdAt) = :year
    GROUP BY p.name
    """)
    List<ProductSales> getProductSales(int year);


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