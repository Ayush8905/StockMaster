package com.StockMaster.inventory_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Min;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductDTO {
    
    private String id;
    
    @NotBlank(message = "Product name is required")
    private String name;
    
    @NotBlank(message = "SKU is required")
    private String sku;
    
    @NotBlank(message = "Category is required")
    private String category;
    
    @NotBlank(message = "Unit of measure is required")
    private String unit;
    
    @Min(value = 0, message = "Reorder level must be positive")
    private Integer reorderLevel;
    
    @Min(value = 0, message = "Initial stock must be positive")
    private Integer initialStock;
    
    private Boolean active;
    
    public Boolean getActive() {
        return active != null ? active : true;
    }
}
