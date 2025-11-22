package com.StockMaster.inventory_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Min;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReceiptDTO {
    
    private String id;
    
    private String receiptNumber;
    
    @NotBlank(message = "Supplier is required")
    private String supplier;
    
    @NotBlank(message = "Warehouse ID is required")
    private String warehouseId;
    
    private LocalDateTime receiptDate;
    
    private String status;
    
    @NotEmpty(message = "At least one item is required")
    private List<ReceiptItemDTO> items;
    
    private String notes;
    
    private String createdBy;
    
    private LocalDateTime createdAt;
    
    private LocalDateTime validatedAt;
    
    private String validatedBy;
    
    // Extended info
    private String warehouseName;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ReceiptItemDTO {
        
        @NotBlank(message = "Product ID is required")
        private String productId;
        
        @Min(value = 1, message = "Quantity must be at least 1")
        private Integer quantity;
        
        private String productName;
        private String productSku;
    }
}
