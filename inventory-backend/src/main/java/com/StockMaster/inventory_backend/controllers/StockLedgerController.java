package com.StockMaster.inventory_backend.controllers;

import com.StockMaster.inventory_backend.models.StockLedger;
import com.StockMaster.inventory_backend.services.StockLedgerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/ledger")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class StockLedgerController {
    
    @Autowired
    private StockLedgerService ledgerService;
    
    @GetMapping
    public ResponseEntity<List<StockLedger>> getAllLedgerEntries() {
        return ResponseEntity.ok(ledgerService.getAllLedgerEntries());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getLedgerEntryById(@PathVariable String id) {
        Optional<StockLedger> ledgerEntry = ledgerService.getLedgerEntryById(id);
        if (ledgerEntry.isPresent()) {
            return ResponseEntity.ok(ledgerEntry.get());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", "Ledger entry not found"));
    }
    
    @GetMapping("/product/{productId}")
    public ResponseEntity<List<StockLedger>> getLedgerEntriesByProduct(@PathVariable String productId) {
        return ResponseEntity.ok(ledgerService.getLedgerEntriesByProduct(productId));
    }
    
    @GetMapping("/warehouse/{warehouseId}")
    public ResponseEntity<List<StockLedger>> getLedgerEntriesByWarehouse(@PathVariable String warehouseId) {
        return ResponseEntity.ok(ledgerService.getLedgerEntriesByWarehouse(warehouseId));
    }
    
    @GetMapping("/change-type/{changeType}")
    public ResponseEntity<List<StockLedger>> getLedgerEntriesByChangeType(@PathVariable String changeType) {
        return ResponseEntity.ok(ledgerService.getLedgerEntriesByChangeType(changeType));
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<StockLedger>> getLedgerEntriesByUser(@PathVariable String userId) {
        return ResponseEntity.ok(ledgerService.getLedgerEntriesByUser(userId));
    }
    
    @GetMapping("/reference/{referenceId}")
    public ResponseEntity<List<StockLedger>> getLedgerEntriesByReference(@PathVariable String referenceId) {
        return ResponseEntity.ok(ledgerService.getLedgerEntriesByReference(referenceId));
    }
    
    @GetMapping("/date-range")
    public ResponseEntity<List<StockLedger>> getLedgerEntriesByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        return ResponseEntity.ok(ledgerService.getLedgerEntriesByDateRange(startDate, endDate));
    }
    
    @GetMapping("/product/{productId}/warehouse/{warehouseId}")
    public ResponseEntity<List<StockLedger>> getLedgerEntriesByProductAndWarehouse(
            @PathVariable String productId,
            @PathVariable String warehouseId) {
        return ResponseEntity.ok(ledgerService.getLedgerEntriesByProductAndWarehouse(productId, warehouseId));
    }
}
