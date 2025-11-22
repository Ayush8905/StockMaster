package com.StockMaster.inventory_backend.services;

import com.StockMaster.inventory_backend.models.InternalTransfer;
import com.StockMaster.inventory_backend.models.Product;
import com.StockMaster.inventory_backend.models.Stock;
import com.StockMaster.inventory_backend.models.Warehouse;
import com.StockMaster.inventory_backend.repositories.InternalTransferRepository;
import com.StockMaster.inventory_backend.repositories.ProductRepository;
import com.StockMaster.inventory_backend.repositories.StockRepository;
import com.StockMaster.inventory_backend.repositories.WarehouseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class InternalTransferService {
    
    @Autowired
    private InternalTransferRepository transferRepository;
    
    @Autowired
    private StockRepository stockRepository;
    
    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private WarehouseRepository warehouseRepository;
    
    @Autowired
    private StockLedgerService stockLedgerService;
    
    public List<InternalTransfer> getAllTransfers() {
        return transferRepository.findAll();
    }
    
    public Optional<InternalTransfer> getTransferById(String id) {
        return transferRepository.findById(id);
    }
    
    public List<InternalTransfer> getTransfersByStatus(String status) {
        return transferRepository.findByStatus(status);
    }
    
    public List<InternalTransfer> getTransfersByFromWarehouse(String warehouseId) {
        return transferRepository.findByFromWarehouseId(warehouseId);
    }
    
    public List<InternalTransfer> getTransfersByToWarehouse(String warehouseId) {
        return transferRepository.findByToWarehouseId(warehouseId);
    }
    
    public List<InternalTransfer> getTransfersByProduct(String productId) {
        return transferRepository.findByProductId(productId);
    }
    
    public InternalTransfer createTransfer(InternalTransfer transfer) {
        // Validate product exists
        Optional<Product> product = productRepository.findById(transfer.getProductId());
        if (product.isEmpty()) {
            throw new RuntimeException("Product not found");
        }
        
        // Validate warehouses exist
        Optional<Warehouse> fromWarehouse = warehouseRepository.findById(transfer.getFromWarehouseId());
        Optional<Warehouse> toWarehouse = warehouseRepository.findById(transfer.getToWarehouseId());
        
        if (fromWarehouse.isEmpty() || toWarehouse.isEmpty()) {
            throw new RuntimeException("Warehouse not found");
        }
        
        // Check if source and destination are different
        if (transfer.getFromWarehouseId().equals(transfer.getToWarehouseId())) {
            throw new RuntimeException("Source and destination warehouses must be different");
        }
        
        // Set product and warehouse details
        transfer.setProductName(product.get().getName());
        transfer.setProductSku(product.get().getSku());
        transfer.setFromWarehouseName(fromWarehouse.get().getName());
        transfer.setToWarehouseName(toWarehouse.get().getName());
        transfer.setStatus("DRAFT");
        transfer.setCreatedAt(LocalDateTime.now());
        
        return transferRepository.save(transfer);
    }
    
    @Transactional
    public InternalTransfer completeTransfer(String transferId, String completedBy) {
        Optional<InternalTransfer> transferOpt = transferRepository.findById(transferId);
        
        if (transferOpt.isEmpty()) {
            throw new RuntimeException("Transfer not found");
        }
        
        InternalTransfer transfer = transferOpt.get();
        
        if (!"DRAFT".equals(transfer.getStatus())) {
            throw new RuntimeException("Only DRAFT transfers can be completed");
        }
        
        // Check stock availability in source warehouse
        Optional<Stock> fromStockOpt = stockRepository
                .findByProductIdAndWarehouseId(transfer.getProductId(), transfer.getFromWarehouseId());
        
        if (fromStockOpt.isEmpty()) {
            throw new RuntimeException("No stock found in source warehouse");
        }
        
        Stock fromStock = fromStockOpt.get();
        
        if (fromStock.getQuantity() < transfer.getQuantity()) {
            throw new RuntimeException("Insufficient stock in source warehouse. Available: " 
                    + fromStock.getQuantity() + ", Required: " + transfer.getQuantity());
        }
        
        // Decrease stock from source warehouse
        fromStock.setQuantity(fromStock.getQuantity() - transfer.getQuantity());
        fromStock.setLastUpdated(LocalDateTime.now());
        stockRepository.save(fromStock);

        // Log source warehouse stock decrease
        stockLedgerService.logStockChange(
                transfer.getProductId(), transfer.getProductName(), transfer.getProductSku(),
                transfer.getFromWarehouseId(), transfer.getFromWarehouseName(),
                "TRANSFER_OUT", fromStock.getQuantity() + transfer.getQuantity(),
                -transfer.getQuantity(), fromStock.getQuantity(),
                transfer.getId(), "TRANSFER",
                completedBy, completedBy, "Stock transferred out to " + transfer.getToWarehouseName()
        );
        
        // Increase stock in destination warehouse
        Optional<Stock> toStockOpt = stockRepository
                .findByProductIdAndWarehouseId(transfer.getProductId(), transfer.getToWarehouseId());
        
        Stock toStock;
        Integer toQuantityBefore;
        if (toStockOpt.isPresent()) {
            toStock = toStockOpt.get();
            toQuantityBefore = toStock.getQuantity();
            toStock.setQuantity(toQuantityBefore + transfer.getQuantity());
            toStock.setLastUpdated(LocalDateTime.now());
        } else {
            // Create new stock entry if it doesn't exist
            toStock = new Stock(transfer.getProductId(), transfer.getToWarehouseId(),
                    transfer.getQuantity());
            toQuantityBefore = 0;
        }
        stockRepository.save(toStock);

        // Log destination warehouse stock increase
        stockLedgerService.logStockChange(
                transfer.getProductId(), transfer.getProductName(), transfer.getProductSku(),
                transfer.getToWarehouseId(), transfer.getToWarehouseName(),
                "TRANSFER_IN", toQuantityBefore,
                transfer.getQuantity(), toStock.getQuantity(),
                transfer.getId(), "TRANSFER",
                completedBy, completedBy, "Stock transferred in from " + transfer.getFromWarehouseName()
        );
        
        // Update transfer status
        transfer.setStatus("COMPLETED");
        transfer.setCompletedBy(completedBy);
        transfer.setCompletedAt(LocalDateTime.now());
        
        return transferRepository.save(transfer);
    }
    
    public InternalTransfer cancelTransfer(String transferId) {
        Optional<InternalTransfer> transferOpt = transferRepository.findById(transferId);
        
        if (transferOpt.isEmpty()) {
            throw new RuntimeException("Transfer not found");
        }
        
        InternalTransfer transfer = transferOpt.get();
        
        if (!"DRAFT".equals(transfer.getStatus())) {
            throw new RuntimeException("Only DRAFT transfers can be cancelled");
        }
        
        transfer.setStatus("CANCELLED");
        return transferRepository.save(transfer);
    }
    
    public void deleteTransfer(String id) {
        transferRepository.deleteById(id);
    }
}
