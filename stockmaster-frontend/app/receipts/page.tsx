'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/DashboardLayout';
import { receiptsAPI, productsAPI, warehousesAPI } from '@/lib/api';
import { Receipt, Product, Warehouse } from '@/types';
import { useForm, useFieldArray } from 'react-hook-form';
import { Plus, Check, Trash2, X } from 'lucide-react';

export default function ReceiptsPage() {
    const [receipts, setReceipts] = useState<Receipt[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    const { register, control, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
            supplier: '',
            warehouseId: '',
            notes: '',
            items: [{ productId: '', quantity: 0, unitPrice: 0 }],
        },
    });

    const { fields, append, remove } = useFieldArray({ control, name: 'items' });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [receiptsData, productsData, warehousesData] = await Promise.all([
                receiptsAPI.getAll(),
                productsAPI.getActive(),
                warehousesAPI.getActive(),
            ]);
            setReceipts(receiptsData);
            setProducts(productsData);
            setWarehouses(warehousesData);
        } catch (error) {
            console.error('Failed to load data:', error);
        } finally {
            setLoading(false);
        }
    };

    const openModal = () => {
        reset({
            supplier: '',
            warehouseId: '',
            notes: '',
            items: [{ productId: '', quantity: 0, unitPrice: 0 }],
        });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        reset();
    };

    const onSubmit = async (data: any) => {
        try {
            await receiptsAPI.create(data);
            await loadData();
            closeModal();
        } catch (error: any) {
            alert(error.response?.data?.message || 'Failed to create receipt');
        }
    };

    const handleValidate = async (id: string) => {
        if (confirm('Validate this receipt? Stock will be increased.')) {
            try {
                await receiptsAPI.validate(id);
                await loadData();
            } catch (error: any) {
                alert(error.response?.data?.message || 'Failed to validate receipt');
            }
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Delete this draft receipt?')) {
            try {
                await receiptsAPI.delete(id);
                await loadData();
            } catch (error) {
                alert('Failed to delete receipt');
            }
        }
    };

    const getProductName = (id: string) => products.find((p) => p.id === id)?.name || 'Unknown';
    const getWarehouseName = (id: string) => warehouses.find((w) => w.id === id)?.name || 'Unknown';

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
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Receipts (Incoming Stock)</h1>
                            <p className="text-gray-600 mt-2">Manage incoming inventory</p>
                        </div>
                        <button
                            onClick={openModal}
                            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                        >
                            <Plus className="h-5 w-5 mr-2" />
                            New Receipt
                        </button>
                    </div>

                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Receipt #</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Supplier</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Warehouse</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Items</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {receipts.map((receipt) => (
                                        <tr key={receipt.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {receipt.receiptNumber}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{receipt.supplier}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {getWarehouseName(receipt.warehouseId)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {receipt.items.length} items
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span
                                                    className={`px-2 py-1 text-xs font-medium rounded-full ${receipt.status === 'VALIDATED'
                                                            ? 'bg-green-100 text-green-700'
                                                            : 'bg-yellow-100 text-yellow-700'
                                                        }`}
                                                >
                                                    {receipt.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(receipt.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <div className="flex space-x-2">
                                                    {receipt.status === 'DRAFT' && (
                                                        <>
                                                            <button
                                                                onClick={() => handleValidate(receipt.id)}
                                                                className="text-green-600 hover:text-green-900"
                                                                title="Validate"
                                                            >
                                                                <Check className="h-4 w-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(receipt.id)}
                                                                className="text-red-600 hover:text-red-900"
                                                                title="Delete"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {showModal && (
                    <div className="fixed inset-0 z-50 overflow-y-auto">
                        <div className="flex items-center justify-center min-h-screen px-4">
                            <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={closeModal}></div>
                            <div className="relative bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-semibold text-gray-900">Create Receipt</h3>
                                    <button onClick={closeModal}>
                                        <X className="h-6 w-6 text-gray-500" />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
                                        <input
                                            {...register('supplier', { required: 'Supplier is required' })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        />
                                        {errors.supplier && <p className="text-red-600 text-sm mt-1">{errors.supplier.message}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Warehouse</label>
                                        <select
                                            {...register('warehouseId', { required: 'Warehouse is required' })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        >
                                            <option value="">Select Warehouse</option>
                                            {warehouses.map((w) => (
                                                <option key={w.id} value={w.id}>{w.name}</option>
                                            ))}
                                        </select>
                                        {errors.warehouseId && <p className="text-red-600 text-sm mt-1">{errors.warehouseId.message}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                                        <textarea
                                            {...register('notes')}
                                            rows={2}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>

                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <label className="block text-sm font-medium text-gray-700">Items</label>
                                            <button
                                                type="button"
                                                onClick={() => append({ productId: '', quantity: 0, unitPrice: 0 })}
                                                className="text-sm text-indigo-600 hover:text-indigo-700"
                                            >
                                                + Add Item
                                            </button>
                                        </div>
                                        {fields.map((field, index) => (
                                            <div key={field.id} className="grid grid-cols-12 gap-2 mb-2">
                                                <select
                                                    {...register(`items.${index}.productId` as const, { required: true })}
                                                    className="col-span-5 px-2 py-1 border border-gray-300 rounded text-sm"
                                                >
                                                    <option value="">Select Product</option>
                                                    {products.map((p) => (
                                                        <option key={p.id} value={p.id}>{p.name}</option>
                                                    ))}
                                                </select>
                                                <input
                                                    type="number"
                                                    {...register(`items.${index}.quantity` as const, { required: true, min: 1 })}
                                                    placeholder="Qty"
                                                    className="col-span-3 px-2 py-1 border border-gray-300 rounded text-sm"
                                                />
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    {...register(`items.${index}.unitPrice` as const, { required: true, min: 0 })}
                                                    placeholder="Price"
                                                    className="col-span-3 px-2 py-1 border border-gray-300 rounded text-sm"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => remove(index)}
                                                    className="col-span-1 text-red-600 hover:text-red-900"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex justify-end space-x-3 pt-4">
                                        <button
                                            type="button"
                                            onClick={closeModal}
                                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                                        >
                                            Create Draft
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </DashboardLayout>
        </ProtectedRoute>
    );
}
