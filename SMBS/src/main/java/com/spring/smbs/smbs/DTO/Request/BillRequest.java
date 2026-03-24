package com.spring.smbs.smbs.DTO.Request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BillRequest {
    private List<BillProductRequest> items;
    private double paidAmount;
    private Integer customerId;
    private Integer cashierId;
}
