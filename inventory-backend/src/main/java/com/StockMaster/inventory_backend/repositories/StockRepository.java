package com.StockMaster.inventory_backend.repositories;

import com.StockMaster.inventory_backend.models.Stock;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StockRepository extends MongoRepository<Stock, String> {
    
    Optional<Stock> findByProductIdAndWarehouseId(String productId, String warehouseId);
    
    List<Stock> findByProductId(String productId);
    
    List<Stock> findByWarehouseId(String warehouseId);
    
    List<Stock> findByQuantityLessThan(Integer quantity);
}
