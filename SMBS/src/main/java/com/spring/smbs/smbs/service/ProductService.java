package com.spring.smbs.smbs.service;

import com.spring.smbs.smbs.DTO.Request.ProductAdditionRequest;
import com.spring.smbs.smbs.model.InventoryBatch;
import com.spring.smbs.smbs.model.Product;
import com.spring.smbs.smbs.repository.InventoryBatchRepository;
import com.spring.smbs.smbs.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {
    @Autowired
    private ProductRepository productsRepository;

    @Autowired
    private InventoryBatchRepository inventoryBatchRepository;

    //getting products
    public List<Product> getAllProducts()
    {
        return productsRepository.findAll();
    }

    public Product getProductsByBarcode(String barcode){
        Optional<Product> products = productsRepository.findByBarcode(barcode);
        return products.orElse(null);
    }

    //getting stats for display
    public int getAllProductsCount(){
        return productsRepository.findAll().size();
    }

    public int getLowStockProductsCount(){
        return inventoryBatchRepository.countLowStockProducts(15);
    }

    public int getOnStockProductsCount(){
        return inventoryBatchRepository.countHighStockProducts(0);
    }

    //adding products
    @Transactional
    public Product addProducts(ProductAdditionRequest productAdditionRequest){
        Product product = productsRepository.save(productAdditionRequest.getProduct());

        InventoryBatch inventoryBatch = new InventoryBatch();

        inventoryBatch.setProduct(product);
        inventoryBatch.setCostPrice(productAdditionRequest.getInventoryBatch().getCostPrice());
        inventoryBatch.setStock(productAdditionRequest.getInventoryBatch().getStock());
        inventoryBatch.setPurchaseDate(productAdditionRequest.getInventoryBatch().getPurchaseDate());

        inventoryBatchRepository.save(inventoryBatch);

        return productsRepository.findById(product.getProductId()).get();
    }

    //updating products
    public Product updateProductByBarcode(String barcode,  Product updatedProduct) {
        Product existingProduct = getProductsByBarcode(barcode);
        if(existingProduct == null){
            return null;
        }

        existingProduct.setName(updatedProduct.getName());
        existingProduct.setSellingPrice(updatedProduct.getSellingPrice());
        existingProduct.setBarcode(updatedProduct.getBarcode());

        return productsRepository.save(existingProduct);
    }
}
