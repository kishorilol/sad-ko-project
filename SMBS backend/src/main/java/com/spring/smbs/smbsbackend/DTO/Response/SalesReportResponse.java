package com.spring.smbs.smbsbackend.DTO.Response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class SalesReportResponse {
    private SalesSummary salesSummary;
    private List<ProductSales> products;
    private List<YearlyProfit> chart;

}