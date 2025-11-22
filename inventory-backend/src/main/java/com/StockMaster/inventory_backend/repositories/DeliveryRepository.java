package com.StockMaster.inventory_backend.repositories;

import com.StockMaster.inventory_backend.models.Delivery;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface DeliveryRepository extends MongoRepository<Delivery, String> {
    
    Optional<Delivery> findByDeliveryNumber(String deliveryNumber);
    
    List<Delivery> findByStatus(String status);
    
    List<Delivery> findByWarehouseId(String warehouseId);
    
    List<Delivery> findByCustomerContainingIgnoreCase(String customer);
    
    List<Delivery> findByDeliveryDateBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    Boolean existsByDeliveryNumber(String deliveryNumber);
}
