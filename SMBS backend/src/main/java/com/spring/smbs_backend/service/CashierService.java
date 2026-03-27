package com.spring.smbs_backend.service;

import com.spring.smbs_backend.model.Cashier;
import com.spring.smbs_backend.repository.CashierRepository;
import com.spring.smbs_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalTime;
import java.util.List;

@Service
public class CashierService {

    @Autowired
    private CashierRepository cashierRepository;
    @Autowired
    private UserRepository userRepository;

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

    //deleting cashiers
    @Transactional
    public void deleteCashier(Integer Id){
        Cashier cashier = cashierRepository.findById(Id).orElseThrow(()-> new RuntimeException("Cashier not found."));

        Integer userId = cashier.getUserId();
        cashierRepository.deleteById(Id);
        userRepository.deleteById(userId);
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
            count = cashierRepository.countByShift("Morning")-cashierRepository.countByStatusAndShift("INACTIVE", "Morning");
        }
        else if(now.isBefore(LocalTime.of(16,0,0)) && now.isAfter(LocalTime.of(11,0,0)))
            count = cashierRepository.countByShift("Day")-cashierRepository.countByStatusAndShift("INACTIVE", "Day");
        else
            count = cashierRepository.countByShift("Night")-cashierRepository.countByStatusAndShift("INACTIVE", "Night");

        if(count<0){
            return 0;
        }else{
            return count;
        }
    }
}