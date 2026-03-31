package com.spring.smbs.smbsbackend.DTO.Request;

import com.spring.smbs.smbsbackend.model.InventoryBatch;
import com.spring.smbs.smbsbackend.model.Product;
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
