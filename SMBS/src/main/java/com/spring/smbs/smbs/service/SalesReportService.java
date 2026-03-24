package com.spring.smbs.smbs.service;

import com.spring.smbs.smbs.DTO.Response.ProductSales;
import com.spring.smbs.smbs.DTO.Response.SalesReportResponse;
import com.spring.smbs.smbs.DTO.Response.SalesSummary;
import com.spring.smbs.smbs.DTO.Response.YearlyProfit;
import com.spring.smbs.smbs.repository.SalesReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SalesReportService {

    @Autowired
    private SalesReportRepository salesReportRepository;

    public SalesReportResponse getReport(int year) {
        SalesSummary summary = salesReportRepository.getSummary(year);
        List<ProductSales> products = salesReportRepository.getProductSales(year);
        List<YearlyProfit> chart = salesReportRepository.getYearlyProfit();

        return new SalesReportResponse(summary, products, chart);
    }
}
