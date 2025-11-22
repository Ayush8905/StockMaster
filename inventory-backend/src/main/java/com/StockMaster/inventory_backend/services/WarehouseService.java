package com.StockMaster.inventory_backend.services;

import com.StockMaster.inventory_backend.dto.WarehouseDTO;
import com.StockMaster.inventory_backend.models.Warehouse;
import com.StockMaster.inventory_backend.repositories.WarehouseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class WarehouseService {

    @Autowired
    private WarehouseRepository warehouseRepository;

    public List<WarehouseDTO> getAllWarehouses() {
        return warehouseRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<WarehouseDTO> getActiveWarehouses() {
        return warehouseRepository.findByActive(true).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public WarehouseDTO getWarehouseById(String id) {
        Warehouse warehouse = warehouseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Warehouse not found with id: " + id));
        return convertToDTO(warehouse);
    }

    public WarehouseDTO createWarehouse(WarehouseDTO warehouseDTO) {
        if (warehouseRepository.existsByName(warehouseDTO.getName())) {
            throw new RuntimeException("Warehouse with name " + warehouseDTO.getName() + " already exists");
        }

        Warehouse warehouse = new Warehouse();
        warehouse.setName(warehouseDTO.getName());
        warehouse.setLocation(warehouseDTO.getLocation());
        warehouse.setDescription(warehouseDTO.getDescription());
        warehouse.setActive(true);
        warehouse.setCreatedAt(LocalDateTime.now());
        warehouse.setUpdatedAt(LocalDateTime.now());

        Warehouse savedWarehouse = warehouseRepository.save(warehouse);
        return convertToDTO(savedWarehouse);
    }

    public WarehouseDTO updateWarehouse(String id, WarehouseDTO warehouseDTO) {
        Warehouse warehouse = warehouseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Warehouse not found with id: " + id));

        if (!warehouse.getName().equals(warehouseDTO.getName()) && 
            warehouseRepository.existsByName(warehouseDTO.getName())) {
            throw new RuntimeException("Warehouse with name " + warehouseDTO.getName() + " already exists");
        }

        warehouse.setName(warehouseDTO.getName());
        warehouse.setLocation(warehouseDTO.getLocation());
        warehouse.setDescription(warehouseDTO.getDescription());
        warehouse.setActive(warehouseDTO.getActive() != null ? warehouseDTO.getActive() : true);
        warehouse.setUpdatedAt(LocalDateTime.now());

        Warehouse updatedWarehouse = warehouseRepository.save(warehouse);
        return convertToDTO(updatedWarehouse);
    }

    public void deleteWarehouse(String id) {
        Warehouse warehouse = warehouseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Warehouse not found with id: " + id));
        
        warehouse.setActive(false);
        warehouse.setUpdatedAt(LocalDateTime.now());
        warehouseRepository.save(warehouse);
    }

    private WarehouseDTO convertToDTO(Warehouse warehouse) {
        WarehouseDTO dto = new WarehouseDTO();
        dto.setId(warehouse.getId());
        dto.setName(warehouse.getName());
        dto.setLocation(warehouse.getLocation());
        dto.setDescription(warehouse.getDescription());
        dto.setActive(warehouse.getActive());
        return dto;
    }
}
