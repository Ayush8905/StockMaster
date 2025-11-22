package com.StockMaster.inventory_backend.controllers;

import com.StockMaster.inventory_backend.dto.StockDTO;
import com.StockMaster.inventory_backend.services.StockService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stock")
@CrossOrigin(origins = "*")
public class StockController {

    @Autowired
    private StockService stockService;

    @GetMapping
    public ResponseEntity<List<StockDTO>> getAllStock() {
        List<StockDTO> stock = stockService.getAllStock();
        return ResponseEntity.ok(stock);
    }

    @GetMapping("/warehouse/{warehouseId}")
    public ResponseEntity<List<StockDTO>> getStockByWarehouse(@PathVariable String warehouseId) {
        List<StockDTO> stock = stockService.getStockByWarehouse(warehouseId);
        return ResponseEntity.ok(stock);
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<StockDTO>> getStockByProduct(@PathVariable String productId) {
        List<StockDTO> stock = stockService.getStockByProduct(productId);
        return ResponseEntity.ok(stock);
    }

    @GetMapping("/product/{productId}/warehouse/{warehouseId}")
    public ResponseEntity<?> getStockByProductAndWarehouse(@PathVariable String productId, 
                                                           @PathVariable String warehouseId) {
        try {
            StockDTO stock = stockService.getStockByProductAndWarehouse(productId, warehouseId);
            return ResponseEntity.ok(stock);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    @GetMapping("/product/{productId}/total")
    public ResponseEntity<?> getTotalStockForProduct(@PathVariable String productId) {
        try {
            Integer totalStock = stockService.getTotalStockForProduct(productId);
            return ResponseEntity.ok(new TotalStockResponse(productId, totalStock));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    @GetMapping("/low")
    public ResponseEntity<List<StockDTO>> getLowStock(@RequestParam(defaultValue = "10") Integer threshold) {
        List<StockDTO> lowStock = stockService.getLowStock(threshold);
        return ResponseEntity.ok(lowStock);
    }

    @PostMapping
    public ResponseEntity<?> createOrUpdateStock(@Valid @RequestBody StockDTO stockDTO) {
        try {
            StockDTO savedStock = stockService.createOrUpdateStock(stockDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedStock);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    @PutMapping("/adjust")
    public ResponseEntity<?> adjustStock(@RequestParam String productId,
                                        @RequestParam String warehouseId,
                                        @RequestParam Integer adjustment) {
        try {
            StockDTO adjustedStock = stockService.adjustStock(productId, warehouseId, adjustment);
            return ResponseEntity.ok(adjustedStock);
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

    static class TotalStockResponse {
        private String productId;
        private Integer totalQuantity;

        public TotalStockResponse(String productId, Integer totalQuantity) {
            this.productId = productId;
            this.totalQuantity = totalQuantity;
        }

        public String getProductId() {
            return productId;
        }

        public Integer getTotalQuantity() {
            return totalQuantity;
        }
    }
}
