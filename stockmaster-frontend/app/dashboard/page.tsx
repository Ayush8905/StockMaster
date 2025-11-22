'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/DashboardLayout';
import { dashboardAPI } from '@/lib/api';
import { DashboardData } from '@/types';
import {
    Package,
    Warehouse,
    Box,
    AlertTriangle,
    TrendingUp,
    TrendingDown,
} from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'];

export default function DashboardPage() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        try {
            const response = await dashboardAPI.getData();
            setData(response);
        } catch (error) {
            console.error('Failed to load dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <ProtectedRoute>
                <DashboardLayout>
                    <div className="flex flex-col items-center justify-center h-64">
                        <div className="relative">
                            <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600"></div>
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                <Package className="h-6 w-6 text-indigo-600 animate-pulse" />
                            </div>
                        </div>
                        <p className="mt-4 text-gray-600 font-medium animate-pulse">Loading dashboard...</p>
                    </div>
                </DashboardLayout>
            </ProtectedRoute>
        );
    }

    if (!data) {
        return (
            <ProtectedRoute>
                <DashboardLayout>
                    <div className="flex flex-col items-center justify-center h-64 animate-fadeIn">
                        <AlertTriangle className="h-16 w-16 text-red-500 mb-4" />
                        <div className="text-center text-gray-500 font-medium">Failed to load dashboard data</div>
                        <button
                            onClick={loadDashboard}
                            className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all transform hover:scale-105"
                        >
                            Retry
                        </button>
                    </div>
                </DashboardLayout>
            </ProtectedRoute>
        );
    }

    const kpiCards = [
        {
            title: 'Total Products',
            value: data.kpis.totalProducts,
            subtitle: `${data.kpis.activeProducts} active`,
            icon: Package,
            color: 'bg-blue-500',
        },
        {
            title: 'Total Stock',
            value: data.kpis.totalStock,
            subtitle: 'units across all warehouses',
            icon: Box,
            color: 'bg-green-500',
        },
        {
            title: 'Warehouses',
            value: data.kpis.totalWarehouses,
            subtitle: `${data.kpis.activeWarehouses} active`,
            icon: Warehouse,
            color: 'bg-purple-500',
        },
        {
            title: 'Low Stock Items',
            value: data.kpis.lowStockCount,
            subtitle: 'need attention',
            icon: AlertTriangle,
            color: 'bg-red-500',
        },
    ];

    return (
        <ProtectedRoute>
            <DashboardLayout>
                <div className="space-y-6">
                    {/* Header */}
                    <div className="animate-fadeIn">
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Dashboard</h1>
                        <p className="text-gray-600 mt-2 font-medium">Overview of your inventory management system</p>
                    </div>

                    {/* KPI Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {kpiCards.map((card, index) => (
                            <div
                                key={card.title}
                                className={`bg-white rounded-2xl shadow-soft p-6 hover-lift cursor-pointer animate-scaleIn animate-delay-${index * 100}`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">{card.title}</p>
                                        <p className="text-4xl font-bold text-gray-900 mt-3 mb-2">{card.value.toLocaleString()}</p>
                                        <p className="text-sm text-gray-500 font-medium flex items-center">
                                            {card.value > 0 ? (
                                                <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
                                            ) : (
                                                <TrendingDown className="h-4 w-4 mr-1 text-gray-400" />
                                            )}
                                            {card.subtitle}
                                        </p>
                                    </div>
                                    <div className={`${card.color} p-4 rounded-2xl shadow-lg transform transition-transform hover:scale-110 hover:rotate-6`}>
                                        <card.icon className="h-8 w-8 text-white" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Category Breakdown */}
                        <div className="bg-white rounded-2xl shadow-medium p-6 hover-lift animate-slideInLeft">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-900">Category Breakdown</h2>
                                <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-2 rounded-lg">
                                    <Package className="h-5 w-5 text-white" />
                                </div>
                            </div>
                            {data.categoryBreakdown.length > 0 ? (
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={data.categoryBreakdown as any}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={(props: any) => {
                                                const entry = data.categoryBreakdown[props.index];
                                                return `${entry.category}: ${((props.percent || 0) * 100).toFixed(0)}%`;
                                            }}
                                            outerRadius={90}
                                            fill="#8884d8"
                                            dataKey="totalStock"
                                            animationBegin={0}
                                            animationDuration={800}
                                        >
                                            {data.categoryBreakdown.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: 'white',
                                                border: '2px solid #e5e7eb',
                                                borderRadius: '12px',
                                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                            }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                                    <Package className="h-16 w-16 mb-3 opacity-50" />
                                    <p className="font-medium">No category data available</p>
                                </div>
                            )}
                        </div>

                        {/* Warehouse Statistics */}
                        <div className="bg-white rounded-2xl shadow-medium p-6 hover-lift animate-slideInRight">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-900">Warehouse Statistics</h2>
                                <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg">
                                    <Warehouse className="h-5 w-5 text-white" />
                                </div>
                            </div>
                            {data.warehouseStats.length > 0 ? (
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={data.warehouseStats}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                        <XAxis
                                            dataKey="warehouseName"
                                            tick={{ fill: '#6b7280', fontSize: 12 }}
                                        />
                                        <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: 'white',
                                                border: '2px solid #e5e7eb',
                                                borderRadius: '12px',
                                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                            }}
                                        />
                                        <Legend />
                                        <Bar
                                            dataKey="totalStock"
                                            fill="#6366f1"
                                            name="Total Stock"
                                            radius={[8, 8, 0, 0]}
                                            animationBegin={0}
                                            animationDuration={800}
                                        />
                                        <Bar
                                            dataKey="productCount"
                                            fill="#8b5cf6"
                                            name="Products"
                                            radius={[8, 8, 0, 0]}
                                            animationBegin={200}
                                            animationDuration={800}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                                    <Warehouse className="h-16 w-16 mb-3 opacity-50" />
                                    <p className="font-medium">No warehouse data available</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Low Stock Items */}
                    <div className="bg-white rounded-2xl shadow-medium overflow-hidden animate-fadeIn animate-delay-300">
                        <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-red-50 to-orange-50">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <AlertTriangle className="h-6 w-6 text-red-500 mr-3" />
                                    <h2 className="text-xl font-bold text-gray-900">Low Stock Alerts</h2>
                                </div>
                                <span className="px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-bold">
                                    {data.lowStockItems.length} Items
                                </span>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Product</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">SKU</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Category</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Current Stock</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Reorder Level</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {data.lowStockItems.length > 0 ? (
                                        data.lowStockItems.map((item, index) => (
                                            <tr
                                                key={item.productId}
                                                className="hover:bg-red-50 transition-colors duration-200 animate-fadeIn"
                                                style={{ animationDelay: `${index * 50}ms` }}
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                                                    {item.productName}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-mono">{item.sku}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                    <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold">
                                                        {item.category}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-red-600">{item.currentStock}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-semibold">{item.reorderLevel}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="px-3 py-1 text-xs font-bold text-red-700 bg-red-100 rounded-full flex items-center w-fit animate-pulse">
                                                        <AlertTriangle className="h-3 w-3 mr-1" />
                                                        Low Stock
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-12 text-center">
                                                <div className="flex flex-col items-center text-gray-400">
                                                    <Box className="h-16 w-16 mb-3 opacity-50" />
                                                    <p className="text-sm font-medium">No low stock items - All good! 🎉</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        </ProtectedRoute>
    );
}
