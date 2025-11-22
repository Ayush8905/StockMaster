package com.StockMaster.inventory_backend.repositories;

import com.StockMaster.inventory_backend.models.Receipt;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ReceiptRepository extends MongoRepository<Receipt, String> {
    
    Optional<Receipt> findByReceiptNumber(String receiptNumber);
    
    List<Receipt> findByStatus(String status);
    
    List<Receipt> findByWarehouseId(String warehouseId);
    
    List<Receipt> findBySupplierContainingIgnoreCase(String supplier);
    
    List<Receipt> findByReceiptDateBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    Boolean existsByReceiptNumber(String receiptNumber);
}
