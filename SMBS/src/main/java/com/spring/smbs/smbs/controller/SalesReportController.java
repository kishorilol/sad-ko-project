package com.spring.smbs.smbs.controller;

import com.spring.smbs.smbs.DTO.Request.SalesReportRequest;
import com.spring.smbs.smbs.DTO.Response.SalesReportResponse;
import com.spring.smbs.smbs.service.SalesReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;

import java.time.LocalDate;

@Controller
public class SalesReportController {

    @Autowired
    private SalesReportService salesReportService;

    @PostMapping("/sales-report")
    @ResponseBody
    public SalesReportResponse salesReport(@RequestBody SalesReportRequest salesReportRequest) {
        int year = (salesReportRequest.getYear() != null) ? salesReportRequest.getYear() : LocalDate.now().getYear();

        return salesReportService.getReport(year);
    }
}
