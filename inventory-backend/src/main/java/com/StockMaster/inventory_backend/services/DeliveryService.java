package com.StockMaster.inventory_backend.services;

import com.StockMaster.inventory_backend.dto.DeliveryDTO;
import com.StockMaster.inventory_backend.models.Delivery;
import com.StockMaster.inventory_backend.models.Product;
import com.StockMaster.inventory_backend.models.Stock;
import com.StockMaster.inventory_backend.models.Warehouse;
import com.StockMaster.inventory_backend.repositories.DeliveryRepository;
import com.StockMaster.inventory_backend.repositories.ProductRepository;
import com.StockMaster.inventory_backend.repositories.StockRepository;
import com.StockMaster.inventory_backend.repositories.WarehouseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class DeliveryService {

    @Autowired
    private DeliveryRepository deliveryRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private WarehouseRepository warehouseRepository;

    @Autowired
    private StockRepository stockRepository;

    public List<DeliveryDTO> getAllDeliveries() {
        return deliveryRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<DeliveryDTO> getDeliveriesByStatus(String status) {
        return deliveryRepository.findByStatus(status).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<DeliveryDTO> getDeliveriesByWarehouse(String warehouseId) {
        return deliveryRepository.findByWarehouseId(warehouseId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public DeliveryDTO getDeliveryById(String id) {
        Delivery delivery = deliveryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Delivery not found with id: " + id));
        return convertToDTO(delivery);
    }

    public DeliveryDTO createDelivery(DeliveryDTO deliveryDTO, String username) {
        // Validate warehouse exists
        Warehouse warehouse = warehouseRepository.findById(deliveryDTO.getWarehouseId())
                .orElseThrow(() -> new RuntimeException("Warehouse not found with id: " + deliveryDTO.getWarehouseId()));

        // Validate all products exist and check stock availability
        for (DeliveryDTO.DeliveryItemDTO itemDTO : deliveryDTO.getItems()) {
            Product product = productRepository.findById(itemDTO.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found with id: " + itemDTO.getProductId()));
            
            itemDTO.setProductName(product.getName());
            itemDTO.setProductSku(product.getSku());
            
            // Check if sufficient stock exists
            Optional<Stock> stockOpt = stockRepository.findByProductIdAndWarehouseId(
                    itemDTO.getProductId(), deliveryDTO.getWarehouseId());
            
            if (stockOpt.isEmpty()) {
                throw new RuntimeException("No stock available for product: " + product.getName() + 
                        " in warehouse: " + warehouse.getName());
            }
            
            Stock stock = stockOpt.get();
            if (stock.getQuantity() < itemDTO.getQuantity()) {
                throw new RuntimeException("Insufficient stock for product: " + product.getName() + 
                        ". Available: " + stock.getQuantity() + ", Requested: " + itemDTO.getQuantity());
            }
        }

        Delivery delivery = new Delivery();
        delivery.setDeliveryNumber(generateDeliveryNumber());
        delivery.setCustomer(deliveryDTO.getCustomer());
        delivery.setWarehouseId(deliveryDTO.getWarehouseId());
        delivery.setDeliveryDate(deliveryDTO.getDeliveryDate() != null ? deliveryDTO.getDeliveryDate() : LocalDateTime.now());
        delivery.setStatus("DRAFT");
        delivery.setNotes(deliveryDTO.getNotes());
        delivery.setCreatedBy(username);
        delivery.setCreatedAt(LocalDateTime.now());

        // Convert items
        List<Delivery.DeliveryItem> items = deliveryDTO.getItems().stream()
                .map(dto -> new Delivery.DeliveryItem(
                        dto.getProductId(),
                        dto.getQuantity(),
                        dto.getProductName(),
                        dto.getProductSku()
                ))
                .collect(Collectors.toList());
        delivery.setItems(items);

        Delivery savedDelivery = deliveryRepository.save(delivery);
        return convertToDTO(savedDelivery);
    }

    @Transactional
    public DeliveryDTO validateDelivery(String id, String username) {
        Delivery delivery = deliveryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Delivery not found with id: " + id));

        if ("VALIDATED".equals(delivery.getStatus())) {
            throw new RuntimeException("Delivery is already validated");
        }

        // Update stock for each item (decrease quantity)
        for (Delivery.DeliveryItem item : delivery.getItems()) {
            decreaseStock(item.getProductId(), delivery.getWarehouseId(), item.getQuantity());
        }

        // Update delivery status
        delivery.setStatus("VALIDATED");
        delivery.setValidatedAt(LocalDateTime.now());
        delivery.setValidatedBy(username);

        Delivery validatedDelivery = deliveryRepository.save(delivery);
        return convertToDTO(validatedDelivery);
    }

    private void decreaseStock(String productId, String warehouseId, Integer quantity) {
        Stock stock = stockRepository.findByProductIdAndWarehouseId(productId, warehouseId)
                .orElseThrow(() -> new RuntimeException("Stock not found for product in warehouse"));

        if (stock.getQuantity() < quantity) {
            throw new RuntimeException("Insufficient stock. Available: " + stock.getQuantity() + 
                    ", Requested: " + quantity);
        }

        stock.setQuantity(stock.getQuantity() - quantity);
        stock.setLastUpdated(LocalDateTime.now());
        stockRepository.save(stock);
    }

    public void deleteDelivery(String id) {
        Delivery delivery = deliveryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Delivery not found with id: " + id));

        if ("VALIDATED".equals(delivery.getStatus())) {
            throw new RuntimeException("Cannot delete validated delivery");
        }

        deliveryRepository.deleteById(id);
    }

    private String generateDeliveryNumber() {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        String deliveryNumber = "DLV-" + timestamp;
        
        int counter = 1;
        while (deliveryRepository.existsByDeliveryNumber(deliveryNumber)) {
            deliveryNumber = "DLV-" + timestamp + "-" + counter;
            counter++;
        }
        
        return deliveryNumber;
    }

    private DeliveryDTO convertToDTO(Delivery delivery) {
        DeliveryDTO dto = new DeliveryDTO();
        dto.setId(delivery.getId());
        dto.setDeliveryNumber(delivery.getDeliveryNumber());
        dto.setCustomer(delivery.getCustomer());
        dto.setWarehouseId(delivery.getWarehouseId());
        dto.setDeliveryDate(delivery.getDeliveryDate());
        dto.setStatus(delivery.getStatus());
        dto.setNotes(delivery.getNotes());
        dto.setCreatedBy(delivery.getCreatedBy());
        dto.setCreatedAt(delivery.getCreatedAt());
        dto.setValidatedAt(delivery.getValidatedAt());
        dto.setValidatedBy(delivery.getValidatedBy());

        // Convert items
        List<DeliveryDTO.DeliveryItemDTO> itemDTOs = delivery.getItems().stream()
                .map(item -> new DeliveryDTO.DeliveryItemDTO(
                        item.getProductId(),
                        item.getQuantity(),
                        item.getProductName(),
                        item.getProductSku()
                ))
                .collect(Collectors.toList());
        dto.setItems(itemDTOs);

        // Get warehouse name
        warehouseRepository.findById(delivery.getWarehouseId()).ifPresent(warehouse ->
                dto.setWarehouseName(warehouse.getName())
        );

        return dto;
    }
}
