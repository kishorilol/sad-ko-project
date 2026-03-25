package com.spring.smbs_backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Cashier {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="cashier_id", nullable = true)
    private Integer cashierId;
    private Integer userId;
    private String name;
    private String address;
    private String phone;
    private String status;
    private String shift;
}