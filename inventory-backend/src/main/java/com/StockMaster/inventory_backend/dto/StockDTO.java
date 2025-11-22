package com.StockMaster.inventory_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Min;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StockDTO {
    
    private String id;
    
    @NotBlank(message = "Product ID is required")
    private String productId;
    
    @NotBlank(message = "Warehouse ID is required")
    private String warehouseId;
    
    @Min(value = 0, message = "Quantity must be non-negative")
    private Integer quantity;
    
    private String locationRack;
    
    // Extended info for display
    private String productName;
    private String productSku;
    private String warehouseName;
}
