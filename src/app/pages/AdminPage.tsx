import React, { useEffect, useState } from 'react';
import API from '../api';
import PageWrapper from '../components/PageWrapper';
import { Plus, Trash2, Upload, Layout, Image as ImageIcon, ShoppingBag, X } from 'lucide-react';

const AdminPage = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [products, setProducts] = useState<any[]>([]);
    const [settings, setSettings] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [view, setView] = useState<'orders' | 'products' | 'site'>('orders');

    // Product Form State
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [image, setImage] = useState('');
    const [additionalImages, setAdditionalImages] = useState<string[]>([]);
    const [stock, setStock] = useState('');
    const [editingProduct, setEditingProduct] = useState<any>(null);

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
                API.get('/products'),
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
                stock: Number(stock) 
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
        setView('products');
    };

    const handleDeleteProduct = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await API.delete(`/products/${id}`);
                fetchData();
                alert('Product deleted!');
            } catch (err: any) {
                alert(err.response?.data?.message || 'Failed to delete product');
            }
        }
    };

    const handleUpdateOrderStatus = async (id: string, status: string) => {
        try {
            await API.put(`/orders/${id}`, { status });
            fetchData();
            alert('Order status updated!');
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to update order status');
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

    if (loading) return <div className="text-center py-20">Loading admin panel...</div>;
    if (error) return <div className="text-center py-20 text-red-500">{error}</div>;

    return (
        <PageWrapper>
            <section className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-20">
                <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
                    <h2 className="text-4xl" style={{ fontFamily: "'Playfair Display', serif" }}>Admin Control Center</h2>
                    <div className="flex bg-gray-100 p-1 rounded-2xl">
                        <button onClick={() => setView('orders')} className={`px-6 py-2 rounded-xl text-sm font-semibold transition-all ${view === 'orders' ? 'bg-white shadow-sm text-[#D85C63]' : 'text-gray-500'}`}>Orders</button>
                        <button onClick={() => setView('products')} className={`px-6 py-2 rounded-xl text-sm font-semibold transition-all ${view === 'products' ? 'bg-white shadow-sm text-[#D85C63]' : 'text-gray-500'}`}>Products</button>
                        <button onClick={() => setView('site')} className={`px-6 py-2 rounded-xl text-sm font-semibold transition-all ${view === 'site' ? 'bg-white shadow-sm text-[#D85C63]' : 'text-gray-500'}`}>Site Customization</button>
                    </div>
                </div>
                
                {view === 'orders' && (
                    <div className="overflow-x-auto bg-white rounded-3xl shadow-sm border border-gray-100">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="px-8 py-6 text-sm font-semibold text-gray-400 uppercase">ORDER ID</th>
                                    <th className="px-8 py-6 text-sm font-semibold text-gray-400 uppercase">USER</th>
                                    <th className="px-8 py-6 text-sm font-semibold text-gray-400 uppercase">TOTAL</th>
                                    <th className="px-8 py-6 text-sm font-semibold text-gray-400 uppercase">STATUS</th>
                                    <th className="px-8 py-6 text-sm font-semibold text-gray-400 uppercase">CUSTOM INFO</th>
                                    <th className="px-8 py-6 text-sm font-semibold text-gray-400 uppercase">ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {orders.map((order) => (
                                    <tr key={order._id}>
                                        <td className="px-8 py-6 font-mono text-sm">{order._id}</td>
                                        <td className="px-8 py-6 font-medium">{order.user.name}</td>
                                        <td className="px-8 py-6 font-bold text-[#D85C63]">₹{order.totalAmount}</td>
                                        <td className="px-8 py-6">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${order.orderStatus === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{order.orderStatus}</span>
                                        </td>
                                        <td className="px-8 py-6">
                                            {order.products.some((p: any) => p.isCustom) ? (
                                                <div className="space-y-2">
                                                    {order.products.filter((p: any) => p.isCustom).map((p: any, idx: number) => (
                                                        <div key={idx} className="text-xs bg-gray-50 p-3 rounded-xl border border-gray-100">
                                                            <p className="font-bold text-[#D85C63] mb-1">{p.customDetails.type}</p>
                                                            <p className="text-gray-500 italic mb-2 line-clamp-2">"{p.customDetails.description}"</p>
                                                            {p.customDetails.referenceImage && (
                                                                <a href={p.customDetails.referenceImage} target="_blank" rel="noreferrer" className="block w-12 h-12 rounded-lg overflow-hidden border border-gray-200 hover:border-[#D85C63] transition-all">
                                                                    <img src={p.customDetails.referenceImage} className="w-full h-full object-cover" alt="Reference" />
                                                                </a>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <span className="text-gray-300 text-xs italic">Standard Order</span>
                                            )}
                                        </td>
                                        <td className="px-8 py-6">
                                            <select value={order.orderStatus} onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)} className="text-sm border rounded-lg px-2 py-1 outline-none">
                                                <option value="Pending">Pending</option>
                                                <option value="Shipped">Shipped</option>
                                                <option value="Delivered">Delivered</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {view === 'products' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        <div className="lg:col-span-1 bg-white p-8 rounded-3xl shadow-sm border border-gray-100 h-fit sticky top-32">
                            <h3 className="text-2xl mb-8 font-medium flex items-center gap-2"><Plus size={24}/> {editingProduct ? 'Edit Product' : 'Add Product'}</h3>
                            <form onSubmit={handleProductSubmit} className="space-y-6">
                                <input type="text" placeholder="Product Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-[#D85C63]/50 outline-none" required />
                                <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-[#D85C63]/50 outline-none min-h-[100px]" required />
                                <div className="grid grid-cols-2 gap-4">
                                    <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} className="px-4 py-3 rounded-xl border outline-none" required />
                                    <input type="number" placeholder="Stock" value={stock} onChange={(e) => setStock(e.target.value)} className="px-4 py-3 rounded-xl border outline-none" required />
                                </div>
                                <input type="text" placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-4 py-3 rounded-xl border outline-none" required />
                                
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Main Image</label>
                                    <div className="flex items-center gap-4">
                                        <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-50 border border-dashed rounded-xl cursor-pointer hover:bg-gray-100 transition-all">
                                            <Upload size={18}/> <span className="text-sm">Upload Main</span>
                                            <input type="file" className="hidden" onChange={(e) => handleImageUpload(e, 'main')} />
                                        </label>
                                        {image && <img src={image} className="w-12 h-12 object-cover rounded-lg" />}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">More Angles (Multi-image)</label>
                                    <label className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-50 border border-dashed rounded-xl cursor-pointer hover:bg-gray-100 transition-all">
                                        <Plus size={18}/> <span className="text-sm">Add Angle</span>
                                        <input type="file" className="hidden" onChange={(e) => handleImageUpload(e, 'additional')} />
                                    </label>
                                    <div className="grid grid-cols-4 gap-2 mt-3">
                                        {additionalImages.map((img, i) => (
                                            <div key={i} className="relative group">
                                                <img src={img} className="w-full aspect-square object-cover rounded-lg border" />
                                                <button type="button" onClick={() => setAdditionalImages(additionalImages.filter((_, idx) => idx !== i))} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all"><X size={12}/></button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <button type="submit" className="w-full bg-[#D85C63] text-white py-4 rounded-full font-bold shadow-lg hover:bg-[#d1535a] transition-all">
                                    {editingProduct ? 'Update Product' : 'Create Product'}
                                </button>
                                {editingProduct && <button type="button" onClick={resetForm} className="w-full py-2 text-gray-400 text-sm hover:underline">Cancel Editing</button>}
                            </form>
                        </div>
                        
                        <div className="lg:col-span-2 space-y-4">
                            {products.map((product) => (
                                <div key={product._id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-6 group">
                                    <img src={product.image} className="w-20 h-20 object-cover rounded-2xl" />
                                    <div className="flex-1">
                                        <h4 className="text-lg font-medium">{product.name}</h4>
                                        <p className="text-[#D85C63] font-bold">₹{product.price} <span className="text-gray-300 mx-2">|</span> <span className="text-gray-400 text-sm font-normal">{product.stock} in stock</span></p>
                                    </div>
                                    <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-all">
                                        <button onClick={() => handleEditProduct(product)} className="text-gray-400 hover:text-blue-500 font-bold text-xs uppercase">Edit</button>
                                        <button onClick={() => handleDeleteProduct(product._id)} className="text-gray-400 hover:text-red-500 font-bold text-xs uppercase">Delete</button>
                                    </div>
                                </div>
                            ))}
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
