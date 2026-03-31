package com.spring.smbs.smbsbackend.controller;

import com.spring.smbs.smbsbackend.DTO.Request.AddBatchRequest;
import com.spring.smbs.smbsbackend.service.InventoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@Controller
public class InventoryController {

    @Autowired
    private InventoryService inventoryService;

    @PostMapping("/product/createNewBatchOfProducts")
    public ResponseEntity<?> addBatch(@RequestBody AddBatchRequest addBatchRequest){
        return new ResponseEntity<>(inventoryService.addNewBatch(addBatchRequest), HttpStatus.OK);
    }
}
