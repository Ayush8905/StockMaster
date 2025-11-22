package com.StockMaster.inventory_backend.repositories;

import com.StockMaster.inventory_backend.models.Warehouse;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WarehouseRepository extends MongoRepository<Warehouse, String> {
    
    Optional<Warehouse> findByName(String name);
    
    Boolean existsByName(String name);
    
    List<Warehouse> findByActive(Boolean active);
    
    List<Warehouse> findByLocationContainingIgnoreCase(String location);
}
