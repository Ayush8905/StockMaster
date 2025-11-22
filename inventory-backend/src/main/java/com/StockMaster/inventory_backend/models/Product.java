package com.StockMaster.inventory_backend.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.LocalDateTime;

@Document(collection = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {
    
    @Id
    private String id;
    
    private String name;
    
    @Indexed(unique = true)
    private String sku;
    
    private String category;
    
    private String unit;
    
    private Integer reorderLevel;
    
    private Integer initialStock;
    
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
    
    private String createdBy;
    
    private boolean active;
    
    public Product(String name, String sku, String category, String unit, Integer reorderLevel) {
        this.name = name;
        this.sku = sku;
        this.category = category;
        this.unit = unit;
        this.reorderLevel = reorderLevel;
        this.active = true;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
}
