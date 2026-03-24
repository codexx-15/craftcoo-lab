import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import API from '../api';
import { Trash2, Plus, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { toast } from 'sonner';

import PageWrapper from '../components/PageWrapper';

const CartPage = () => {
    const [cart, setCart] = useState<any>(null);
    const { updateCartCount } = useCart();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            setLoading(true);
            const { data } = await API.get('/cart');
            console.log('Cart data fetched:', data);
            setCart(data);
        } catch (err: any) {
            console.error('Cart fetch error:', err);
            if (err.response?.status === 401) {
                navigate('/login');
            } else {
                setError('Failed to fetch cart');
            }
        } finally {
            setLoading(false);
        }
    };

    const updateQuantity = async (productId: string, quantity: number, index?: number) => {
        if (quantity < 1) return;
        try {
            const { data } = await API.put('/cart', { productId, quantity, index });
            setCart(data);
            await updateCartCount();
        } catch (err) {
            toast.error('Failed to update quantity');
        }
    };

    const removeItem = async (productId: string, index?: number) => {
        try {
            const url = index !== undefined ? `/cart/${productId}?index=${index}` : `/cart/${productId}`;
            const { data } = await API.delete(url);
            setCart(data);
            await updateCartCount();
            toast.success('Item removed from cart');
        } catch (err) {
            toast.error('Failed to remove item');
        }
    };

    if (loading) return <div className="text-center py-20">Loading cart...</div>;
    if (error) return <div className="text-center py-20 text-red-500">{error}</div>;

    const total = cart?.items?.reduce((acc: number, item: any) => {
        const itemPrice = item.isCustom ? item.price : (item.product?.price || 0);
        return acc + itemPrice * (item.quantity || 0);
    }, 0) || 0;

    return (
        <PageWrapper>
            <section className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-20">
                <h2 className="text-3xl md:text-4xl mb-8 md:mb-12" style={{ fontFamily: "'Playfair Display', serif" }}>Your Cart</h2>
                
                {!cart?.items || cart.items.length === 0 ? (
                    <div className="text-center py-16 md:py-20 bg-white rounded-2xl border border-dashed border-gray-300 px-4">
                        <p className="text-lg md:text-xl text-gray-500 mb-6 md:mb-8">Your cart is empty.</p>
                        <Link to="/" className="inline-block bg-[#D85C63] text-white py-3 px-8 md:px-10 rounded-full hover:bg-[#d1535a] transition-all text-sm md:text-base font-semibold">
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-col lg:grid lg:grid-cols-3 gap-8 md:gap-12">
                        <div className="lg:col-span-2 space-y-4 md:space-y-6">
                            {cart?.items?.map((item: any, index: number) => {
                                try {
                                    const productId = item.product?._id || `custom-${index}`;
                                    return (
                                        <div key={productId + (item.isCustom ? `-${index}` : '')} className="flex flex-col sm:flex-row items-center sm:items-center gap-4 md:gap-6 bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100 relative group">
                                            <div className="w-full sm:w-24 h-48 sm:h-24 flex-shrink-0">
                                                <img 
                                                    src={item.isCustom ? item.customDetails?.referenceImage : (item.product?.image || '/images/placeholder.png')} 
                                                    alt={item.isCustom ? 'Custom Painting' : (item.product?.name || 'Product')} 
                                                    className="w-full h-full object-cover rounded-xl shadow-sm" 
                                                />
                                            </div>
                                            <div className="flex-1 text-center sm:text-left w-full">
                                                <h3 className="text-lg md:text-xl font-medium mb-1 line-clamp-1">
                                                    {item.isCustom ? `Custom ${item.customDetails?.type || ''} Painting` : (item.product?.name || 'Unknown Product')}
                                                </h3>
                                                {item.isCustom && item.customDetails && (
                                                    <div className="text-[10px] md:text-xs text-gray-400 space-y-0.5 mb-2">
                                                        <p>{item.customDetails.style} • {item.customDetails.size}</p>
                                                        <p className="italic line-clamp-1">"{item.customDetails.description}"</p>
                                                    </div>
                                                )}
                                                <p className="text-[#D85C63] font-bold text-lg">₹{item.isCustom ? item.price : (item.product?.price || 0)}</p>
                                            </div>
                                            <div className="flex items-center justify-between sm:justify-start w-full sm:w-auto gap-4">
                                                <div className="flex items-center gap-4 bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
                                                    <button onClick={() => updateQuantity(productId, item.quantity - 1, index)} className="hover:text-[#D85C63] transition-colors p-1" aria-label="Decrease quantity"><Minus size={16} /></button>
                                                    <span className="font-bold w-6 text-center text-sm">{item.quantity}</span>
                                                    <button onClick={() => updateQuantity(productId, item.quantity + 1, index)} className="hover:text-[#D85C63] transition-colors p-1" aria-label="Increase quantity"><Plus size={16} /></button>
                                                </div>
                                                <button 
                                                    onClick={() => removeItem(productId, index)} 
                                                    className="p-2 text-gray-400 hover:text-red-500 transition-colors sm:relative absolute top-2 right-2 sm:top-auto sm:right-auto"
                                                    aria-label="Remove item"
                                                >
                                                    <Trash2 size={20} />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                } catch (e) {
                                    console.error('Error rendering cart item:', e, item);
                                    return null;
                                }
                            })}
                        </div>
                        
                        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 h-fit lg:sticky lg:top-32 w-full max-w-lg mx-auto lg:max-w-none">
                            <h3 className="text-xl md:text-2xl mb-6 font-medium border-b border-gray-50 pb-4">Order Summary</h3>
                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between text-gray-600 text-sm md:text-base">
                                    <span>Subtotal</span>
                                    <span className="font-medium text-gray-900">₹{total}</span>
                                </div>
                                <div className="flex justify-between text-gray-600 text-sm md:text-base">
                                    <span>Shipping</span>
                                    <span className="text-green-600 font-bold">FREE</span>
                                </div>
                                <div className="border-t border-gray-100 pt-4 flex justify-between text-lg md:text-xl font-bold">
                                    <span>Total</span>
                                    <span className="text-[#D85C63]">₹{total}</span>
                                </div>
                            </div>
                            <button 
                                onClick={() => navigate('/checkout')}
                                className="w-full bg-[#D85C63] text-white py-4 rounded-2xl text-base md:text-lg font-bold hover:bg-[#d1535a] transition-all shadow-[0_8px_20px_rgba(216,92,99,0.2)] active:scale-[0.98]"
                            >
                                Proceed to Checkout
                            </button>
                        </div>
                    </div>
                )}
    </section>
</PageWrapper>
);
};

export default CartPage;
