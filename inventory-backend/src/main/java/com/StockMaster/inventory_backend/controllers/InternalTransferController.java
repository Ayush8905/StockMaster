package com.StockMaster.inventory_backend.controllers;

import com.StockMaster.inventory_backend.models.InternalTransfer;
import com.StockMaster.inventory_backend.services.InternalTransferService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/transfers")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class InternalTransferController {
    
    @Autowired
    private InternalTransferService transferService;
    
    @GetMapping
    public ResponseEntity<List<InternalTransfer>> getAllTransfers() {
        return ResponseEntity.ok(transferService.getAllTransfers());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getTransferById(@PathVariable String id) {
        Optional<InternalTransfer> transfer = transferService.getTransferById(id);
        if (transfer.isPresent()) {
            return ResponseEntity.ok(transfer.get());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", "Transfer not found"));
    }
    
    @GetMapping("/status/{status}")
    public ResponseEntity<List<InternalTransfer>> getTransfersByStatus(@PathVariable String status) {
        return ResponseEntity.ok(transferService.getTransfersByStatus(status));
    }
    
    @GetMapping("/from-warehouse/{warehouseId}")
    public ResponseEntity<List<InternalTransfer>> getTransfersByFromWarehouse(@PathVariable String warehouseId) {
        return ResponseEntity.ok(transferService.getTransfersByFromWarehouse(warehouseId));
    }
    
    @GetMapping("/to-warehouse/{warehouseId}")
    public ResponseEntity<List<InternalTransfer>> getTransfersByToWarehouse(@PathVariable String warehouseId) {
        return ResponseEntity.ok(transferService.getTransfersByToWarehouse(warehouseId));
    }
    
    @GetMapping("/product/{productId}")
    public ResponseEntity<List<InternalTransfer>> getTransfersByProduct(@PathVariable String productId) {
        return ResponseEntity.ok(transferService.getTransfersByProduct(productId));
    }
    
    @PostMapping
    public ResponseEntity<?> createTransfer(@RequestBody InternalTransfer transfer) {
        try {
            InternalTransfer created = transferService.createTransfer(transfer);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }
    
    @PutMapping("/{id}/complete")
    public ResponseEntity<?> completeTransfer(
            @PathVariable String id,
            @RequestBody Map<String, String> body) {
        try {
            String completedBy = body.get("completedBy");
            InternalTransfer completed = transferService.completeTransfer(id, completedBy);
            return ResponseEntity.ok(completed);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }
    
    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancelTransfer(@PathVariable String id) {
        try {
            InternalTransfer cancelled = transferService.cancelTransfer(id);
            return ResponseEntity.ok(cancelled);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTransfer(@PathVariable String id) {
        try {
            transferService.deleteTransfer(id);
            return ResponseEntity.ok(Map.of("message", "Transfer deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        }
    }
}
