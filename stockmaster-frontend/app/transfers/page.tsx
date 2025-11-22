'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { transfersAPI, productsAPI, warehousesAPI, stockAPI } from '@/lib/api';
import { InternalTransfer, Product, Warehouse, StockWithDetails } from '@/types';
import { Plus, Check, X, Trash2, Package, ArrowRight } from 'lucide-react';

export default function TransfersPage() {
    const [transfers, setTransfers] = useState<InternalTransfer[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        productId: '',
        fromWarehouseId: '',
        toWarehouseId: '',
        quantity: 1,
        notes: '',
    });
    const [availableStock, setAvailableStock] = useState<number | null>(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (formData.productId && formData.fromWarehouseId) {
            checkStock();
        }
    }, [formData.productId, formData.fromWarehouseId]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [transfersData, productsData, warehousesData] = await Promise.all([
                transfersAPI.getAll(),
                productsAPI.getAll(),
                warehousesAPI.getAll(),
            ]);
            setTransfers(transfersData);
            setProducts(productsData.filter((p: Product) => p.active));
            setWarehouses(warehousesData.filter((w: Warehouse) => w.active));
        } catch (error) {
            setError('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    const checkStock = async () => {
        try {
            const stock: StockWithDetails = await stockAPI.getByProductAndWarehouse(
                formData.productId,
                formData.fromWarehouseId
            );
            setAvailableStock(stock.quantity);
        } catch (error) {
            setAvailableStock(0);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (formData.fromWarehouseId === formData.toWarehouseId) {
            setError('Source and destination warehouses must be different');
            return;
        }

        if (availableStock !== null && formData.quantity > availableStock) {
            setError(`Insufficient stock. Available: ${availableStock}`);
            return;
        }

        try {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            await transfersAPI.create({
                ...formData,
                createdBy: user.email || 'system',
            });
            setSuccess('Transfer created successfully');
            setShowModal(false);
            setFormData({
                productId: '',
                fromWarehouseId: '',
                toWarehouseId: '',
                quantity: 1,
                notes: '',
            });
            setAvailableStock(null);
            fetchData();
        } catch (error: any) {
            setError(error.response?.data?.message || 'Failed to create transfer');
        }
    };

    const handleComplete = async (id: string) => {
        if (!confirm('Complete this transfer? Stock will be moved between warehouses.')) return;

        try {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            await transfersAPI.complete(id, user.email || 'system');
            setSuccess('Transfer completed successfully');
            fetchData();
        } catch (error: any) {
            setError(error.response?.data?.message || 'Failed to complete transfer');
        }
    };

    const handleCancel = async (id: string) => {
        if (!confirm('Cancel this transfer?')) return;

        try {
            await transfersAPI.cancel(id);
            setSuccess('Transfer cancelled');
            fetchData();
        } catch (error: any) {
            setError(error.response?.data?.message || 'Failed to cancel transfer');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this transfer?')) return;

        try {
            await transfersAPI.delete(id);
            setSuccess('Transfer deleted successfully');
            fetchData();
        } catch (error: any) {
            setError(error.response?.data?.message || 'Failed to delete transfer');
        }
    };

    const getStatusBadge = (status: string) => {
        const styles = {
            DRAFT: 'bg-yellow-100 text-yellow-800',
            COMPLETED: 'bg-green-100 text-green-800',
            CANCELLED: 'bg-red-100 text-red-800',
        };
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
                {status}
            </span>
        );
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex justify-center items-center h-screen">
                    <div className="text-gray-600">Loading transfers...</div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-900">Internal Transfers</h1>
                    <button
                        onClick={() => setShowModal(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                    >
                        <Plus size={20} />
                        New Transfer
                    </button>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                        {success}
                    </div>
                )}

                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">From</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">To</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {transfers.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                                        No transfers found. Create your first transfer.
                                    </td>
                                </tr>
                            ) : (
                                transfers.map((transfer) => (
                                    <tr key={transfer.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">{transfer.productName}</div>
                                                <div className="text-sm text-gray-500">{transfer.productSku}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">{transfer.fromWarehouseName}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <ArrowRight size={16} className="text-gray-400" />
                                                <span className="text-sm text-gray-900">{transfer.toWarehouseName}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">{transfer.quantity}</td>
                                        <td className="px-6 py-4">{getStatusBadge(transfer.status)}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(transfer.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                {transfer.status === 'DRAFT' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleComplete(transfer.id)}
                                                            className="text-green-600 hover:text-green-800"
                                                            title="Complete Transfer"
                                                        >
                                                            <Check size={20} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleCancel(transfer.id)}
                                                            className="text-red-600 hover:text-red-800"
                                                            title="Cancel Transfer"
                                                        >
                                                            <X size={20} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(transfer.id)}
                                                            className="text-gray-600 hover:text-gray-800"
                                                            title="Delete Transfer"
                                                        >
                                                            <Trash2 size={20} />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Create New Transfer</h2>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Product *
                                </label>
                                <select
                                    value={formData.productId}
                                    onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    required
                                >
                                    <option value="">Select Product</option>
                                    {products.map((product) => (
                                        <option key={product.id} value={product.id}>
                                            {product.name} ({product.sku})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    From Warehouse *
                                </label>
                                <select
                                    value={formData.fromWarehouseId}
                                    onChange={(e) => setFormData({ ...formData, fromWarehouseId: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    required
                                >
                                    <option value="">Select Warehouse</option>
                                    {warehouses.map((warehouse) => (
                                        <option key={warehouse.id} value={warehouse.id}>
                                            {warehouse.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {availableStock !== null && (
                                <div className="text-sm text-gray-600">
                                    Available Stock: <span className="font-medium">{availableStock}</span>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    To Warehouse *
                                </label>
                                <select
                                    value={formData.toWarehouseId}
                                    onChange={(e) => setFormData({ ...formData, toWarehouseId: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    required
                                >
                                    <option value="">Select Warehouse</option>
                                    {warehouses.filter(w => w.id !== formData.fromWarehouseId).map((warehouse) => (
                                        <option key={warehouse.id} value={warehouse.id}>
                                            {warehouse.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Quantity *
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    value={formData.quantity}
                                    onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Notes
                                </label>
                                <textarea
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    rows={3}
                                />
                            </div>

                            <div className="flex gap-2 justify-end">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowModal(false);
                                        setFormData({
                                            productId: '',
                                            fromWarehouseId: '',
                                            toWarehouseId: '',
                                            quantity: 1,
                                            notes: '',
                                        });
                                        setAvailableStock(null);
                                    }}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Create Transfer
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
