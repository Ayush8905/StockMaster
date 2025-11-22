'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/DashboardLayout';
import { stockAPI, productsAPI, warehousesAPI } from '@/lib/api';
import { Stock, Product, Warehouse } from '@/types';
import { Box, TrendingUp, TrendingDown } from 'lucide-react';

export default function StockPage() {
    const [stock, setStock] = useState<Stock[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAdjustModal, setShowAdjustModal] = useState(false);
    const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
    const [adjustment, setAdjustment] = useState(0);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [stockData, productsData, warehousesData] = await Promise.all([
                stockAPI.getAll(),
                productsAPI.getAll(),
                warehousesAPI.getAll(),
            ]);
            setStock(stockData);
            setProducts(productsData);
            setWarehouses(warehousesData);
        } catch (error) {
            console.error('Failed to load data:', error);
        } finally {
            setLoading(false);
        }
    };

    const getProductName = (productId: string) => {
        return products.find((p) => p.id === productId)?.name || 'Unknown';
    };

    const getWarehouseName = (warehouseId: string) => {
        return warehouses.find((w) => w.id === warehouseId)?.name || 'Unknown';
    };

    const openAdjustModal = (stockItem: Stock) => {
        setSelectedStock(stockItem);
        setAdjustment(0);
        setShowAdjustModal(true);
    };

    const handleAdjustment = async () => {
        if (!selectedStock || adjustment === 0) return;

        try {
            await stockAPI.adjust(selectedStock.productId, selectedStock.warehouseId, adjustment);
            await loadData();
            setShowAdjustModal(false);
            setSelectedStock(null);
            setAdjustment(0);
        } catch (error: any) {
            alert(error.response?.data?.message || 'Failed to adjust stock');
        }
    };

    const totalStock = stock.reduce((sum, s) => sum + s.quantity, 0);
    const totalProducts = new Set(stock.map((s) => s.productId)).size;

    if (loading) {
        return (
            <ProtectedRoute>
                <DashboardLayout>
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                    </div>
                </DashboardLayout>
            </ProtectedRoute>
        );
    }

    return (
        <ProtectedRoute>
            <DashboardLayout>
                <div className="space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Stock Management</h1>
                        <p className="text-gray-600 mt-2">Monitor and adjust inventory levels</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Total Stock</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-2">{totalStock}</p>
                                </div>
                                <div className="bg-blue-500 p-3 rounded-full">
                                    <Box className="h-6 w-6 text-white" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Products in Stock</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-2">{totalProducts}</p>
                                </div>
                                <div className="bg-green-500 p-3 rounded-full">
                                    <TrendingUp className="h-6 w-6 text-white" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Warehouses</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-2">{warehouses.length}</p>
                                </div>
                                <div className="bg-purple-500 p-3 rounded-full">
                                    <TrendingDown className="h-6 w-6 text-white" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="px-6 py-4 border-b">
                            <h2 className="text-lg font-semibold text-gray-900">Stock Levels</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Warehouse</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Updated</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {stock.map((item) => (
                                        <tr key={item.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {getProductName(item.productId)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {getWarehouseName(item.warehouseId)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {item.quantity}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {item.locationRack || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(item.lastUpdated).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <button
                                                    onClick={() => openAdjustModal(item)}
                                                    className="text-indigo-600 hover:text-indigo-900"
                                                >
                                                    Adjust Stock
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {showAdjustModal && selectedStock && (
                    <div className="fixed inset-0 z-50 overflow-y-auto">
                        <div className="flex items-center justify-center min-h-screen px-4">
                            <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={() => setShowAdjustModal(false)}></div>
                            <div className="relative bg-white rounded-lg max-w-md w-full p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Adjust Stock</h3>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Product: {getProductName(selectedStock.productId)}</p>
                                        <p className="text-sm text-gray-600">Warehouse: {getWarehouseName(selectedStock.warehouseId)}</p>
                                        <p className="text-sm font-medium text-gray-900 mt-2">
                                            Current Quantity: {selectedStock.quantity}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Adjustment (+ to add, - to remove)
                                        </label>
                                        <input
                                            type="number"
                                            value={adjustment}
                                            onChange={(e) => setAdjustment(Number(e.target.value))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                            placeholder="e.g., 10 or -5"
                                        />
                                        <p className="text-sm text-gray-500 mt-1">
                                            New quantity: {selectedStock.quantity + adjustment}
                                        </p>
                                    </div>
                                    <div className="flex justify-end space-x-3 pt-4">
                                        <button
                                            onClick={() => setShowAdjustModal(false)}
                                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleAdjustment}
                                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                                            disabled={adjustment === 0}
                                        >
                                            Adjust
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </DashboardLayout>
        </ProtectedRoute>
    );
}
