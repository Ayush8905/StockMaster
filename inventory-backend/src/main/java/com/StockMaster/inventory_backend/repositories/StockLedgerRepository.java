package com.StockMaster.inventory_backend.repositories;

import com.StockMaster.inventory_backend.models.StockLedger;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface StockLedgerRepository extends MongoRepository<StockLedger, String> {
    
    List<StockLedger> findByProductId(String productId);
    
    List<StockLedger> findByWarehouseId(String warehouseId);
    
    List<StockLedger> findByChangeType(String changeType);
    
    List<StockLedger> findByUserId(String userId);
    
    List<StockLedger> findByReferenceId(String referenceId);
    
    List<StockLedger> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    List<StockLedger> findByProductIdAndWarehouseId(String productId, String warehouseId);
}
