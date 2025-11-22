'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { ledgerAPI, productsAPI, warehousesAPI } from '@/lib/api';
import { StockLedger, Product, Warehouse } from '@/types';
import { FileText, Download, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';

export default function LedgerPage() {
    const [ledger, setLedger] = useState<StockLedger[]>([]);
    const [filteredLedger, setFilteredLedger] = useState<StockLedger[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        productId: '',
        warehouseId: '',
        changeType: '',
        startDate: '',
        endDate: '',
    });

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [ledger, filters]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [ledgerData, productsData, warehousesData] = await Promise.all([
                ledgerAPI.getAll(),
                productsAPI.getAll(),
                warehousesAPI.getAll(),
            ]);
            setLedger(ledgerData);
            setProducts(productsData);
            setWarehouses(warehousesData);
        } catch (error) {
            console.error('Failed to load data:', error);
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let filtered = [...ledger];

        if (filters.productId) {
            filtered = filtered.filter((entry) => entry.productId === filters.productId);
        }

        if (filters.warehouseId) {
            filtered = filtered.filter((entry) => entry.warehouseId === filters.warehouseId);
        }

        if (filters.changeType) {
            filtered = filtered.filter((entry) => entry.changeType === filters.changeType);
        }

        if (filters.startDate) {
            filtered = filtered.filter(
                (entry) => new Date(entry.createdAt) >= new Date(filters.startDate)
            );
        }

        if (filters.endDate) {
            filtered = filtered.filter(
                (entry) => new Date(entry.createdAt) <= new Date(filters.endDate)
            );
        }

        setFilteredLedger(filtered);
    };

    const exportToCSV = () => {
        const headers = ['Date', 'Product', 'SKU', 'Warehouse', 'Change Type', 'Before', 'Change', 'After', 'User', 'Notes'];
        const rows = filteredLedger.map(entry => [
            new Date(entry.createdAt).toLocaleString(),
            entry.productName,
            entry.productSku,
            entry.warehouseName,
            entry.changeType,
            entry.quantityBefore,
            entry.quantityChange,
            entry.quantityAfter,
            entry.userName,
            entry.notes || ''
        ]);

        const csvContent = [headers, ...rows]
            .map(row => row.map(cell => `"${cell}"`).join(','))
            .join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `stock-ledger-${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
    };

    const getChangeTypeIcon = (changeType: string) => {
        const icons = {
            RECEIPT: <TrendingUp className="text-green-600" size={18} />,
            DELIVERY: <TrendingDown className="text-red-600" size={18} />,
            ADJUSTMENT: <RefreshCw className="text-blue-600" size={18} />,
            TRANSFER_IN: <TrendingUp className="text-purple-600" size={18} />,
            TRANSFER_OUT: <TrendingDown className="text-orange-600" size={18} />,
        };
        return icons[changeType as keyof typeof icons] || null;
    };

    const getChangeTypeColor = (changeType: string) => {
        const colors = {
            RECEIPT: 'bg-green-100 text-green-800',
            DELIVERY: 'bg-red-100 text-red-800',
            ADJUSTMENT: 'bg-blue-100 text-blue-800',
            TRANSFER_IN: 'bg-purple-100 text-purple-800',
            TRANSFER_OUT: 'bg-orange-100 text-orange-800',
        };
        return colors[changeType as keyof typeof colors] || 'bg-gray-100 text-gray-800';
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex justify-center items-center h-screen">
                    <div className="text-gray-600">Loading stock ledger...</div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-900">Stock Ledger</h1>
                    <button
                        onClick={exportToCSV}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                    >
                        <Download size={20} />
                        Export CSV
                    </button>
                </div>

                <div className="bg-white rounded-lg shadow p-4">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
                            <select
                                value={filters.productId}
                                onChange={(e) => setFilters({ ...filters, productId: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            >
                                <option value="">All Products</option>
                                {products.map((product) => (
                                    <option key={product.id} value={product.id}>
                                        {product.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Warehouse</label>
                            <select
                                value={filters.warehouseId}
                                onChange={(e) => setFilters({ ...filters, warehouseId: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            >
                                <option value="">All Warehouses</option>
                                {warehouses.map((warehouse) => (
                                    <option key={warehouse.id} value={warehouse.id}>
                                        {warehouse.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Change Type</label>
                            <select
                                value={filters.changeType}
                                onChange={(e) => setFilters({ ...filters, changeType: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            >
                                <option value="">All Types</option>
                                <option value="RECEIPT">Receipt</option>
                                <option value="DELIVERY">Delivery</option>
                                <option value="ADJUSTMENT">Adjustment</option>
                                <option value="TRANSFER_IN">Transfer In</option>
                                <option value="TRANSFER_OUT">Transfer Out</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                            <input
                                type="date"
                                value={filters.startDate}
                                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                            <input
                                type="date"
                                value={filters.endDate}
                                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date/Time</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Warehouse</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Before</th>
                                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Change</th>
                                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">After</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredLedger.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                                            No ledger entries found.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredLedger.map((entry) => (
                                        <tr key={entry.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-sm text-gray-900">
                                                {new Date(entry.createdAt).toLocaleString()}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="text-sm font-medium text-gray-900">{entry.productName}</div>
                                                <div className="text-xs text-gray-500">{entry.productSku}</div>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-900">{entry.warehouseName}</td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    {getChangeTypeIcon(entry.changeType)}
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getChangeTypeColor(entry.changeType)}`}>
                                                        {entry.changeType.replace('_', ' ')}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-center text-sm text-gray-900">{entry.quantityBefore}</td>
                                            <td className="px-4 py-3 text-center">
                                                <span className={`text-sm font-medium ${entry.quantityChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                    {entry.quantityChange > 0 ? '+' : ''}{entry.quantityChange}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-center text-sm font-medium text-gray-900">{entry.quantityAfter}</td>
                                            <td className="px-4 py-3 text-sm text-gray-900">{entry.userName}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <FileText className="text-blue-600 mt-0.5" size={20} />
                        <div>
                            <h3 className="text-sm font-medium text-blue-900">About Stock Ledger</h3>
                            <p className="text-sm text-blue-700 mt-1">
                                The stock ledger provides a complete audit trail of all stock movements. Every receipt, delivery,
                                adjustment, and transfer is automatically logged with timestamps and user information for compliance
                                and tracking purposes.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
