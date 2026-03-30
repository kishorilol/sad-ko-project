package com.spring.smbs_backend.DTO.Response.Dashboard;

import java.util.List;

public class DashboardResponse {
    DashboardStats dashboardStats;
    List<CustomerGrowthData> customerGrowthData;
    List<SalesOverviewChartData> salesOverviewChartData;
    List<TopSellingProductsData> topSellingProductsData;
    List<ActiveCashiers> activeCashiers;
}
