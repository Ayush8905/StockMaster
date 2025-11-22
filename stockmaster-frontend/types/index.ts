export interface User {
    id: string;
    email: string;
    role: string;
    createdAt: string;
}

export interface AuthResponse {
    token: string;
    email: string;
    role: string;
}

export interface Product {
    id: string;
    name: string;
    sku: string;
    category: string;
    unit: string;
    reorderLevel: number;
    initialStock: number;
    active: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface Warehouse {
    id: string;
    name: string;
    location: string;
    description: string;
    active: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface Stock {
    id: string;
    productId: string;
    warehouseId: string;
    quantity: number;
    locationRack: string;
    lastUpdated: string;
}

export interface StockWithDetails extends Stock {
    productName?: string;
    productSku?: string;
    warehouseName?: string;
}

export interface ReceiptItem {
    productId: string;
    quantity: number;
    unitPrice: number;
}

export interface Receipt {
    id: string;
    receiptNumber: string;
    supplier: string;
    warehouseId: string;
    items: ReceiptItem[];
    status: 'DRAFT' | 'VALIDATED';
    notes: string;
    createdBy: string;
    createdAt: string;
    validatedAt?: string;
    validatedBy?: string;
}

export interface DeliveryItem {
    productId: string;
    quantity: number;
    unitPrice: number;
}

export interface Delivery {
    id: string;
    deliveryNumber: string;
    customer: string;
    warehouseId: string;
    items: DeliveryItem[];
    status: 'DRAFT' | 'VALIDATED';
    notes: string;
    createdBy: string;
    createdAt: string;
    validatedAt?: string;
    validatedBy?: string;
}

export interface DashboardKPI {
    totalProducts: number;
    activeProducts: number;
    totalStock: number;
    lowStockCount: number;
    totalWarehouses: number;
    activeWarehouses: number;
}

export interface CategoryStat {
    category: string;
    productCount: number;
    totalStock: number;
}

export interface WarehouseStat {
    warehouseId: string;
    warehouseName: string;
    totalStock: number;
    productCount: number;
}

export interface LowStockItem {
    productId: string;
    productName: string;
    sku: string;
    category: string;
    reorderLevel: number;
    currentStock: number;
}

export interface DashboardData {
    kpis: DashboardKPI;
    categoryBreakdown: CategoryStat[];
    warehouseStats: WarehouseStat[];
    lowStockItems: LowStockItem[];
}
