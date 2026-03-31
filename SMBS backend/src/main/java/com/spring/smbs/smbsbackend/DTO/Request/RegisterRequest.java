package com.spring.smbs.smbsbackend.DTO.Request;

import com.spring.smbs.smbsbackend.model.Cashier;
import com.spring.smbs.smbsbackend.model.User;
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