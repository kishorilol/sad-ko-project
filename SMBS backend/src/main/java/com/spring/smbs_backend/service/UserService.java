package com.spring.smbs_backend.service;

import com.spring.smbs_backend.DTO.Request.LoginRequest;
import com.spring.smbs_backend.DTO.Response.login.LoginResponse;
import com.spring.smbs_backend.model.Cashier;
import com.spring.smbs_backend.model.User;
import com.spring.smbs_backend.repository.CashierRepository;
import com.spring.smbs_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

    @Autowired
    JwtService jwtService;

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

    public LoginResponse verify(LoginRequest loginRequest){
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();

        if (authentication.isAuthenticated()) {

            String role = userDetails.getAuthorities()
                    .stream()
                    .findFirst()
                    .get()
                    .getAuthority();

            String token = jwtService.generateToken(userDetails.getUsername(), role);
            return new LoginResponse(token, userDetails.getUsername(),  role);
        }

        return null;
    }
}