package com.spring.smbs_backend.DTO.Response.SalesReport;

public interface SalesSummary {
    Double getTotalSales();
    Double getTotalCost();
    Double getTotalProfit();
    Long getTotalProductsSold();
}
