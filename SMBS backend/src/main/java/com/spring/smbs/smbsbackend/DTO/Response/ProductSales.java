package com.spring.smbs.smbsbackend.DTO.Response;

public interface ProductSales {
    String getProductName();
    Long getSoldQuantity();
    Double getTotalRevenue();
    Double getTotalProfit();
}
