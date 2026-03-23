package com.spring.smbs.smbs.service;

import com.spring.smbs.smbs.model.User;
import com.spring.smbs.smbs.model.Cashier;
import com.spring.smbs.smbs.repository.UserRepository;
import com.spring.smbs.smbs.repository.CashierRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CashierRepository cashierRepository;

    @Transactional
    public User validateAndRegister(User user, Cashier newCashier) {

        if (userRepository.existsByUserName(user.getUserName())) {
            return null;
        }

        User savedUser = userRepository.save(user);

        if ("cashier".equalsIgnoreCase(savedUser.getRole()) && newCashier != null) {
            newCashier.setUserId(savedUser.getUserId());
            cashierRepository.save(newCashier);
        }

        return savedUser;
    }
}