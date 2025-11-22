package com.StockMaster.inventory_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardDTO {
    
    private KPIs kpis;
    private List<LowStockItem> lowStockItems;
    private List<CategoryStats> categoryBreakdown;
    private List<WarehouseStats> warehouseStats;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class KPIs {
        private Long totalProducts;
        private Long activeProducts;
        private Integer totalStock;
        private Integer lowStockCount;
        private Long totalWarehouses;
        private Long activeWarehouses;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LowStockItem {
        private String productId;
        private String productName;
        private String sku;
        private Integer currentStock;
        private Integer reorderLevel;
        private String warehouseName;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CategoryStats {
        private String category;
        private Long productCount;
        private Integer totalStock;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class WarehouseStats {
        private String warehouseId;
        private String warehouseName;
        private String location;
        private Integer totalItems;
        private Integer totalQuantity;
    }
}
