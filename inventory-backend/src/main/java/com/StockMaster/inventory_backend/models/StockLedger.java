package com.StockMaster.inventory_backend.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "stock_ledger")
public class StockLedger {
    
    @Id
    private String id;
    
    private String productId;
    private String productName;
    private String productSku;
    
    private String warehouseId;
    private String warehouseName;
    
    private String changeType; // RECEIPT, DELIVERY, ADJUSTMENT, TRANSFER_IN, TRANSFER_OUT
    
    private Integer quantityBefore;
    private Integer quantityChange;
    private Integer quantityAfter;
    
    private String referenceId; // ID of receipt, delivery, transfer, or adjustment
    private String referenceType; // RECEIPT, DELIVERY, TRANSFER, ADJUSTMENT
    
    private String userId;
    private String userName;
    
    private String notes;
    
    private LocalDateTime createdAt;
    
    // Constructors
    public StockLedger() {
        this.createdAt = LocalDateTime.now();
    }
    
    public StockLedger(String productId, String productName, String productSku,
                       String warehouseId, String warehouseName,
                       String changeType, Integer quantityBefore,
                       Integer quantityChange, Integer quantityAfter,
                       String referenceId, String referenceType,
                       String userId, String userName) {
        this.productId = productId;
        this.productName = productName;
        this.productSku = productSku;
        this.warehouseId = warehouseId;
        this.warehouseName = warehouseName;
        this.changeType = changeType;
        this.quantityBefore = quantityBefore;
        this.quantityChange = quantityChange;
        this.quantityAfter = quantityAfter;
        this.referenceId = referenceId;
        this.referenceType = referenceType;
        this.userId = userId;
        this.userName = userName;
        this.createdAt = LocalDateTime.now();
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
    
    public String getWarehouseId() {
        return warehouseId;
    }
    
    public void setWarehouseId(String warehouseId) {
        this.warehouseId = warehouseId;
    }
    
    public String getWarehouseName() {
        return warehouseName;
    }
    
    public void setWarehouseName(String warehouseName) {
        this.warehouseName = warehouseName;
    }
    
    public String getChangeType() {
        return changeType;
    }
    
    public void setChangeType(String changeType) {
        this.changeType = changeType;
    }
    
    public Integer getQuantityBefore() {
        return quantityBefore;
    }
    
    public void setQuantityBefore(Integer quantityBefore) {
        this.quantityBefore = quantityBefore;
    }
    
    public Integer getQuantityChange() {
        return quantityChange;
    }
    
    public void setQuantityChange(Integer quantityChange) {
        this.quantityChange = quantityChange;
    }
    
    public Integer getQuantityAfter() {
        return quantityAfter;
    }
    
    public void setQuantityAfter(Integer quantityAfter) {
        this.quantityAfter = quantityAfter;
    }
    
    public String getReferenceId() {
        return referenceId;
    }
    
    public void setReferenceId(String referenceId) {
        this.referenceId = referenceId;
    }
    
    public String getReferenceType() {
        return referenceType;
    }
    
    public void setReferenceType(String referenceType) {
        this.referenceType = referenceType;
    }
    
    public String getUserId() {
        return userId;
    }
    
    public void setUserId(String userId) {
        this.userId = userId;
    }
    
    public String getUserName() {
        return userName;
    }
    
    public void setUserName(String userName) {
        this.userName = userName;
    }
    
    public String getNotes() {
        return notes;
    }
    
    public void setNotes(String notes) {
        this.notes = notes;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
