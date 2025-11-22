package com.StockMaster.inventory_backend.repositories;

import com.StockMaster.inventory_backend.models.InternalTransfer;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InternalTransferRepository extends MongoRepository<InternalTransfer, String> {
    
    List<InternalTransfer> findByStatus(String status);
    
    List<InternalTransfer> findByFromWarehouseId(String fromWarehouseId);
    
    List<InternalTransfer> findByToWarehouseId(String toWarehouseId);
    
    List<InternalTransfer> findByProductId(String productId);
    
    List<InternalTransfer> findByCreatedBy(String createdBy);
}
