package com.spring.smbs_backend.DTO.Request;

import com.spring.smbs_backend.model.Cashier;
import com.spring.smbs_backend.model.User;
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