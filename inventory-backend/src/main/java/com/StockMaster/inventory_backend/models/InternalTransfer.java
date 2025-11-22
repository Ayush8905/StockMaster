package com.StockMaster.inventory_backend.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "internal_transfers")
public class InternalTransfer {
    
    @Id
    private String id;
    
    private String productId;
    private String productName;
    private String productSku;
    
    private String fromWarehouseId;
    private String fromWarehouseName;
    
    private String toWarehouseId;
    private String toWarehouseName;
    
    private Integer quantity;
    
    private String status; // DRAFT, COMPLETED, CANCELLED
    
    private String notes;
    
    private String createdBy;
    private String completedBy;
    
    private LocalDateTime createdAt;
    private LocalDateTime completedAt;
    
    // Constructors
    public InternalTransfer() {
        this.createdAt = LocalDateTime.now();
        this.status = "DRAFT";
    }
    
    public InternalTransfer(String productId, String productName, String productSku,
                           String fromWarehouseId, String fromWarehouseName,
                           String toWarehouseId, String toWarehouseName,
                           Integer quantity, String createdBy) {
        this.productId = productId;
        this.productName = productName;
        this.productSku = productSku;
        this.fromWarehouseId = fromWarehouseId;
        this.fromWarehouseName = fromWarehouseName;
        this.toWarehouseId = toWarehouseId;
        this.toWarehouseName = toWarehouseName;
        this.quantity = quantity;
        this.createdBy = createdBy;
        this.createdAt = LocalDateTime.now();
        this.status = "DRAFT";
    }
    
    // Getters and Setters
    public String getId() {
        return id;
    }
    
    public void setId(String id) {
        this.id = id;
    }
    
    public String getProductId() {
        return productId;
    }
    
    public void setProductId(String productId) {
        this.productId = productId;
    }
    
    public String getProductName() {
        return productName;
    }
    
    public void setProductName(String productName) {
        this.productName = productName;
    }
    
    public String getProductSku() {
        return productSku;
    }
    
    public void setProductSku(String productSku) {
        this.productSku = productSku;
    }
    
    public String getFromWarehouseId() {
        return fromWarehouseId;
    }
    
    public void setFromWarehouseId(String fromWarehouseId) {
        this.fromWarehouseId = fromWarehouseId;
    }
    
    public String getFromWarehouseName() {
        return fromWarehouseName;
    }
    
    public void setFromWarehouseName(String fromWarehouseName) {
        this.fromWarehouseName = fromWarehouseName;
    }
    
    public String getToWarehouseId() {
        return toWarehouseId;
    }
    
    public void setToWarehouseId(String toWarehouseId) {
        this.toWarehouseId = toWarehouseId;
    }
    
    public String getToWarehouseName() {
        return toWarehouseName;
    }
    
    public void setToWarehouseName(String toWarehouseName) {
        this.toWarehouseName = toWarehouseName;
    }
    
    public Integer getQuantity() {
        return quantity;
    }
    
    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }
    
    public String getNotes() {
        return notes;
    }
    
    public void setNotes(String notes) {
        this.notes = notes;
    }
    
    public String getCreatedBy() {
        return createdBy;
    }
    
    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }
    
    public String getCompletedBy() {
        return completedBy;
    }
    
    public void setCompletedBy(String completedBy) {
        this.completedBy = completedBy;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getCompletedAt() {
        return completedAt;
    }
    
    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }
}
