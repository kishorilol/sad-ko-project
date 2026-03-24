package com.spring.smbs.smbs.service;

import com.spring.smbs.smbs.DTO.Request.BillProductRequest;
import com.spring.smbs.smbs.DTO.Request.BillRequest;
import com.spring.smbs.smbs.model.Bill;
import com.spring.smbs.smbs.model.BillItems;
import com.spring.smbs.smbs.model.InventoryBatch;
import com.spring.smbs.smbs.model.Product;
import com.spring.smbs.smbs.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class BillService {
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private InventoryBatchRepository inventoryBatchRepository;
    @Autowired
    private BillItemRepository billItemRepository;
    @Autowired
    private BillRepository billRepository;

    @Transactional
    public Bill mainTransaction(BillRequest billRequest) {
        double totalPayable = 0.0;
        List<BillItems> billItems = new ArrayList<>();

        for (BillProductRequest billProductRequest : billRequest.getItems()) {
            Optional<Product> productOptional = productRepository.findByBarcode(billProductRequest.getBarcode());
            if (productOptional.isEmpty()) {
                throw new RuntimeException("Product not found");
            }

            Product product = productOptional.get();
            int quantity = billProductRequest.getQuantity();

            List<InventoryBatch> batches = inventoryBatchRepository.findByProductIdAndStockGreaterThanOrderByPurchaseDateAsc(product.getId(), 0);

            for (InventoryBatch batch : batches) {
                if (quantity == 0) break;

                int available = batch.getStock();

                int usedQty = Math.min(quantity, available);

                BillItems billItem = new BillItems();
                billItem.setProduct(product);
                billItem.setQuantity(usedQty);
                billItem.setCostPrice(batch.getCostPrice());
                billItem.setSellingPrice(product.getSellingPrice());

                batch.setStock(available - usedQty);
                inventoryBatchRepository.save(batch);

                billItems.add(billItem);

                quantity -= usedQty;

                totalPayable += usedQty * product.getSellingPrice();
            }

            if(quantity > 0){
                throw new RuntimeException("Not enough stock for product: " + product.getName());
            }
        }
        if (billRequest.getPaidAmount() < totalPayable) {
            throw new RuntimeException("Paid amount is less than total payable. Total: " + totalPayable);
        }


        Bill bill = new Bill();
        bill.setCustomerId(billRequest.getCustomerId());
        bill.setCashierId(billRequest.getCashierId());
        bill.setTotalAmt(billRequest.getPaidAmount());
        bill.setCreatedAt(LocalDate.now());

        Bill savedBill = billRepository.save(bill);

        for(BillItems billItem : billItems) {
            billItem.setBill(savedBill);
            billItemRepository.save(billItem);
        }

        return savedBill;
    }
}
