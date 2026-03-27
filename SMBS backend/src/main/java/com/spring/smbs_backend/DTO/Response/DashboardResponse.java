package com.spring.smbs_backend.DTO.Response;

import com.spring.smbs_backend.model.Cashier;

import java.util.List;

public class DashboardResponse {
    private Double TotalSales;
    private Integer TotalCustomer;
    private Integer TotalSoldProducts;
    private Double Profit;

    private List<Cashier> cashiers;
}
