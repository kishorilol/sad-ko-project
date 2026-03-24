package com.spring.smbs.smbs.DTO.Request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BillProductRequest {
    private String barcode;
    private int quantity;
}
