package com.spring.smbs_backend.DTO.Response;

public interface ProductSales {
    String getProductName();
    Long getSoldQuantity();
    Double getTotalRevenue();
    Double getTotalProfit();
}
