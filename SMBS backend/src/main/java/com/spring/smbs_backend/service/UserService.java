package com.spring.smbs_backend.service;

import com.spring.smbs_backend.DTO.Request.LoginRequest;
import com.spring.smbs_backend.model.Cashier;
import com.spring.smbs_backend.model.User;
import com.spring.smbs_backend.repository.CashierRepository;
import com.spring.smbs_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CashierRepository cashierRepository;

    @Transactional
    public User validateAndRegister(User user, Cashier newCashier) {

        if (userRepository.existsByUserName(user.getUserName())) {
            return null;
        }

        user.setPassword(encoder.encode(user.getPassword()));
        User savedUser = userRepository.save(user);

        if ("cashier".equalsIgnoreCase(savedUser.getRole()) && newCashier != null) {
            newCashier.setUserId(savedUser.getUserId());
            cashierRepository.save(newCashier);
        }

        return savedUser;
    }

    public ResponseEntity<?> verify(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        if(authentication.isAuthenticated()) {
            return ResponseEntity.ok().build();
        }

        return ResponseEntity.unprocessableEntity().build();
    }
}