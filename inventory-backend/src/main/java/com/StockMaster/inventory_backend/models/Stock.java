package com.StockMaster.inventory_backend.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;

import java.time.LocalDateTime;

@Document(collection = "stock")
@Data
@NoArgsConstructor
@AllArgsConstructor
@CompoundIndexes({
    @CompoundIndex(name = "product_warehouse_idx", def = "{'productId': 1, 'warehouseId': 1}", unique = true)
})
public class Stock {
    
    @Id
    private String id;
    
    private String productId;
    
    private String warehouseId;
    
    private Integer quantity;
    
    private String locationRack;
    
    private LocalDateTime lastUpdated;
    
    public Stock(String productId, String warehouseId, Integer quantity) {
        this.productId = productId;
        this.warehouseId = warehouseId;
        this.quantity = quantity;
        this.lastUpdated = LocalDateTime.now();
    }
}
