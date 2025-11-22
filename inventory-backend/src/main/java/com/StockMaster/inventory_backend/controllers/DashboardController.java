package com.StockMaster.inventory_backend.controllers;

import com.StockMaster.inventory_backend.dto.DashboardDTO;
import com.StockMaster.inventory_backend.services.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping
    public ResponseEntity<DashboardDTO> getDashboard() {
        DashboardDTO dashboard = dashboardService.getDashboardData();
        return ResponseEntity.ok(dashboard);
    }

    @GetMapping("/stock-value")
    public ResponseEntity<Map<String, Object>> getStockValueAnalysis() {
        Map<String, Object> analysis = dashboardService.getStockValueAnalysis();
        return ResponseEntity.ok(analysis);
    }
}
