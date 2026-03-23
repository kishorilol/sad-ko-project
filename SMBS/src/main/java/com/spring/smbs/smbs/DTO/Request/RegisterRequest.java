package com.spring.smbs.smbs.DTO.Request;

import com.spring.smbs.smbs.model.User;
import com.spring.smbs.smbs.model.Cashier;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class RegisterRequest {
    private User user;
    private Cashier cashier;
}