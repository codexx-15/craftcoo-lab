import React, { useEffect, useState } from 'react';
import API from '../api';
import PageWrapper from '../components/PageWrapper';
import { Plus, Trash2, Upload, Layout, Image as ImageIcon, ShoppingBag, X, Edit2, Save, ExternalLink, XCircle, Star } from 'lucide-react';
import { toast } from 'sonner';

const AdminPage = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [products, setProducts] = useState<any[]>([]);
    const [settings, setSettings] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [view, setView] = useState<'orders' | 'products' | 'site'>('orders');
    const [orderCategoryFilter, setOrderCategoryFilter] = useState('All');

    // Product Form State
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [image, setImage] = useState('');
    const [additionalImages, setAdditionalImages] = useState<string[]>([]);
    const [stock, setStock] = useState('');
    const [isLimitedEdition, setIsLimitedEdition] = useState(false);
    const [editingProduct, setEditingProduct] = useState<any>(null);
    const [togglingId, setTogglingId] = useState<string | null>(null);

    // Site Settings State
    const [heroTitle, setHeroTitle] = useState('');
    const [heroSubtitle, setHeroSubtitle] = useState('');
    const [heroImage, setHeroImage] = useState('');
    const [heroButtonText, setHeroButtonText] = useState('');
    const [collections, setCollections] = useState<any[]>([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [ordersRes, productsRes, settingsRes] = await Promise.all([
                API.get('/orders/admin'),
                API.get('/products', { params: { includeLimited: 'true' } }),
                API.get('/settings')
            ]);
            setOrders(ordersRes.data);
            setProducts(productsRes.data);
            setSettings(settingsRes.data);
            
            // Initialize site settings state
            setHeroTitle(settingsRes.data.hero.title);
            setHeroSubtitle(settingsRes.data.hero.subtitle);
            setHeroImage(settingsRes.data.hero.image);
            setHeroButtonText(settingsRes.data.hero.buttonText);
            setCollections(settingsRes.data.collections);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch admin data');
        } finally {
            setLoading(false);
        }
    };

    const handleProductSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!image) {
            alert('Please upload a main product image first');
            return;
        }
        try {
            const productData = { 
                name, 
                description, 
                price: Number(price), 
                category, 
                image, 
                images: additionalImages,
                stock: Number(stock),
                isLimitedEdition
            };
            console.log('Submitting product data:', productData);
            if (editingProduct) {
                await API.put(`/products/${editingProduct._id}`, productData);
                alert('Product updated successfully!');
            } else {
                await API.post('/products', productData);
                alert('Product created successfully!');
            }
            fetchData();
            resetForm();
        } catch (err: any) {
            console.error('Product action failed:', err.response?.data || err.message);
            alert(err.response?.data?.message || 'Product action failed. Please check all fields and try again.');
        }
    };

    const handleSettingsSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await API.put('/settings', {
                hero: { title: heroTitle, subtitle: heroSubtitle, image: heroImage, buttonText: heroButtonText },
                collections: collections
            });
            alert('Site settings updated!');
            fetchData();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to update settings');
        }
    };

    const resetForm = () => {
        setName('');
        setDescription('');
        setPrice('');
        setCategory('');
        setImage('');
        setAdditionalImages([]);
        setStock('');
        setIsLimitedEdition(false);
        setEditingProduct(null);
    };

    const handleEditProduct = (product: any) => {
        setEditingProduct(product);
        setName(product.name);
        setDescription(product.description);
        setPrice(product.price.toString());
        setCategory(product.category);
        setImage(product.image);
        setAdditionalImages(product.images || []);
        setStock(product.stock.toString());
        setIsLimitedEdition(product.isLimitedEdition || false);
        setView('products');
    };

    const handleDeleteProduct = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await API.delete(`/products/${id}`);
                alert('Product deleted!');
                fetchData();
            } catch (err: any) {
                alert(err.response?.data?.message || 'Failed to delete product');
            }
        }
    };

    const handleDeleteOrder = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
            try {
                await API.delete(`/orders/${id}`);
                toast.success('Order deleted successfully');
                fetchData();
            } catch (err: any) {
                toast.error(err.response?.data?.message || 'Failed to delete order');
            }
        }
    };

    const handleUpdateOrderStatus = async (id: string, status: string) => {
        try {
            await API.put(`/orders/${id}`, { status });
            toast.success(`Order status updated to ${status}`);
            fetchData();
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to update order status');
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: 'main' | 'additional' | 'hero' | 'collection', index?: number) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('image', file);
        try {
            const { data } = await API.post('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            if (target === 'main') setImage(data.url);
            else if (target === 'additional') setAdditionalImages([...additionalImages, data.url]);
            else if (target === 'hero') setHeroImage(data.url);
            else if (target === 'collection' && index !== undefined) {
                const newCols = [...collections];
                newCols[index].image = data.url;
                setCollections(newCols);
            }
        } catch (err) {
            alert('Failed to upload image');
        }
    };

    const handleUpdateProduct = async (id: string, updates: any) => {
        if (togglingId === id) return;
        
        // Save current state for rollback
        const previousProducts = [...products];
        
        try {
            setTogglingId(id);
            
            // 1. Optimistic UI update - Change it immediately in the list
            setProducts(prev => prev.map(p => p._id === id ? { ...p, ...updates } : p));
            
            // 2. Perform server update
            const response = await API.put(`/products/${id}`, updates);
            const updatedProduct = response.data;
            
            // 3. Force the state to match the server's confirmed data
            setProducts(prev => prev.map(p => p._id === id ? updatedProduct : p));
            
            toast.success('Status updated successfully');
        } catch (err: any) {
            console.error('Update failed:', err);
            toast.error('Failed to update product');
            // Rollback to previous state on error
            setProducts(previousProducts);
        } finally {
            setTogglingId(null);
        }
    };

    if (loading) return <div className="text-center py-20">Loading admin panel...</div>;
    if (error) return <div className="text-center py-20 text-red-500">{error}</div>;

    const filteredOrders = orders.filter(order => {
        if (orderCategoryFilter === 'All') return true;
        if (orderCategoryFilter === 'Custom') return order.products.some((p: any) => p.isCustom);
        return order.products.some((p: any) => !p.isCustom && p.product?.category === orderCategoryFilter);
    });

    // Flatten logic for items view when filtering
    const displayRows = orderCategoryFilter === 'All' 
        ? filteredOrders 
        : filteredOrders.flatMap(order => {
            const matchingProducts = orderCategoryFilter === 'Custom'
                ? order.products.filter((p: any) => p.isCustom)
                : order.products.filter((p: any) => !p.isCustom && p.product?.category === orderCategoryFilter);
            
            return matchingProducts.map((p: any, idx: number) => ({
                ...order,
                displayProduct: p,
                isFlattened: true,
                flattenId: `${order._id}-${idx}`
            }));
        });

    const otherCategories = Array.from(new Set(products.map(p => p.category).filter(c => c && c !== 'Custom'))).sort();
    const categoriesList = ['All', 'Custom', ...otherCategories];

    return (
        <PageWrapper>
            <section className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-20">
                <div className="flex flex-col lg:flex-row justify-between items-center mb-8 md:mb-12 gap-6">
                    <h2 className="text-2xl md:text-4xl font-bold text-center lg:text-left" style={{ fontFamily: "'Playfair Display', serif" }}>Admin Control Center</h2>
                    <div className="flex bg-gray-100 p-1.5 rounded-2xl w-full lg:w-auto overflow-x-auto no-scrollbar">
                        <button onClick={() => setView('orders')} className={`flex-1 lg:flex-none px-4 md:px-6 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all whitespace-nowrap ${view === 'orders' ? 'bg-white shadow-md text-[#D85C63]' : 'text-gray-500'}`}>Orders</button>
                        <button onClick={() => setView('products')} className={`flex-1 lg:flex-none px-4 md:px-6 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all whitespace-nowrap ${view === 'products' ? 'bg-white shadow-md text-[#D85C63]' : 'text-gray-500'}`}>Products</button>
                        <button onClick={() => setView('site')} className={`flex-1 lg:flex-none px-4 md:px-6 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all whitespace-nowrap ${view === 'site' ? 'bg-white shadow-md text-[#D85C63]' : 'text-gray-500'}`}>Site Customization</button>
                    </div>
                </div>
                
                {view === 'orders' && (
                    <div className="space-y-6">
                        <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider px-2">Filter:</span>
                            <select 
                                value={orderCategoryFilter}
                                onChange={(e) => setOrderCategoryFilter(e.target.value)}
                                className="w-full sm:w-auto bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-semibold outline-none focus:ring-2 focus:ring-[#D85C63]/20 transition-all cursor-pointer capitalize"
                            >
                                {categoriesList.map(cat => (
                                    <option key={cat} value={cat} className="capitalize">{cat}</option>
                                ))}
                            </select>
                            <span className="sm:ml-auto px-2 text-[10px] md:text-sm text-gray-400 font-medium">
                                {displayRows.length} {displayRows.length === 1 ? 'result' : 'results'}
                            </span>
                        </div>

                        {/* Desktop Table View */}
                        <div className="hidden lg:block overflow-hidden bg-white rounded-3xl shadow-sm border border-gray-100">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-100">
                                        <th className="px-8 py-6 text-sm font-semibold text-gray-400 uppercase">ORDER ID</th>
                                        <th className="px-8 py-6 text-sm font-semibold text-gray-400 uppercase">USER</th>
                                        <th className="px-8 py-6 text-sm font-semibold text-gray-400 uppercase">TOTAL</th>
                                        <th className="px-8 py-6 text-sm font-semibold text-gray-400 uppercase">STATUS</th>
                                        <th className="px-8 py-6 text-sm font-semibold text-gray-400 uppercase">{orderCategoryFilter === 'All' ? 'ORDER ITEMS' : 'ITEM DETAILS'}</th>
                                        <th className="px-8 py-6 text-sm font-semibold text-gray-400 uppercase">ACTIONS</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {displayRows.map((row: any) => {
                                        const order = row;
                                        const productsToDisplay = row.isFlattened ? [row.displayProduct] : order.products;

                                        return (
                                            <tr key={row.isFlattened ? row.flattenId : order._id}>
                                                <td className="px-8 py-6 font-mono text-xs">{order._id}</td>
                                                <td className="px-8 py-6 font-medium">{order.user.name}</td>
                                                <td className="px-8 py-6 font-bold text-[#D85C63]">
                                                    {row.isFlattened ? `₹${row.displayProduct.price * row.displayProduct.quantity}` : `₹${order.totalAmount}`}
                                                </td>
                                                <td className="px-8 py-6">
                                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${order.orderStatus === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{order.orderStatus}</span>
                                                </td>
                                                <td className="px-8 py-6 min-w-[300px]">
                                                    <div className="space-y-3">
                                                        {productsToDisplay.map((p: any, idx: number) => (
                                                            <div key={idx} className={`p-3 rounded-xl border ${p.isCustom ? 'bg-gray-50 border-[#D85C63]/20' : 'bg-white border-gray-100'}`}>
                                                                {p.isCustom ? (
                                                                    <div className="space-y-2">
                                                                        <div className="flex justify-between items-start">
                                                                            <p className="text-[10px] font-bold text-[#D85C63] uppercase tracking-tighter">Custom: {p.customDetails?.type || 'Painting'}</p>
                                                                            <span className="text-[10px] font-bold text-gray-400">Qty: {p.quantity}</span>
                                                                        </div>
                                                                        <p className="text-[11px] text-gray-500 italic line-clamp-2">"{p.customDetails?.description}"</p>
                                                                        <div className="flex items-center gap-2">
                                                                            {p.customDetails?.referenceImage && (
                                                                                <a href={p.customDetails.referenceImage} target="_blank" rel="noreferrer" className="block w-10 h-10 rounded-lg overflow-hidden border border-gray-200 hover:border-[#D85C63] transition-all group/img relative">
                                                                                    <img src={p.customDetails.referenceImage} className="w-full h-full object-cover" alt="Reference" />
                                                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity">
                                                                                        <ExternalLink size={12} className="text-white" />
                                                                                    </div>
                                                                                </a>
                                                                            )}
                                                                            <div className="text-[10px] text-gray-400">
                                                                                <p>{p.customDetails?.style} • {p.customDetails?.size}</p>
                                                                                <p>Price: ₹{p.price}</p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ) : (
                                                                    <div className="flex justify-between items-center gap-4">
                                                                        <div className="flex items-center gap-3">
                                                                            {p.product?.image && (
                                                                                <a href={p.product.image} target="_blank" rel="noreferrer" className="block w-10 h-10 rounded-lg overflow-hidden border border-gray-200 hover:border-[#D85C63] transition-all group/img relative flex-shrink-0">
                                                                                    <img src={p.product.image} className="w-full h-full object-cover" alt={p.product.name} />
                                                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity">
                                                                                        <ExternalLink size={12} className="text-white" />
                                                                                    </div>
                                                                                </a>
                                                                            )}
                                                                            <div>
                                                                                <p className="text-xs font-bold text-gray-700">{p.product?.name || 'Standard Product'}</p>
                                                                                <p className="text-[10px] text-gray-400 uppercase tracking-widest">{p.product?.category}</p>
                                                                            </div>
                                                                        </div>
                                                                        <div className="text-right">
                                                                            <p className="text-[10px] font-bold text-gray-400">Qty: {p.quantity}</p>
                                                                            <p className="text-[10px] text-[#D85C63] font-bold">₹{p.price}</p>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-3">
                                                        <select 
                                                            value={order.orderStatus} 
                                                            onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)} 
                                                            className="text-xs border border-gray-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-[#D85C63]/20 transition-all bg-white"
                                                        >
                                                            <option value="Pending">Pending</option>
                                                            <option value="Shipped">Shipped</option>
                                                            <option value="Delivered">Delivered</option>
                                                            <option value="Cancelled">Cancelled</option>
                                                        </select>
                                                        <button 
                                                            onClick={() => handleDeleteOrder(order._id)}
                                                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                                            title="Delete Order"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Card View */}
                        <div className="lg:hidden space-y-4">
                            {displayRows.map((row: any) => {
                                const order = row;
                                const productsToDisplay = row.isFlattened ? [row.displayProduct] : order.products;
                                return (
                                    <div key={row.isFlattened ? row.flattenId : order._id} className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 space-y-6">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Order ID</p>
                                                <p className="font-mono text-[10px]">{order._id}</p>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${order.orderStatus === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                {order.orderStatus}
                                            </span>
                                        </div>

                                        <div className="flex justify-between items-end border-b border-gray-50 pb-4">
                                            <div>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Customer</p>
                                                <p className="font-bold text-gray-800">{order.user.name}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Total</p>
                                                <p className="font-bold text-[#D85C63] text-xl">₹{row.isFlattened ? row.displayProduct.price * row.displayProduct.quantity : order.totalAmount}</p>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <p className="text-[10px] font-bold text-gray-400 uppercase">Items</p>
                                            {productsToDisplay.map((p: any, idx: number) => (
                                                <div key={idx} className={`p-4 rounded-2xl border ${p.isCustom ? 'bg-red-50/30 border-[#D85C63]/10' : 'bg-gray-50 border-gray-100'}`}>
                                                    {p.isCustom ? (
                                                        <div className="space-y-3">
                                                            <div className="flex justify-between items-center">
                                                                <span className="text-[10px] font-bold text-[#D85C63]">CUSTOM PAINTING</span>
                                                                <span className="text-[10px] font-bold text-gray-400">x{p.quantity}</span>
                                                            </div>
                                                            <div className="flex gap-3">
                                                                {p.customDetails?.referenceImage && (
                                                                    <img src={p.customDetails.referenceImage} className="w-12 h-12 rounded-xl object-cover border border-white shadow-sm" />
                                                                )}
                                                                <div>
                                                                    <p className="text-xs font-bold text-gray-800 line-clamp-1">{p.customDetails?.type}</p>
                                                                    <p className="text-[10px] text-gray-500 line-clamp-1 italic">"{p.customDetails?.description}"</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center gap-3">
                                                            {p.product?.image && <img src={p.product.image} className="w-12 h-12 rounded-xl object-cover border border-white shadow-sm" />}
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-xs font-bold text-gray-800 truncate">{p.product?.name}</p>
                                                                <p className="text-[10px] text-gray-400 uppercase tracking-widest">{p.product?.category}</p>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="text-[10px] font-bold text-gray-400">x{p.quantity}</p>
                                                                <p className="text-xs font-bold text-[#D85C63]">₹{p.price}</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>

                                        <div className="pt-2 flex items-center gap-3">
                                            <select 
                                                value={order.orderStatus} 
                                                onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)} 
                                                className="flex-1 text-xs font-bold border border-gray-100 rounded-2xl px-4 py-3 outline-none bg-gray-50 active:bg-white transition-all"
                                            >
                                                <option value="Pending">Pending</option>
                                                <option value="Shipped">Shipped</option>
                                                <option value="Delivered">Delivered</option>
                                                <option value="Cancelled">Cancelled</option>
                                            </select>
                                            <button 
                                                onClick={() => handleDeleteOrder(order._id)}
                                                className="p-3 bg-red-50 text-red-500 rounded-2xl hover:bg-red-100 transition-all active:scale-90"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {view === 'products' && (
                    <div className="flex flex-col lg:grid lg:grid-cols-3 gap-8 md:gap-12">
                        <div className="lg:col-span-1 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 h-fit lg:sticky lg:top-32 order-2 lg:order-1">
                            <h3 className="text-xl md:text-2xl mb-6 md:mb-8 font-medium flex items-center gap-2">
                                {editingProduct ? <Edit2 size={24}/> : <Plus size={24}/>} 
                                {editingProduct ? 'Edit Product' : 'Add Product'}
                            </h3>
                            <form onSubmit={handleProductSubmit} className="space-y-5 md:space-y-6">
                                <div className="bg-gradient-to-r from-[#D85C63]/10 to-transparent p-4 rounded-2xl border border-[#D85C63]/20 mb-2">
                                    <div className="flex items-center gap-3">
                                        <input 
                                            type="checkbox" 
                                            id="isLimitedEdition"
                                            checked={isLimitedEdition} 
                                            onChange={(e) => setIsLimitedEdition(e.target.checked)}
                                            className="w-6 h-6 accent-[#D85C63] cursor-pointer"
                                        />
                                        <label htmlFor="isLimitedEdition" className="text-xs md:text-sm font-black text-[#D85C63] cursor-pointer tracking-tight">
                                            ✨ LIMITED EDITION ART DROP
                                        </label>
                                    </div>
                                    <p className="text-[10px] text-gray-500 mt-1 ml-9 font-medium">Hides product from regular store view.</p>
                                </div>

                                <input type="text" placeholder="Product Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#D85C63]/50 outline-none text-sm" required />
                                <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#D85C63]/50 outline-none min-h-[100px] text-sm" required />
                                <div className="grid grid-cols-2 gap-4">
                                    <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} className="px-4 py-3 rounded-xl border border-gray-200 outline-none text-sm" required />
                                    <input type="number" placeholder="Stock" value={stock} onChange={(e) => setStock(e.target.value)} className="px-4 py-3 rounded-xl border border-gray-200 outline-none text-sm" required />
                                </div>
                                <input type="text" placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none text-sm" required />
                                
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-widest">Main Image</label>
                                        <div className="flex items-center gap-4">
                                            <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-50 border border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-100 transition-all">
                                                <Upload size={16} className="text-gray-400"/> <span className="text-xs font-bold text-gray-600">Upload</span>
                                                <input type="file" className="hidden" onChange={(e) => handleImageUpload(e, 'main')} />
                                            </label>
                                            {image && <img src={image} className="w-12 h-12 object-cover rounded-xl border border-white shadow-sm" />}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-widest">Gallery Images</label>
                                        <label className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-50 border border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-100 transition-all">
                                            <Plus size={16} className="text-gray-400"/> <span className="text-xs font-bold text-gray-600">Add More</span>
                                            <input type="file" className="hidden" onChange={(e) => handleImageUpload(e, 'additional')} />
                                        </label>
                                        <div className="grid grid-cols-4 gap-2 mt-3">
                                            {additionalImages.map((img, i) => (
                                                <div key={i} className="relative group aspect-square">
                                                    <img src={img} className="w-full h-full object-cover rounded-xl border border-gray-100" />
                                                    <button type="button" onClick={() => setAdditionalImages(additionalImages.filter((_, idx) => idx !== i))} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 shadow-md active:scale-90"><X size={10}/></button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-2 space-y-3">
                                    <button type="submit" className="w-full bg-[#D85C63] text-white py-4 rounded-2xl font-bold shadow-lg hover:bg-[#d1535a] transition-all active:scale-[0.98]">
                                        {editingProduct ? 'Save Changes' : 'Create Product'}
                                    </button>
                                    {editingProduct && (
                                        <button type="button" onClick={resetForm} className="w-full py-2 text-gray-400 text-xs font-bold hover:text-gray-600 uppercase tracking-widest">
                                            Cancel Editing
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>
                        
                        <div className="lg:col-span-2 space-y-4 order-1 lg:order-2">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 px-2 gap-2">
                                <h3 className="text-xl font-medium">All Products</h3>
                                <div className="text-[10px] font-black text-[#D85C63] uppercase tracking-widest bg-red-50 px-3 py-1.5 rounded-full border border-[#D85C63]/10">
                                    Quick Toggle: Limited Edition
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                                {products.map((product) => (
                                    <div key={product._id} className="bg-white p-4 md:p-6 rounded-[32px] shadow-sm border border-gray-100 flex flex-col sm:flex-row lg:flex-row items-center gap-4 md:gap-6 group hover:border-[#D85C63]/30 transition-all relative">
                                        <div className="relative w-full sm:w-20 h-40 sm:h-20 flex-shrink-0">
                                            <img src={product.image} className="w-full h-full object-cover rounded-2xl" />
                                            {product.isLimitedEdition && (
                                                <div className="absolute -top-2 -right-2 bg-[#D85C63] text-white p-1.5 rounded-full shadow-lg border-2 border-white">
                                                    <Star size={12} fill="white" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 text-center sm:text-left w-full">
                                            <div className="flex flex-col sm:flex-row items-center sm:items-center gap-2 mb-2">
                                                <h4 className="text-base md:text-lg font-bold text-gray-800 line-clamp-1">{product.name}</h4>
                                                <div 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (togglingId === product._id) return;
                                                        const newValue = !product.isLimitedEdition;
                                                        handleUpdateProduct(product._id, { isLimitedEdition: newValue });
                                                    }}
                                                    className={`px-3 py-1.5 rounded-full border transition-all flex items-center gap-2 ${
                                                        togglingId === product._id ? 'opacity-50 cursor-not-allowed scale-95' : 'cursor-pointer hover:scale-105 active:scale-95'
                                                    } ${
                                                        product.isLimitedEdition 
                                                        ? 'bg-red-50 border-[#D85C63]/30 text-[#D85C63]' 
                                                        : 'bg-gray-50 border-gray-200 text-gray-400 hover:border-[#D85C63]/30 hover:text-[#D85C63]'
                                                    }`}
                                                >
                                                    <span className={`text-[9px] font-black uppercase tracking-widest`}>
                                                        {product.isLimitedEdition ? '✨ Limited Drop' : 'Regular'}
                                                    </span>
                                                    <div className={`w-2.5 h-2.5 rounded-full border ${
                                                        togglingId === product._id ? 'animate-pulse bg-gray-300' : (product.isLimitedEdition ? 'bg-[#D85C63] border-white' : 'bg-white border-gray-300')
                                                    }`} />
                                                </div>
                                            </div>
                                            <p className="text-[#D85C63] font-black text-lg">₹{product.price} <span className="text-gray-200 mx-2 font-normal">|</span> <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">{product.stock} Stock</span></p>
                                        </div>
                                        <div className="flex sm:flex-col gap-2 w-full sm:w-auto">
                                            <button 
                                                onClick={() => handleEditProduct(product)} 
                                                className="flex-1 sm:flex-none px-4 py-2 bg-gray-50 text-gray-600 hover:bg-gray-100 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all"
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteProduct(product._id)} 
                                                className="flex-1 sm:flex-none px-4 py-2 bg-red-50 text-red-500 hover:bg-red-100 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {view === 'site' && (
                    <div className="max-w-4xl mx-auto bg-white p-10 rounded-[40px] shadow-sm border border-gray-100">
                        <form onSubmit={handleSettingsSubmit} className="space-y-12">
                            {/* Hero Section Management */}
                            <div>
                                <h3 className="text-2xl mb-8 flex items-center gap-3 font-medium"><Layout className="text-[#D85C63]"/> Hero Section</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Hero Title</label>
                                            <input type="text" value={heroTitle} onChange={(e) => setHeroTitle(e.target.value)} className="w-full px-4 py-3 rounded-xl border outline-none" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Hero Subtitle</label>
                                            <textarea value={heroSubtitle} onChange={(e) => setHeroSubtitle(e.target.value)} className="w-full px-4 py-3 rounded-xl border outline-none min-h-[80px]" />
                                        </div>
                                    </div>
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Hero Background Image</label>
                                            <div className="relative aspect-video rounded-2xl overflow-hidden border group">
                                                <img src={heroImage} className="w-full h-full object-cover" />
                                                <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer">
                                                    <Upload className="text-white" />
                                                    <input type="file" className="hidden" onChange={(e) => handleImageUpload(e, 'hero')} />
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Collections Management */}
                            <div className="pt-12 border-t border-gray-100">
                                <h3 className="text-2xl mb-8 flex items-center gap-3 font-medium"><ImageIcon className="text-[#D85C63]"/> Explore Our Collections</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                    {collections.map((col, idx) => (
                                        <div key={idx} className="space-y-4">
                                            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border group">
                                                <img src={col.image} className="w-full h-full object-cover" />
                                                <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer">
                                                    <Upload className="text-white" />
                                                    <input type="file" className="hidden" onChange={(e) => handleImageUpload(e, 'collection', idx)} />
                                                </label>
                                            </div>
                                            <input 
                                                type="text" 
                                                value={col.title} 
                                                onChange={(e) => {
                                                    const newCols = [...collections];
                                                    newCols[idx].title = e.target.value;
                                                    setCollections(newCols);
                                                }}
                                                className="w-full text-center text-sm font-semibold outline-none border-b border-transparent focus:border-[#D85C63]" 
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <button type="submit" className="w-full bg-[#D85C63] text-white py-5 rounded-full font-bold text-lg shadow-xl hover:bg-[#d1535a] transition-all">
                                Save All Site Customizations
                            </button>
                        </form>
                    </div>
                )}
            </section>
        </PageWrapper>
    );
};

export default AdminPage;
