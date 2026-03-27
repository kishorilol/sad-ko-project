package com.spring.smbs_backend.service;

import com.spring.smbs_backend.DTO.Request.AddBatchRequest;
import com.spring.smbs_backend.model.InventoryBatch;
import com.spring.smbs_backend.model.Product;
import com.spring.smbs_backend.repository.InventoryBatchRepository;
import com.spring.smbs_backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class InventoryService {
    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private InventoryBatchRepository inventoryBatchRepository;

    @Transactional
    public InventoryBatch addNewBatch(AddBatchRequest addBatchRequest) {
        Product product = productRepository.findByBarcode(addBatchRequest.getBarcode()).orElseThrow(()-> new RuntimeException("product not found")) ;

        InventoryBatch inventoryBatch = new InventoryBatch();
        inventoryBatch.setProduct(product);
        inventoryBatch.setPurchaseDate(addBatchRequest.getPurchaseDate());
        inventoryBatch.setCostPrice(addBatchRequest.getCostPrice());
        inventoryBatch.setStock(addBatchRequest.getStock());
        inventoryBatch.setInitialPurchase(addBatchRequest.getStock());

        return inventoryBatchRepository.save(inventoryBatch);
    }
}
