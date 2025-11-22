package com.StockMaster.inventory_backend.services;

import com.StockMaster.inventory_backend.dto.StockDTO;
import com.StockMaster.inventory_backend.models.Product;
import com.StockMaster.inventory_backend.models.Stock;
import com.StockMaster.inventory_backend.models.Warehouse;
import com.StockMaster.inventory_backend.repositories.ProductRepository;
import com.StockMaster.inventory_backend.repositories.StockRepository;
import com.StockMaster.inventory_backend.repositories.WarehouseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class StockService {

    @Autowired
    private StockRepository stockRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private WarehouseRepository warehouseRepository;

    public List<StockDTO> getAllStock() {
        return stockRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<StockDTO> getStockByWarehouse(String warehouseId) {
        return stockRepository.findByWarehouseId(warehouseId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<StockDTO> getStockByProduct(String productId) {
        return stockRepository.findByProductId(productId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public StockDTO getStockByProductAndWarehouse(String productId, String warehouseId) {
        Stock stock = stockRepository.findByProductIdAndWarehouseId(productId, warehouseId)
                .orElseThrow(() -> new RuntimeException("Stock not found for product " + productId + " in warehouse " + warehouseId));
        return convertToDTO(stock);
    }

    public StockDTO createOrUpdateStock(StockDTO stockDTO) {
        // Validate product exists
        Product product = productRepository.findById(stockDTO.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + stockDTO.getProductId()));

        // Validate warehouse exists
        Warehouse warehouse = warehouseRepository.findById(stockDTO.getWarehouseId())
                .orElseThrow(() -> new RuntimeException("Warehouse not found with id: " + stockDTO.getWarehouseId()));

        // Check if stock already exists
        Optional<Stock> existingStock = stockRepository.findByProductIdAndWarehouseId(
                stockDTO.getProductId(), stockDTO.getWarehouseId());

        Stock stock;
        if (existingStock.isPresent()) {
            // Update existing stock
            stock = existingStock.get();
            stock.setQuantity(stockDTO.getQuantity());
            stock.setLocationRack(stockDTO.getLocationRack());
        } else {
            // Create new stock
            stock = new Stock();
            stock.setProductId(stockDTO.getProductId());
            stock.setWarehouseId(stockDTO.getWarehouseId());
            stock.setQuantity(stockDTO.getQuantity());
            stock.setLocationRack(stockDTO.getLocationRack());
        }
        
        stock.setLastUpdated(LocalDateTime.now());
        Stock savedStock = stockRepository.save(stock);
        return convertToDTO(savedStock);
    }

    public StockDTO adjustStock(String productId, String warehouseId, Integer adjustment) {
        Stock stock = stockRepository.findByProductIdAndWarehouseId(productId, warehouseId)
                .orElseThrow(() -> new RuntimeException("Stock not found"));

        stock.setQuantity(stock.getQuantity() + adjustment);
        if (stock.getQuantity() < 0) {
            throw new RuntimeException("Insufficient stock. Cannot reduce below zero.");
        }

        stock.setLastUpdated(LocalDateTime.now());
        Stock updatedStock = stockRepository.save(stock);
        return convertToDTO(updatedStock);
    }

    public List<StockDTO> getLowStock(Integer threshold) {
        return stockRepository.findByQuantityLessThan(threshold).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Integer getTotalStockForProduct(String productId) {
        return stockRepository.findByProductId(productId).stream()
                .mapToInt(Stock::getQuantity)
                .sum();
    }

    private StockDTO convertToDTO(Stock stock) {
        StockDTO dto = new StockDTO();
        dto.setId(stock.getId());
        dto.setProductId(stock.getProductId());
        dto.setWarehouseId(stock.getWarehouseId());
        dto.setQuantity(stock.getQuantity());
        dto.setLocationRack(stock.getLocationRack());

        // Populate product info
        productRepository.findById(stock.getProductId()).ifPresent(product -> {
            dto.setProductName(product.getName());
            dto.setProductSku(product.getSku());
        });

        // Populate warehouse info
        warehouseRepository.findById(stock.getWarehouseId()).ifPresent(warehouse -> {
            dto.setWarehouseName(warehouse.getName());
        });

        return dto;
    }
}
