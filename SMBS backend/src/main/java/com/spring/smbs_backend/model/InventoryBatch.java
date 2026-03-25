package com.spring.smbs_backend.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class InventoryBatch {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer batchId;

    private float costPrice;
    private LocalDate purchaseDate;
    private Integer stock;

    @ManyToOne
    @JoinColumn(name ="product_id")
    @JsonBackReference
    private Product product;
}
