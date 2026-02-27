import React, { useState } from 'react';
import Table from '../components/ui/Table';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Modal from '../components/ui/Modal';
import { mockProducts } from '../data/mockData';

const Products = () => {
    const [products, setProducts] = useState(mockProducts);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);

    // Form Stats
    const [formData, setFormData] = useState({
        name: '', category: '', price: '', stock: '', status: 'Active', description: ''
    });

    const handleSearch = (e) => setSearchTerm(e.target.value.toLowerCase());
    const handleCategoryFilter = (e) => setCategoryFilter(e.target.value);

    // Filter Logic
    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm) || p.sku.toLowerCase().includes(searchTerm);
        const matchesCategory = categoryFilter ? p.category === categoryFilter : true;
        return matchesSearch && matchesCategory;
    });

    // Delete Logic
    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            setProducts(products.filter(p => p.id !== id));
        }
    };

    // Edit/Add Logic
    const openModal = (product = null) => {
        if (product) {
            setFormData({ ...product });
            setCurrentProduct(product);
        } else {
            setFormData({ name: '', category: '', price: '', stock: '', status: 'Active', description: '' });
            setCurrentProduct(null);
        }
        setIsModalOpen(true);
    };

    const handleSave = () => {
        if (currentProduct) {
            // Update
            setProducts(products.map(p => p.id === currentProduct.id ? { ...p, ...formData } : p));
        } else {
            // Add
            const newProduct = { ...formData, id: products.length + 1, sku: `NEW-${Date.now()}` };
            setProducts([...products, newProduct]);
        }
        setIsModalOpen(false);
    };

    const columns = [
        {
            header: 'Product',
            accessor: 'name',
            render: (row) => (
                <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                        <img className="h-10 w-10 rounded-lg object-cover bg-gray-100" src={row.image || "https://via.placeholder.com/40"} alt="" />
                    </div>
                    <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{row.name}</div>
                        <div className="text-sm text-gray-500">{row.sku}</div>
                    </div>
                </div>
            )
        },
        { header: 'Category', accessor: 'category' },
        {
            header: 'Price',
            accessor: 'price',
            render: (row) => <span className="text-gray-900 font-medium">${row.price}</span>
        },
        {
            header: 'Stock',
            accessor: 'stock',
            render: (row) => (
                <span className={`${row.stock < 10 ? 'text-red-600 font-bold' : 'text-gray-600'}`}>
                    {row.stock} units
                </span>
            )
        },
        {
            header: 'Status',
            accessor: 'status',
            render: (row) => <Badge variant={row.status}>{row.status}</Badge>
        }
    ];

    const actions = (row) => (
        <div className="flex justify-end gap-2">
            <Button variant="ghost" className="px-2 py-1 text-xs" onClick={(e) => { e.stopPropagation(); openModal(row); }}>Edit</Button>
            <Button variant="ghost" className="px-2 py-1 text-xs text-red-600 hover:text-red-800 hover:bg-red-50" onClick={(e) => { e.stopPropagation(); handleDelete(row.id); }}>Delete</Button>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-900">Products</h1>
                <Button onClick={() => openModal()}>+ Add Product</Button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-lg shadow-sm">
                <Input
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="max-w-xs"
                />
                <Select
                    className="max-w-xs"
                    value={categoryFilter}
                    onChange={handleCategoryFilter}
                    options={[
                        { value: '', label: 'All Categories' },
                        { value: 'Electronics', label: 'Electronics' },
                        { value: 'Furniture', label: 'Furniture' },
                        { value: 'Footwear', label: 'Footwear' },
                    ]}
                />
            </div>

            {/* Table */}
            <Table
                columns={columns}
                data={filteredProducts}
                actions={actions}
            />

            {/* Edit/Add Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={currentProduct ? "Edit Product" : "Add New Product"}
                footer={
                    <>
                        <Button onClick={handleSave}>Save Product</Button>
                        <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                    </>
                }
            >
                <div className="space-y-4">
                    <Input label="Product Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                    <div className="grid grid-cols-2 gap-4">
                        <Select
                            label="Category"
                            value={formData.category}
                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                            options={[
                                { value: 'Electronics', label: 'Electronics' },
                                { value: 'Furniture', label: 'Furniture' },
                                { value: 'Footwear', label: 'Footwear' },
                            ]}
                        />
                        <Select
                            label="Status"
                            value={formData.status}
                            onChange={e => setFormData({ ...formData, status: e.target.value })}
                            options={[
                                { value: 'Active', label: 'Active' },
                                { value: 'Inactive', label: 'Inactive' },
                            ]}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Input type="number" label="Price ($)" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} />
                        <Input type="number" label="Stock" value={formData.stock} onChange={e => setFormData({ ...formData, stock: e.target.value })} />
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Products;
