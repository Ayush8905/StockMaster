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
        if (!selectedStock || adjustment === 0) {
            alert('Please enter a valid adjustment value');
            return;
        }

        // Validate that new quantity won't be negative
        const newQuantity = selectedStock.quantity + adjustment;
        if (newQuantity < 0) {
            alert(`Cannot remove ${Math.abs(adjustment)} units. Only ${selectedStock.quantity} units available.`);
            return;
        }

        try {
            console.log('Adjusting stock:', {
                productId: selectedStock.productId,
                warehouseId: selectedStock.warehouseId,
                adjustment: adjustment
            });

            await stockAPI.adjust(selectedStock.productId, selectedStock.warehouseId, adjustment);
            await loadData();
            setShowAdjustModal(false);
            setSelectedStock(null);
            setAdjustment(0);

            // Show success message
            alert(`Stock adjusted successfully! New quantity: ${newQuantity}`);
        } catch (error: any) {
            console.error('Stock adjustment error:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to adjust stock';
            alert(`Error: ${errorMessage}`);
        }
    };

    const totalStock = stock.reduce((sum, s) => sum + s.quantity, 0);
    const totalProducts = new Set(stock.map((s) => s.productId)).size;

    if (loading) {
        return (
            <ProtectedRoute>
                <DashboardLayout>
                    <div className="flex flex-col items-center justify-center h-64">
                        <div className="relative">
                            <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600"></div>
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                <Box className="h-6 w-6 text-indigo-600 animate-pulse" />
                            </div>
                        </div>
                        <p className="mt-4 text-gray-600 font-medium animate-pulse">Loading stock data...</p>
                    </div>
                </DashboardLayout>
            </ProtectedRoute>
        );
    }

    return (
        <ProtectedRoute>
            <DashboardLayout>
                <div className="space-y-6">
                    <div className="animate-fadeIn">
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Stock Management</h1>
                        <p className="text-gray-600 mt-2 font-medium">Monitor and adjust inventory levels</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white rounded-2xl shadow-soft p-6 hover-lift cursor-pointer animate-scaleIn">
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Stock</p>
                                    <p className="text-4xl font-bold text-gray-900 mt-3">{totalStock.toLocaleString()}</p>
                                    <p className="text-sm text-gray-500 font-medium mt-1">units across all locations</p>
                                </div>
                                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-2xl shadow-lg transform transition-transform hover:scale-110 hover:rotate-6">
                                    <Box className="h-8 w-8 text-white" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-soft p-6 hover-lift cursor-pointer animate-scaleIn animate-delay-100">
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Products in Stock</p>
                                    <p className="text-4xl font-bold text-gray-900 mt-3">{totalProducts}</p>
                                    <p className="text-sm text-gray-500 font-medium mt-1">unique products</p>
                                </div>
                                <div className="bg-gradient-to-br from-green-500 to-green-600 p-4 rounded-2xl shadow-lg transform transition-transform hover:scale-110 hover:rotate-6">
                                    <TrendingUp className="h-8 w-8 text-white" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-soft p-6 hover-lift cursor-pointer animate-scaleIn animate-delay-200">
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Warehouses</p>
                                    <p className="text-4xl font-bold text-gray-900 mt-3">{warehouses.length}</p>
                                    <p className="text-sm text-gray-500 font-medium mt-1">active locations</p>
                                </div>
                                <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-4 rounded-2xl shadow-lg transform transition-transform hover:scale-110 hover:rotate-6">
                                    <Box className="h-8 w-8 text-white" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-medium overflow-hidden animate-fadeIn animate-delay-300">
                        <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <Box className="h-6 w-6 text-indigo-600 mr-3" />
                                    <h2 className="text-xl font-bold text-gray-900">Stock Levels</h2>
                                </div>
                                <span className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-bold">
                                    {stock.length} Items
                                </span>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Product</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Warehouse</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Quantity</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Location</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Last Updated</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {stock.length > 0 ? (
                                        stock.map((item, index) => (
                                            <tr
                                                key={item.id}
                                                className="hover:bg-indigo-50 transition-all duration-200 animate-fadeIn"
                                                style={{ animationDelay: `${index * 50}ms` }}
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                                                    {getProductName(item.productId)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                                                        {getWarehouseName(item.warehouseId)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold">
                                                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-base">
                                                        {item.quantity}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                                                    {item.locationRack || 'N/A'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">
                                                    {new Date(item.lastUpdated).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    })}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    <button
                                                        onClick={() => openAdjustModal(item)}
                                                        className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 shadow-md hover:shadow-lg transition-all transform hover:scale-105"
                                                    >
                                                        ⚙️ Adjust Stock
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-12 text-center">
                                                <div className="flex flex-col items-center text-gray-400">
                                                    <Box className="h-16 w-16 mb-3 opacity-50" />
                                                    <p className="text-sm font-medium">No stock items found</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {showAdjustModal && selectedStock && (
                    <div className="fixed inset-0 z-50 overflow-y-auto animate-fadeIn">
                        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20">
                            <div className="fixed inset-0 bg-gray-900/75 backdrop-blur-sm transition-opacity" onClick={() => setShowAdjustModal(false)}></div>
                            <div className="relative bg-white rounded-2xl max-w-lg w-full p-8 shadow-strong animate-bounceIn">
                                <div className="flex items-center justify-center mb-6">
                                    <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-4 rounded-2xl shadow-lg animate-pulseGlow">
                                        <Box className="h-10 w-10 text-white" />
                                    </div>
                                </div>

                                <h3 className="text-2xl font-bold text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
                                    ⚙️ Adjust Stock Level
                                </h3>

                                <div className="space-y-5">
                                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-5 space-y-3 animate-slideInLeft">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-semibold text-gray-600">Product:</span>
                                            <span className="text-sm font-bold text-gray-900">{getProductName(selectedStock.productId)}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-semibold text-gray-600">Warehouse:</span>
                                            <span className="text-sm font-bold text-gray-900">{getWarehouseName(selectedStock.warehouseId)}</span>
                                        </div>
                                        <div className="flex items-center justify-between pt-3 border-t border-indigo-200">
                                            <span className="text-base font-bold text-gray-700">Current Quantity:</span>
                                            <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-lg font-bold">
                                                {selectedStock.quantity}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="animate-slideInRight">
                                        <label className="block text-sm font-bold text-gray-700 mb-3">
                                            📊 Adjustment Amount
                                            <span className="text-gray-500 font-normal text-xs ml-2">(+ to add, - to remove)</span>
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                value={adjustment}
                                                onChange={(e) => setAdjustment(Number(e.target.value))}
                                                className="w-full px-4 py-4 text-center border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-gray-900 font-bold text-2xl placeholder-gray-400"
                                                placeholder="0"
                                                style={{ color: '#1f2937', WebkitTextFillColor: '#1f2937' }}
                                                autoFocus
                                            />
                                            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex space-x-2">
                                                <button
                                                    type="button"
                                                    onClick={() => setAdjustment(Math.max(-selectedStock.quantity, adjustment - 1))}
                                                    className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all transform hover:scale-110 font-bold"
                                                >
                                                    −
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setAdjustment(adjustment + 1)}
                                                    className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-all transform hover:scale-110 font-bold"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 animate-fadeIn animate-delay-200">
                                        <div className="flex items-center justify-between">
                                            <span className="text-base font-bold text-gray-700">New Quantity:</span>
                                            <div className="flex items-center">
                                                <span className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full text-xl font-bold shadow-lg">
                                                    {selectedStock.quantity + adjustment}
                                                </span>
                                                {adjustment !== 0 && (
                                                    <span className={`ml-3 px-3 py-1 rounded-full text-xs font-bold ${adjustment > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                        {adjustment > 0 ? '+' : ''}{adjustment}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 animate-fadeIn animate-delay-300">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowAdjustModal(false);
                                                setAdjustment(0);
                                            }}
                                            className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all transform hover:scale-105"
                                        >
                                            ❌ Cancel
                                        </button>
                                        <button
                                            onClick={handleAdjustment}
                                            disabled={adjustment === 0 || (selectedStock.quantity + adjustment) < 0}
                                            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed btn-ripple"
                                        >
                                            ✅ Confirm Adjustment
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
