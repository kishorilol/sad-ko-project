package com.spring.smbs_backend.controller;

import com.spring.smbs_backend.DTO.Request.BillRequest;
import com.spring.smbs_backend.model.Bill;
import com.spring.smbs_backend.service.BillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@Controller
public class BillController {

    @Autowired
    private BillService billService;

    @PostMapping("/bill/payment")
    public ResponseEntity<?> payment(@RequestBody BillRequest billRequest) {
        try{
            Bill savedBill = billService.mainTransaction(billRequest);
            return ResponseEntity.ok().body(savedBill);
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
