package com.StockMaster.inventory_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WarehouseDTO {
    
    private String id;
    
    @NotBlank(message = "Warehouse name is required")
    private String name;
    
    @NotBlank(message = "Location is required")
    private String location;
    
    private String description;
    
    private Boolean active;
}
