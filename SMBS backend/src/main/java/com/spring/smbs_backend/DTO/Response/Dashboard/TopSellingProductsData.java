package com.spring.smbs_backend.DTO.Response.Dashboard;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TopSellingProductsData {
    String productName;
    Integer soldQuantity;
}
