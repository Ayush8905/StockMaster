package com.StockMaster.inventory_backend.services;

import com.StockMaster.inventory_backend.dto.DashboardDTO;
import com.StockMaster.inventory_backend.models.Product;
import com.StockMaster.inventory_backend.models.Stock;
import com.StockMaster.inventory_backend.models.Warehouse;
import com.StockMaster.inventory_backend.repositories.ProductRepository;
import com.StockMaster.inventory_backend.repositories.StockRepository;
import com.StockMaster.inventory_backend.repositories.WarehouseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.aggregation.GroupOperation;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static org.springframework.data.mongodb.core.aggregation.Aggregation.*;

@Service
public class DashboardService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private StockRepository stockRepository;

    @Autowired
    private WarehouseRepository warehouseRepository;

    @Autowired
    private MongoTemplate mongoTemplate;

    public DashboardDTO getDashboardData() {
        DashboardDTO dashboard = new DashboardDTO();
        
        // Get KPIs
        dashboard.setKpis(getKPIs());
        
        // Get low stock items
        dashboard.setLowStockItems(getLowStockItems());
        
        // Get category breakdown
        dashboard.setCategoryBreakdown(getCategoryStats());
        
        // Get warehouse statistics
        dashboard.setWarehouseStats(getWarehouseStats());
        
        return dashboard;
    }

    private DashboardDTO.KPIs getKPIs() {
        DashboardDTO.KPIs kpis = new DashboardDTO.KPIs();
        
        // Product counts
        kpis.setTotalProducts(productRepository.count());
        kpis.setActiveProducts((long) productRepository.findByActive(true).size());
        
        // Total stock across all warehouses
        Integer totalStock = stockRepository.findAll().stream()
                .mapToInt(Stock::getQuantity)
                .sum();
        kpis.setTotalStock(totalStock);
        
        // Low stock count (products below reorder level)
        kpis.setLowStockCount(getLowStockItems().size());
        
        // Warehouse counts
        kpis.setTotalWarehouses(warehouseRepository.count());
        kpis.setActiveWarehouses((long) warehouseRepository.findByActive(true).size());
        
        return kpis;
    }

    private List<DashboardDTO.LowStockItem> getLowStockItems() {
        List<DashboardDTO.LowStockItem> lowStockItems = new ArrayList<>();
        List<Product> activeProducts = productRepository.findByActive(true);
        
        for (Product product : activeProducts) {
            // Get total stock for this product across all warehouses
            List<Stock> productStocks = stockRepository.findByProductId(product.getId());
            
            for (Stock stock : productStocks) {
                if (stock.getQuantity() < product.getReorderLevel()) {
                    DashboardDTO.LowStockItem item = new DashboardDTO.LowStockItem();
                    item.setProductId(product.getId());
                    item.setProductName(product.getName());
                    item.setSku(product.getSku());
                    item.setCurrentStock(stock.getQuantity());
                    item.setReorderLevel(product.getReorderLevel());
                    
                    // Get warehouse name
                    warehouseRepository.findById(stock.getWarehouseId()).ifPresent(warehouse -> 
                        item.setWarehouseName(warehouse.getName())
                    );
                    
                    lowStockItems.add(item);
                }
            }
        }
        
        return lowStockItems;
    }

    private List<DashboardDTO.CategoryStats> getCategoryStats() {
        List<Product> activeProducts = productRepository.findByActive(true);
        Map<String, DashboardDTO.CategoryStats> categoryMap = new HashMap<>();
        
        for (Product product : activeProducts) {
            String category = product.getCategory();
            
            if (!categoryMap.containsKey(category)) {
                categoryMap.put(category, new DashboardDTO.CategoryStats(category, 0L, 0));
            }
            
            DashboardDTO.CategoryStats stats = categoryMap.get(category);
            stats.setProductCount(stats.getProductCount() + 1);
            
            // Get total stock for this product
            Integer productTotalStock = stockRepository.findByProductId(product.getId()).stream()
                    .mapToInt(Stock::getQuantity)
                    .sum();
            stats.setTotalStock(stats.getTotalStock() + productTotalStock);
        }
        
        return new ArrayList<>(categoryMap.values());
    }

    private List<DashboardDTO.WarehouseStats> getWarehouseStats() {
        List<DashboardDTO.WarehouseStats> warehouseStats = new ArrayList<>();
        List<Warehouse> activeWarehouses = warehouseRepository.findByActive(true);
        
        for (Warehouse warehouse : activeWarehouses) {
            List<Stock> warehouseStock = stockRepository.findByWarehouseId(warehouse.getId());
            
            DashboardDTO.WarehouseStats stats = new DashboardDTO.WarehouseStats();
            stats.setWarehouseId(warehouse.getId());
            stats.setWarehouseName(warehouse.getName());
            stats.setLocation(warehouse.getLocation());
            stats.setTotalItems(warehouseStock.size());
            stats.setTotalQuantity(warehouseStock.stream()
                    .mapToInt(Stock::getQuantity)
                    .sum());
            
            warehouseStats.add(stats);
        }
        
        return warehouseStats;
    }

    public Map<String, Object> getStockValueAnalysis() {
        Map<String, Object> analysis = new HashMap<>();
        
        List<Product> activeProducts = productRepository.findByActive(true);
        int totalStockValue = 0;
        
        for (Product product : activeProducts) {
            Integer totalStock = stockRepository.findByProductId(product.getId()).stream()
                    .mapToInt(Stock::getQuantity)
                    .sum();
            totalStockValue += totalStock;
        }
        
        analysis.put("totalStockValue", totalStockValue);
        analysis.put("productCount", activeProducts.size());
        
        return analysis;
    }
}
