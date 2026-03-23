package com.spring.smbs.smbs.DTO.Request;

import com.spring.smbs.smbs.model.InventoryBatch;
import com.spring.smbs.smbs.model.Product;
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
