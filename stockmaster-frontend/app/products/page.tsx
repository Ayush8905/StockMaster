'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/DashboardLayout';
import { productsAPI } from '@/lib/api';
import { Product } from '@/types';
import { useForm } from 'react-hook-form';
import { Plus, Search, Edit2, Trash2, X } from 'lucide-react';

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');

    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    useEffect(() => {
        loadProducts();
    }, []);

    useEffect(() => {
        filterProducts();
    }, [products, searchQuery, categoryFilter]);

    const loadProducts = async () => {
        try {
            const data = await productsAPI.getAll();
            setProducts(data);
        } catch (error) {
            console.error('Failed to load products:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterProducts = () => {
        let filtered = [...products];

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(
                (p) =>
                    p.name.toLowerCase().includes(query) ||
                    p.sku.toLowerCase().includes(query) ||
                    p.category.toLowerCase().includes(query)
            );
        }

        if (categoryFilter) {
            filtered = filtered.filter((p) => p.category === categoryFilter);
        }

        setFilteredProducts(filtered);
    };

    const categories = Array.from(new Set(products.map((p) => p.category)));

    const openModal = (product?: Product) => {
        if (product) {
            setEditingProduct(product);
            reset(product);
        } else {
            setEditingProduct(null);
            reset({
                name: '',
                sku: '',
                category: '',
                unit: '',
                reorderLevel: 0,
                initialStock: 0,
                active: true,
            });
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingProduct(null);
        reset();
    };

    const onSubmit = async (data: any) => {
        try {
            if (editingProduct) {
                await productsAPI.update(editingProduct.id, data);
            } else {
                await productsAPI.create(data);
            }
            await loadProducts();
            closeModal();
        } catch (error: any) {
            alert(error.response?.data?.message || 'Failed to save product');
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this product?')) {
            try {
                await productsAPI.delete(id);
                await loadProducts();
            } catch (error) {
                alert('Failed to delete product');
            }
        }
    };

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
                    {/* Header */}
                    <div className="flex justify-between items-center flex-wrap gap-4 animate-fadeIn">
                        <div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Products</h1>
                            <p className="text-gray-600 mt-2 font-medium">Manage your product catalog</p>
                        </div>
                        <button
                            onClick={() => openModal()}
                            className="flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 btn-ripple animate-slideInRight"
                        >
                            <Plus className="h-5 w-5 mr-2" />
                            Add Product
                        </button>
                    </div>

                    {/* Filters */}
                    <div className="bg-white rounded-2xl shadow-medium p-6 animate-slideInLeft">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="relative">
                                <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search by name, SKU, or category..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-gray-900 font-medium placeholder-gray-400"
                                    style={{ color: '#1f2937', WebkitTextFillColor: '#1f2937' }}
                                />
                            </div>
                            <select
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-gray-900 font-medium"
                                style={{ color: '#1f2937', WebkitTextFillColor: '#1f2937' }}
                            >
                                <option value="">All Categories</option>
                                {categories.map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Products Table */}
                    <div className="bg-white rounded-2xl shadow-medium overflow-hidden animate-fadeIn animate-delay-200">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Name</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">SKU</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Category</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Unit</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Reorder Level</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredProducts.length > 0 ? (
                                        filteredProducts.map((product, index) => (
                                            <tr
                                                key={product.id}
                                                className="hover:bg-indigo-50 transition-all duration-200 cursor-pointer animate-fadeIn"
                                                style={{ animationDelay: `${index * 50}ms` }}
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                                                    {product.name}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-mono">{product.sku}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                                                        {product.category}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-semibold">{product.unit}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-semibold">{product.reorderLevel}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span
                                                        className={`px-3 py-1 text-xs font-bold rounded-full inline-flex items-center ${product.active
                                                            ? 'bg-green-100 text-green-700'
                                                            : 'bg-red-100 text-red-700'
                                                            }`}
                                                    >
                                                        <span className={`h-2 w-2 rounded-full mr-1.5 ${product.active ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></span>
                                                        {product.active ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    <div className="flex space-x-3">
                                                        <button
                                                            onClick={() => openModal(product)}
                                                            className="p-2 text-indigo-600 hover:text-white hover:bg-indigo-600 rounded-lg transition-all transform hover:scale-110"
                                                            title="Edit"
                                                        >
                                                            <Edit2 className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(product.id)}
                                                            className="p-2 text-red-600 hover:text-white hover:bg-red-600 rounded-lg transition-all transform hover:scale-110"
                                                            title="Delete"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={7} className="px-6 py-12 text-center">
                                                <div className="flex flex-col items-center text-gray-400">
                                                    <Plus className="h-16 w-16 mb-3 opacity-50" />
                                                    <p className="text-sm font-medium">No products found</p>
                                                    <p className="text-xs mt-1">Try adjusting your search or add a new product</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Modal */}
                {showModal && (
                    <div className="fixed inset-0 z-50 overflow-y-auto">
                        <div className="flex items-center justify-center min-h-screen px-4">
                            <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={closeModal}></div>
                            <div className="relative bg-white rounded-lg max-w-md w-full p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        {editingProduct ? 'Edit Product' : 'Add Product'}
                                    </h3>
                                    <button onClick={closeModal}>
                                        <X className="h-6 w-6 text-gray-500" />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                        <input
                                            {...register('name', { required: 'Name is required' })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        />
                                        {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name.message as string}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                                        <input
                                            {...register('sku', { required: 'SKU is required' })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        />
                                        {errors.sku && <p className="text-red-600 text-sm mt-1">{errors.sku.message as string}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                        <input
                                            {...register('category', { required: 'Category is required' })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        />
                                        {errors.category && <p className="text-red-600 text-sm mt-1">{errors.category.message as string}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                                        <input
                                            {...register('unit', { required: 'Unit is required' })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                            placeholder="e.g., pcs, kg, liter"
                                        />
                                        {errors.unit && <p className="text-red-600 text-sm mt-1">{errors.unit.message as string}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Reorder Level</label>
                                        <input
                                            type="number"
                                            {...register('reorderLevel', { required: 'Reorder level is required', min: 0 })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        />
                                        {errors.reorderLevel && <p className="text-red-600 text-sm mt-1">{errors.reorderLevel.message as string}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Initial Stock</label>
                                        <input
                                            type="number"
                                            {...register('initialStock', { required: 'Initial stock is required', min: 0 })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        />
                                        {errors.initialStock && <p className="text-red-600 text-sm mt-1">{errors.initialStock.message as string}</p>}
                                    </div>

                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            {...register('active')}
                                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                        />
                                        <label className="ml-2 block text-sm text-gray-900">Active</label>
                                    </div>

                                    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 animate-fadeIn animate-delay-400">
                                        <button
                                            type="button"
                                            onClick={closeModal}
                                            className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all transform hover:scale-105"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 btn-ripple"
                                        >
                                            {editingProduct ? '💾 Update Product' : '✨ Create Product'}
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
