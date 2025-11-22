package com.StockMaster.inventory_backend.services;

import com.StockMaster.inventory_backend.models.StockLedger;
import com.StockMaster.inventory_backend.repositories.StockLedgerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class StockLedgerService {
    
    @Autowired
    private StockLedgerRepository ledgerRepository;
    
    public List<StockLedger> getAllLedgerEntries() {
        return ledgerRepository.findAll();
    }
    
    public Optional<StockLedger> getLedgerEntryById(String id) {
        return ledgerRepository.findById(id);
    }
    
    public List<StockLedger> getLedgerEntriesByProduct(String productId) {
        return ledgerRepository.findByProductId(productId);
    }
    
    public List<StockLedger> getLedgerEntriesByWarehouse(String warehouseId) {
        return ledgerRepository.findByWarehouseId(warehouseId);
    }
    
    public List<StockLedger> getLedgerEntriesByChangeType(String changeType) {
        return ledgerRepository.findByChangeType(changeType);
    }
    
    public List<StockLedger> getLedgerEntriesByUser(String userId) {
        return ledgerRepository.findByUserId(userId);
    }
    
    public List<StockLedger> getLedgerEntriesByReference(String referenceId) {
        return ledgerRepository.findByReferenceId(referenceId);
    }
    
    public List<StockLedger> getLedgerEntriesByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return ledgerRepository.findByCreatedAtBetween(startDate, endDate);
    }
    
    public List<StockLedger> getLedgerEntriesByProductAndWarehouse(String productId, String warehouseId) {
        return ledgerRepository.findByProductIdAndWarehouseId(productId, warehouseId);
    }
    
    /**
     * Create a new ledger entry to log stock changes
     */
    public StockLedger createLedgerEntry(StockLedger ledgerEntry) {
        ledgerEntry.setCreatedAt(LocalDateTime.now());
        return ledgerRepository.save(ledgerEntry);
    }
    
    /**
     * Helper method to create a ledger entry with all required fields
     */
    public StockLedger logStockChange(
            String productId, String productName, String productSku,
            String warehouseId, String warehouseName,
            String changeType, Integer quantityBefore,
            Integer quantityChange, Integer quantityAfter,
            String referenceId, String referenceType,
            String userId, String userName, String notes) {
        
        StockLedger ledger = new StockLedger(
                productId, productName, productSku,
                warehouseId, warehouseName,
                changeType, quantityBefore,
                quantityChange, quantityAfter,
                referenceId, referenceType,
                userId, userName
        );
        ledger.setNotes(notes);
        
        return createLedgerEntry(ledger);
    }
}
