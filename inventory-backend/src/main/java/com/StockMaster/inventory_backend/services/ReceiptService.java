package com.StockMaster.inventory_backend.services;

import com.StockMaster.inventory_backend.dto.ReceiptDTO;
import com.StockMaster.inventory_backend.models.Product;
import com.StockMaster.inventory_backend.models.Receipt;
import com.StockMaster.inventory_backend.models.Stock;
import com.StockMaster.inventory_backend.models.Warehouse;
import com.StockMaster.inventory_backend.repositories.ProductRepository;
import com.StockMaster.inventory_backend.repositories.ReceiptRepository;
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
public class ReceiptService {

    @Autowired
    private ReceiptRepository receiptRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private WarehouseRepository warehouseRepository;

    @Autowired
    private StockRepository stockRepository;

    @Autowired
    private StockLedgerService stockLedgerService;

    public List<ReceiptDTO> getAllReceipts() {
        return receiptRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<ReceiptDTO> getReceiptsByStatus(String status) {
        return receiptRepository.findByStatus(status).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<ReceiptDTO> getReceiptsByWarehouse(String warehouseId) {
        return receiptRepository.findByWarehouseId(warehouseId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public ReceiptDTO getReceiptById(String id) {
        Receipt receipt = receiptRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Receipt not found with id: " + id));
        return convertToDTO(receipt);
    }

    public ReceiptDTO createReceipt(ReceiptDTO receiptDTO, String username) {
        // Validate warehouse exists
        warehouseRepository.findById(receiptDTO.getWarehouseId())
                .orElseThrow(() -> new RuntimeException("Warehouse not found with id: " + receiptDTO.getWarehouseId()));

        // Validate all products exist
        for (ReceiptDTO.ReceiptItemDTO itemDTO : receiptDTO.getItems()) {
            Product product = productRepository.findById(itemDTO.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found with id: " + itemDTO.getProductId()));
            itemDTO.setProductName(product.getName());
            itemDTO.setProductSku(product.getSku());
        }

        Receipt receipt = new Receipt();
        receipt.setReceiptNumber(generateReceiptNumber());
        receipt.setSupplier(receiptDTO.getSupplier());
        receipt.setWarehouseId(receiptDTO.getWarehouseId());
        receipt.setReceiptDate(receiptDTO.getReceiptDate() != null ? receiptDTO.getReceiptDate() : LocalDateTime.now());
        receipt.setStatus("DRAFT");
        receipt.setNotes(receiptDTO.getNotes());
        receipt.setCreatedBy(username);
        receipt.setCreatedAt(LocalDateTime.now());

        // Convert items
        List<Receipt.ReceiptItem> items = receiptDTO.getItems().stream()
                .map(dto -> new Receipt.ReceiptItem(
                        dto.getProductId(),
                        dto.getQuantity(),
                        dto.getProductName(),
                        dto.getProductSku()
                ))
                .collect(Collectors.toList());
        receipt.setItems(items);

        Receipt savedReceipt = receiptRepository.save(receipt);
        return convertToDTO(savedReceipt);
    }

    @Transactional
    public ReceiptDTO validateReceipt(String id, String username) {
        Receipt receipt = receiptRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Receipt not found with id: " + id));

        if ("VALIDATED".equals(receipt.getStatus())) {
            throw new RuntimeException("Receipt is already validated");
        }

        // Update stock for each item
        for (Receipt.ReceiptItem item : receipt.getItems()) {
            updateStock(item.getProductId(), receipt.getWarehouseId(), item.getQuantity(),
                    receipt.getId(), "RECEIPT", username, item.getProductName(), item.getProductSku());
        }

        // Update receipt status
        receipt.setStatus("VALIDATED");
        receipt.setValidatedAt(LocalDateTime.now());
        receipt.setValidatedBy(username);

        Receipt validatedReceipt = receiptRepository.save(receipt);
        return convertToDTO(validatedReceipt);
    }

    private void updateStock(String productId, String warehouseId, Integer quantity,
                             String referenceId, String referenceType, String username,
                             String productName, String productSku) {
        Optional<Stock> existingStock = stockRepository.findByProductIdAndWarehouseId(productId, warehouseId);

        Integer quantityBefore;
        Integer quantityAfter;
        Stock stock;

        if (existingStock.isPresent()) {
            stock = existingStock.get();
            quantityBefore = stock.getQuantity();
            quantityAfter = quantityBefore + quantity;
            stock.setQuantity(quantityAfter);
            stock.setLastUpdated(LocalDateTime.now());
        } else {
            stock = new Stock();
            stock.setProductId(productId);
            stock.setWarehouseId(warehouseId);
            quantityBefore = 0;
            quantityAfter = quantity;
            stock.setQuantity(quantityAfter);
            stock.setLastUpdated(LocalDateTime.now());
        }

        stockRepository.save(stock);

        // Log stock change in ledger
        Optional<Warehouse> warehouse = warehouseRepository.findById(warehouseId);
        String warehouseName = warehouse.map(Warehouse::getName).orElse("Unknown");

        stockLedgerService.logStockChange(
                productId, productName, productSku,
                warehouseId, warehouseName,
                "RECEIPT", quantityBefore, quantity, quantityAfter,
                referenceId, referenceType,
                username, username, "Stock increased via receipt validation"
        );
    }

    public void deleteReceipt(String id) {
        Receipt receipt = receiptRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Receipt not found with id: " + id));

        if ("VALIDATED".equals(receipt.getStatus())) {
            throw new RuntimeException("Cannot delete validated receipt");
        }

        receiptRepository.deleteById(id);
    }

    private String generateReceiptNumber() {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        String receiptNumber = "RCV-" + timestamp;
        
        int counter = 1;
        while (receiptRepository.existsByReceiptNumber(receiptNumber)) {
            receiptNumber = "RCV-" + timestamp + "-" + counter;
            counter++;
        }
        
        return receiptNumber;
    }

    private ReceiptDTO convertToDTO(Receipt receipt) {
        ReceiptDTO dto = new ReceiptDTO();
        dto.setId(receipt.getId());
        dto.setReceiptNumber(receipt.getReceiptNumber());
        dto.setSupplier(receipt.getSupplier());
        dto.setWarehouseId(receipt.getWarehouseId());
        dto.setReceiptDate(receipt.getReceiptDate());
        dto.setStatus(receipt.getStatus());
        dto.setNotes(receipt.getNotes());
        dto.setCreatedBy(receipt.getCreatedBy());
        dto.setCreatedAt(receipt.getCreatedAt());
        dto.setValidatedAt(receipt.getValidatedAt());
        dto.setValidatedBy(receipt.getValidatedBy());

        // Convert items
        List<ReceiptDTO.ReceiptItemDTO> itemDTOs = receipt.getItems().stream()
                .map(item -> new ReceiptDTO.ReceiptItemDTO(
                        item.getProductId(),
                        item.getQuantity(),
                        item.getProductName(),
                        item.getProductSku()
                ))
                .collect(Collectors.toList());
        dto.setItems(itemDTOs);

        // Get warehouse name
        warehouseRepository.findById(receipt.getWarehouseId()).ifPresent(warehouse ->
                dto.setWarehouseName(warehouse.getName())
        );

        return dto;
    }
}
