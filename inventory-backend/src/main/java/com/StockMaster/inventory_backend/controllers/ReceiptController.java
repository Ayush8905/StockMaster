package com.StockMaster.inventory_backend.controllers;

import com.StockMaster.inventory_backend.dto.ReceiptDTO;
import com.StockMaster.inventory_backend.services.ReceiptService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/receipts")
@CrossOrigin(origins = "*")
public class ReceiptController {

    @Autowired
    private ReceiptService receiptService;

    @GetMapping
    public ResponseEntity<List<ReceiptDTO>> getAllReceipts() {
        List<ReceiptDTO> receipts = receiptService.getAllReceipts();
        return ResponseEntity.ok(receipts);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<ReceiptDTO>> getReceiptsByStatus(@PathVariable String status) {
        List<ReceiptDTO> receipts = receiptService.getReceiptsByStatus(status.toUpperCase());
        return ResponseEntity.ok(receipts);
    }

    @GetMapping("/warehouse/{warehouseId}")
    public ResponseEntity<List<ReceiptDTO>> getReceiptsByWarehouse(@PathVariable String warehouseId) {
        List<ReceiptDTO> receipts = receiptService.getReceiptsByWarehouse(warehouseId);
        return ResponseEntity.ok(receipts);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getReceiptById(@PathVariable String id) {
        try {
            ReceiptDTO receipt = receiptService.getReceiptById(id);
            return ResponseEntity.ok(receipt);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> createReceipt(@Valid @RequestBody ReceiptDTO receiptDTO, 
                                          Authentication authentication) {
        try {
            String username = authentication.getName();
            ReceiptDTO createdReceipt = receiptService.createReceipt(receiptDTO, username);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdReceipt);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    @PutMapping("/{id}/validate")
    public ResponseEntity<?> validateReceipt(@PathVariable String id, 
                                             Authentication authentication) {
        try {
            String username = authentication.getName();
            ReceiptDTO validatedReceipt = receiptService.validateReceipt(id, username);
            return ResponseEntity.ok(validatedReceipt);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteReceipt(@PathVariable String id) {
        try {
            receiptService.deleteReceipt(id);
            return ResponseEntity.ok(new SuccessResponse("Receipt deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    static class ErrorResponse {
        private String message;

        public ErrorResponse(String message) {
            this.message = message;
        }

        public String getMessage() {
            return message;
        }
    }

    static class SuccessResponse {
        private String message;

        public SuccessResponse(String message) {
            this.message = message;
        }

        public String getMessage() {
            return message;
        }
    }
}
