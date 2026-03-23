package com.spring.smbs.smbs.service;

import com.spring.smbs.smbs.model.Cashier;
import com.spring.smbs.smbs.repository.CashierRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.util.List;
@Service
public class CashierService {

    @Autowired
    private CashierRepository cashierRepository;

    //getting cashiers
    public List<Cashier> getAllCashiers(){
        return cashierRepository.findAll();
    }

    public Cashier getCashierById(Integer id) {
        return cashierRepository.findById(id).orElse(null);
    }


    //adding cashiers
    public Cashier createCashier(Cashier cashier){
        return cashierRepository.save(cashier);
    }


    //updating cashiers
    public Cashier updateCashier(Integer Id, Cashier updatedCashier){
        Cashier existingCashier = cashierRepository.findById(Id).orElse(null);
        if(existingCashier != null){
            existingCashier.setName(updatedCashier.getName());
            existingCashier.setAddress(updatedCashier.getAddress());
            existingCashier.setPhone(updatedCashier.getPhone());
            existingCashier.setStatus(updatedCashier.getStatus());
            existingCashier.setShift(updatedCashier.getShift());
        }
        else
            return null;
        return cashierRepository.save(existingCashier);
    }

    //getting cashiers
    public void deleteCashier(Integer Id){
        cashierRepository.deleteById(Id);
    }


    //getting cashiers stats
    public int getCashiersCount(){
        return cashierRepository.findAll().size();
    }

    public Integer getActiveCashiersCount(){
        return cashierRepository.countByStatus("ACTIVE");
    }

    public Integer getInactiveCashiersCount(){
        return cashierRepository.countByStatus("INACTIVE");
    }

    public Integer getOnShiftedCashiersCount(){
        LocalTime now = LocalTime.now();
        Integer count;
        if(now.isBefore(LocalTime.of(11,0,0)) && now.isAfter(LocalTime.of(6,0,0))){
            count = cashierRepository.countByShift("Morning")-cashierRepository.countByStatus("INACTIVE");
        }
        else if(now.isBefore(LocalTime.of(17,0,0)) && now.isAfter(LocalTime.of(11,0,0)))
            count = cashierRepository.countByShift("Afternoon")-cashierRepository.countByStatus("INACTIVE");
        else
            count = cashierRepository.countByShift("Evening")-cashierRepository.countByStatus("INACTIVE");

        if(count<0){
            return 0;
        }else{
            return count;
        }
    }
}