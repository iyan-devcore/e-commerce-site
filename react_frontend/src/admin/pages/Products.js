import React, { useState, useEffect } from 'react';
import Table from '../components/ui/Table';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Modal from '../components/ui/Modal';
import { mockProducts } from '../data/mockData';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);

    // Form Stats
    const [formData, setFormData] = useState({
        name: '', category: 'Electronics', price: '', discountPrice: '', stock: '', status: 'Active', description: '', sku: ''
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const token = JSON.parse(localStorage.getItem('user'))?.token || "";
            const res = await fetch(`${process.env.REACT_APP_API_URL}/product/getProducts`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.data) setProducts(data.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const handleSearch = (e) => setSearchTerm(e.target.value.toLowerCase());
    const handleCategoryFilter = (e) => setCategoryFilter(e.target.value);

    // Compute dynamic categories
    const uniqueCategories = Array.from(new Set(products.map(p => p.category))).filter(Boolean);

    // Filter Logic
    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm) || (p.sku && p.sku.toLowerCase().includes(searchTerm));
        const matchesCategory = categoryFilter ? p.category === categoryFilter : true;
        return matchesSearch && matchesCategory;
    });

    // Delete Logic
    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                const token = JSON.parse(localStorage.getItem('user'))?.token || "";
                await fetch(`${process.env.REACT_APP_API_URL}/product/deleteProduct/${id}`, { 
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                fetchProducts();
            } catch (error) {
                console.error(error);
            }
        }
    };

    // Edit/Add Logic
    const openModal = (product = null) => {
        if (product) {
            setFormData({ ...product, images: null });
            setCurrentProduct(product);
        } else {
            setFormData({ name: '', category: 'Electronics', price: '', discountPrice: '', stock: '', status: 'Active', description: '', sku: `NEW-${Date.now()}`, images: null });
            setCurrentProduct(null);
        }
        setIsModalOpen(true);
    };

    const handleSave = async () => {
        const formDataObj = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (key === 'images' && value) {
                Array.from(value).forEach(file => {
                    formDataObj.append('imageUpload', file);
                });
            } else if (key !== 'images' && key !== 'imageUpload' && value !== undefined && value !== null) {
                formDataObj.append(key, value);
            }
        });

        try {
            const token = JSON.parse(localStorage.getItem('user'))?.token || "";
            if (currentProduct) {
                await fetch(`${process.env.REACT_APP_API_URL}/product/updateProduct/${currentProduct._id}`, {
                    method: 'PUT',
                    headers: { 'Authorization': `Bearer ${token}` },
                    body: formDataObj
                });
            } else {
                await fetch(`${process.env.REACT_APP_API_URL}/product/addProduct`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` },
                    body: formDataObj
                });
            }
            fetchProducts();
            setIsModalOpen(false);
        } catch (error) {
            console.error(error);
        }
    };

    const columns = [
        {
            header: 'Product',
            accessor: 'name',
            render: (row) => (
                <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                        <img className="h-10 w-10 rounded-lg object-cover bg-gray-100" src={(row.imageUpload && row.imageUpload.length > 0) ? row.imageUpload[0] : "https://via.placeholder.com/40"} alt="" />
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
            render: (row) => <span className="text-gray-900 font-medium">₹{row.price}</span>
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
            <Button variant="ghost" className="px-2 py-1 text-xs text-red-600 hover:text-red-800 hover:bg-red-50" onClick={(e) => { e.stopPropagation(); handleDelete(row._id); }}>Delete</Button>
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
                        ...uniqueCategories.map(cat => ({ value: cat, label: cat }))
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
                    <Input label="Product Name" value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                    <Input label="Description" value={formData.description || ''} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                    
                    <div className="grid grid-cols-2 gap-4">
                        <Input label="SKU" value={formData.sku || ''} onChange={e => setFormData({ ...formData, sku: e.target.value })} />
                        <Select
                            label="Category"
                            value={formData.category || 'Electronics'}
                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                            options={uniqueCategories.length > 0 ? uniqueCategories.map(cat => ({ value: cat, label: cat })) : [{ value: 'Electronics', label: 'Electronics' }, { value: 'Fashion', label: 'Fashion' }]}
                        />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <Input type="number" label="Price (₹)" value={formData.price || ''} onChange={e => setFormData({ ...formData, price: e.target.value })} />
                        <Input type="number" label="Discount Price (₹)" value={formData.discountPrice || ''} onChange={e => setFormData({ ...formData, discountPrice: e.target.value })} />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <Input type="number" label="Stock" value={formData.stock || ''} onChange={e => setFormData({ ...formData, stock: e.target.value })} />
                        <Select
                            label="Status"
                            value={formData.status || 'Active'}
                            onChange={e => setFormData({ ...formData, status: e.target.value })}
                            options={[
                                { value: 'Active', label: 'Active' },
                                { value: 'Inactive', label: 'Inactive' },
                            ]}
                        />
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-700 mb-1">Images (Max 5)</label>
                            <input 
                                type="file" 
                                multiple 
                                accept="image/*"
                                onChange={e => {
                                    if (e.target.files.length > 5) {
                                        alert("You can only upload up to 5 images per product.");
                                        e.target.value = "";
                                    } else {
                                        setFormData({ ...formData, images: e.target.files });
                                    }
                                }} 
                                className="block w-full text-xs text-gray-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Products;
