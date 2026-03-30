package com.spring.smbs_backend.DTO.Response.Dashboard;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DashboardStats {
    Float totalSales;
    Float totalProfit;
    Integer totalProductsSold;
    Integer totalCustomers;
}
