package com.spring.smbs.smbs.DTO.Request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class AddBatchRequest {
    private String barcode;
    private float costPrice;
    private int stock;
    private LocalDate purchaseDate;
}
