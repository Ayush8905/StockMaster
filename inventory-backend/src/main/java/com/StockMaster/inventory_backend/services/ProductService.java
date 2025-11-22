package com.StockMaster.inventory_backend.services;

import com.StockMaster.inventory_backend.dto.ProductDTO;
import com.StockMaster.inventory_backend.models.Product;
import com.StockMaster.inventory_backend.repositories.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    public List<ProductDTO> getAllProducts() {
        return productRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<ProductDTO> getActiveProducts() {
        return productRepository.findByActive(true).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public ProductDTO getProductById(String id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        return convertToDTO(product);
    }

    public ProductDTO getProductBySku(String sku) {
        Product product = productRepository.findBySku(sku)
                .orElseThrow(() -> new RuntimeException("Product not found with SKU: " + sku));
        return convertToDTO(product);
    }

    public ProductDTO createProduct(ProductDTO productDTO) {
        // Check if SKU already exists
        if (productRepository.existsBySku(productDTO.getSku())) {
            throw new RuntimeException("Product with SKU " + productDTO.getSku() + " already exists");
        }

        Product product = new Product();
        product.setName(productDTO.getName());
        product.setSku(productDTO.getSku());
        product.setCategory(productDTO.getCategory());
        product.setUnit(productDTO.getUnit());
        product.setReorderLevel(productDTO.getReorderLevel());
        product.setInitialStock(productDTO.getInitialStock() != null ? productDTO.getInitialStock() : 0);
        product.setActive(true);
        product.setCreatedAt(LocalDateTime.now());
        product.setUpdatedAt(LocalDateTime.now());

        Product savedProduct = productRepository.save(product);
        return convertToDTO(savedProduct);
    }

    public ProductDTO updateProduct(String id, ProductDTO productDTO) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));

        // Check if SKU is being changed and if new SKU already exists
        if (!product.getSku().equals(productDTO.getSku()) && 
            productRepository.existsBySku(productDTO.getSku())) {
            throw new RuntimeException("Product with SKU " + productDTO.getSku() + " already exists");
        }

        product.setName(productDTO.getName());
        product.setSku(productDTO.getSku());
        product.setCategory(productDTO.getCategory());
        product.setUnit(productDTO.getUnit());
        product.setReorderLevel(productDTO.getReorderLevel());
        product.setActive(productDTO.getActive() != null ? productDTO.getActive() : true);
        product.setUpdatedAt(LocalDateTime.now());

        Product updatedProduct = productRepository.save(product);
        return convertToDTO(updatedProduct);
    }

    public void deleteProduct(String id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        
        // Soft delete - set active to false
        product.setActive(false);
        product.setUpdatedAt(LocalDateTime.now());
        productRepository.save(product);
    }

    public void permanentDeleteProduct(String id) {
        if (!productRepository.existsById(id)) {
            throw new RuntimeException("Product not found with id: " + id);
        }
        productRepository.deleteById(id);
    }

    public List<ProductDTO> searchProducts(String keyword) {
        return productRepository.findByNameContainingIgnoreCase(keyword).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<ProductDTO> getProductsByCategory(String category) {
        return productRepository.findByCategory(category).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private ProductDTO convertToDTO(Product product) {
        ProductDTO dto = new ProductDTO();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setSku(product.getSku());
        dto.setCategory(product.getCategory());
        dto.setUnit(product.getUnit());
        dto.setReorderLevel(product.getReorderLevel());
        dto.setInitialStock(product.getInitialStock());
        dto.setActive(product.isActive());
        return dto;
    }
}
