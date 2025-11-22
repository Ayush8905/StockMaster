package com.StockMaster.inventory_backend.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "deliveries")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Delivery {
    
    @Id
    private String id;
    
    private String deliveryNumber;
    
    private String customer;
    
    private String warehouseId;
    
    private LocalDateTime deliveryDate;
    
    private String status; // DRAFT, VALIDATED
    
    private List<DeliveryItem> items;
    
    private String notes;
    
    private String createdBy;
    
    private LocalDateTime createdAt;
    
    private LocalDateTime validatedAt;
    
    private String validatedBy;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DeliveryItem {
        private String productId;
        private Integer quantity;
        private String productName;
        private String productSku;
    }
}
