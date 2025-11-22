package com.StockMaster.inventory_backend.controllers;

import com.StockMaster.inventory_backend.dto.DeliveryDTO;
import com.StockMaster.inventory_backend.services.DeliveryService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/deliveries")
@CrossOrigin(origins = "*")
public class DeliveryController {

    @Autowired
    private DeliveryService deliveryService;

    @GetMapping
    public ResponseEntity<List<DeliveryDTO>> getAllDeliveries() {
        List<DeliveryDTO> deliveries = deliveryService.getAllDeliveries();
        return ResponseEntity.ok(deliveries);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<DeliveryDTO>> getDeliveriesByStatus(@PathVariable String status) {
        List<DeliveryDTO> deliveries = deliveryService.getDeliveriesByStatus(status.toUpperCase());
        return ResponseEntity.ok(deliveries);
    }

    @GetMapping("/warehouse/{warehouseId}")
    public ResponseEntity<List<DeliveryDTO>> getDeliveriesByWarehouse(@PathVariable String warehouseId) {
        List<DeliveryDTO> deliveries = deliveryService.getDeliveriesByWarehouse(warehouseId);
        return ResponseEntity.ok(deliveries);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getDeliveryById(@PathVariable String id) {
        try {
            DeliveryDTO delivery = deliveryService.getDeliveryById(id);
            return ResponseEntity.ok(delivery);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> createDelivery(@Valid @RequestBody DeliveryDTO deliveryDTO, 
                                          Authentication authentication) {
        try {
            String username = authentication.getName();
            DeliveryDTO createdDelivery = deliveryService.createDelivery(deliveryDTO, username);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdDelivery);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    @PutMapping("/{id}/validate")
    public ResponseEntity<?> validateDelivery(@PathVariable String id, 
                                             Authentication authentication) {
        try {
            String username = authentication.getName();
            DeliveryDTO validatedDelivery = deliveryService.validateDelivery(id, username);
            return ResponseEntity.ok(validatedDelivery);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDelivery(@PathVariable String id) {
        try {
            deliveryService.deleteDelivery(id);
            return ResponseEntity.ok(new SuccessResponse("Delivery deleted successfully"));
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
