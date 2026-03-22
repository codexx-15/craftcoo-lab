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
            setCart(data);
        } catch (err: any) {
            if (err.response?.status === 401) {
                navigate('/login');
            } else {
                setError('Failed to fetch cart');
            }
        } finally {
            setLoading(false);
        }
    };

    const updateQuantity = async (productId: string, quantity: number) => {
        if (quantity < 1) return;
        try {
            const { data } = await API.put('/cart', { productId, quantity });
            setCart(data);
            await updateCartCount();
        } catch (err) {
            toast.error('Failed to update quantity');
        }
    };

    const removeItem = async (productId: string) => {
        try {
            const { data } = await API.delete(`/cart/${productId}`);
            setCart(data);
            await updateCartCount();
            toast.success('Item removed from cart');
        } catch (err) {
            toast.error('Failed to remove item');
        }
    };

    if (loading) return <div className="text-center py-20">Loading cart...</div>;
    if (error) return <div className="text-center py-20 text-red-500">{error}</div>;

    const total = cart?.items.reduce((acc: number, item: any) => {
        const itemPrice = item.isCustom ? item.price : item.product.price;
        return acc + itemPrice * item.quantity;
    }, 0) || 0;

    return (
        <PageWrapper>
            <section className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-20">
                <h2 className="text-4xl mb-12" style={{ fontFamily: "'Playfair Display', serif" }}>Your Cart</h2>
                
                {cart?.items.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                        <p className="text-xl text-gray-500 mb-8">Your cart is empty.</p>
                        <Link to="/" className="bg-[#D85C63] text-white py-3 px-10 rounded-full hover:bg-[#d1535a] transition-all">
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        <div className="lg:col-span-2 space-y-6">
                            {cart?.items.map((item: any, index: number) => (
                                <div key={item.product._id + (item.isCustom ? index : '')} className="flex items-center gap-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                    <img src={item.isCustom ? item.customDetails.referenceImage : item.product.image} alt={item.product.name} className="w-24 h-24 object-cover rounded-xl" />
                                    <div className="flex-1">
                                        <h3 className="text-xl font-medium mb-1">
                                            {item.isCustom ? `Custom ${item.customDetails.type} Painting` : item.product.name}
                                        </h3>
                                        {item.isCustom && (
                                            <div className="text-xs text-gray-400 space-y-1 mb-2">
                                                <p>{item.customDetails.style} • {item.customDetails.size}</p>
                                                <p className="italic line-clamp-1">"{item.customDetails.description}"</p>
                                            </div>
                                        )}
                                        <p className="text-[#D85C63] font-semibold">₹{item.isCustom ? item.price : item.product.price}</p>
                                    </div>
                                    <div className="flex items-center gap-4 bg-gray-50 px-4 py-2 rounded-full">
                                        <button onClick={() => updateQuantity(item.product._id, item.quantity - 1)} className="hover:text-[#D85C63]"><Minus size={18} /></button>
                                        <span className="font-medium w-6 text-center">{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.product._id, item.quantity + 1)} className="hover:text-[#D85C63]"><Plus size={18} /></button>
                                    </div>
                                    <button onClick={() => removeItem(item.product._id)} className="text-gray-400 hover:text-red-500 transition-colors">
                                        <Trash2 size={22} />
                                    </button>
                                </div>
                            ))}
                        </div>
                        
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 h-fit sticky top-32">
                            <h3 className="text-2xl mb-6 font-medium">Order Summary</h3>
                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span>₹{total}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping</span>
                                    <span className="text-green-600 font-medium">Free</span>
                                </div>
                                <div className="border-t border-gray-100 pt-4 flex justify-between text-xl font-semibold">
                                    <span>Total</span>
                                    <span className="text-[#D85C63]">₹{total}</span>
                                </div>
                            </div>
                            <button 
                                onClick={() => navigate('/checkout')}
                                className="w-full bg-[#D85C63] text-white py-4 rounded-full text-lg font-semibold hover:bg-[#d1535a] transition-all shadow-lg"
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
