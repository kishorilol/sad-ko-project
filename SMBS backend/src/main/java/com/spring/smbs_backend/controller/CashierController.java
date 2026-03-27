package com.spring.smbs_backend.controller;

import com.spring.smbs_backend.model.Cashier;
import com.spring.smbs_backend.service.CashierService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@Controller
public class CashierController {
    @Autowired
    private CashierService cashierService;

    @GetMapping("/admin/getAllCashiers")
    public ResponseEntity<?> getAllCashiers() {
        List<Cashier> cashiers = new ArrayList<>();
        cashiers = cashierService.getAllCashiers();
        if(cashiers.isEmpty())
            return new ResponseEntity<>("No Cashiers available.", HttpStatus.NO_CONTENT);
        else
            return new ResponseEntity<>(cashiers, HttpStatus.OK);
    }

    @GetMapping("/admin/getAllSize")
    public ResponseEntity<Integer> getAllCashiersSize() {
        return new ResponseEntity<>(cashierService.getCashiersCount(), HttpStatus.OK);
    }

    @GetMapping("/admin/getActiveSize")
    public ResponseEntity<Integer> getActiveCashiersSize(){
        return new ResponseEntity<>(cashierService.getActiveCashiersCount(), HttpStatus.OK);
    }

    @GetMapping("/admin/getInactiveSize")
    public ResponseEntity<Integer> getInactiveCashiersSize(){
        return new ResponseEntity<>(cashierService.getInactiveCashiersCount(), HttpStatus.OK);
    }

    @GetMapping("/admin/getOnShiftCashiers")
    public ResponseEntity<Integer> getOnShiftCashiersSize(){
        return new ResponseEntity<>(cashierService.getOnShiftedCashiersCount(), HttpStatus.OK);
    }

    @GetMapping("/getCashierById/{Id}")
    public ResponseEntity<Cashier> getCashierById(@PathVariable int Id){
        return new ResponseEntity<>(cashierService.getCashierById(Id), HttpStatus.OK);
    }

    @PutMapping("/admin/update/{Id}")
    public ResponseEntity<?> updateCashierById(@PathVariable int Id, @RequestBody Cashier cashier){
        Cashier updatedCashier = cashierService.updateCashier(Id, cashier);
        if (updatedCashier == null) {
            return new ResponseEntity<>("Cashier with id " + Id +" not found!!!",HttpStatus.NOT_FOUND);
        }
        else  {
            return new ResponseEntity<>("Cashier Update Successful.", HttpStatus.OK);
        }
    }

    @DeleteMapping("/admin/delete/{Id}")
    public ResponseEntity<?> deleteCashierById(@PathVariable int Id){
        Cashier cashier = cashierService.getCashierById(Id);
        if(cashier == null){
            return new ResponseEntity<>("Cashier with id" + Id +" not found!!!",HttpStatus.NOT_FOUND);
        }
        else{
            cashierService.deleteCashier(Id);
            return new ResponseEntity<>("Cashier Deletion Successful.",HttpStatus.OK);
        }
    }
}