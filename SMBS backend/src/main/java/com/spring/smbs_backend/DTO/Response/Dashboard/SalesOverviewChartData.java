package com.spring.smbs_backend.DTO.Response.Dashboard;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SalesOverviewChartData {
    int year;
    Float sales;
    Float profit;
}
