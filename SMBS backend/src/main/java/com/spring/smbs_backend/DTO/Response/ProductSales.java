package com.spring.smbs_backend.DTO.Response;

public interface ProductSales {
    String getProductName();
    Long getSoldQuantity();
    Long getBoughtQuantity();
    Double getAvgCostPrice();
    Double getAvgSellingPrice();
    Double getTotalProfit();
}
