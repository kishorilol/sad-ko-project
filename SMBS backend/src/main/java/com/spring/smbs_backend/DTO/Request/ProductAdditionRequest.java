package com.spring.smbs_backend.DTO.Request;

import com.spring.smbs_backend.model.InventoryBatch;
import com.spring.smbs_backend.model.Product;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ProductAdditionRequest {
    Product product;
    InventoryBatch inventoryBatch;
}
