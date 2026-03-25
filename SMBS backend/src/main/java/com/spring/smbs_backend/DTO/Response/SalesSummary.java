package com.spring.smbs_backend.DTO.Response;

public interface SalesSummary {
    Double getTotalSales();
    Double getTotalCost();
    Double getTotalProfit();
    Long getTotalProductsSold();
}
