package com.spring.smbs.smbsbackend.service;

import com.spring.smbs.smbsbackend.DTO.Request.LoginRequest;
import com.spring.smbs.smbsbackend.model.Cashier;
import com.spring.smbs.smbsbackend.model.User;
import com.spring.smbs.smbsbackend.repository.CashierRepository;
import com.spring.smbs.smbsbackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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