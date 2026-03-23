package com.spring.smbs.smbs.DTO.Response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomerDetailsForBillProcessingResponse {
    int customerId;
    String customerName;
    String phoneNumber;
}
