import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import API from '../api';

import PageWrapper from '../components/PageWrapper';

const CheckoutPage = () => {
    const [address, setAddress] = useState('');
    const [cart, setCart] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const { data } = await API.get('/cart');
                setCart(data);
                if (data.items.length === 0) navigate('/');
            } catch (err) {
                navigate('/login');
            }
        };
        fetchCart();
    }, [navigate]);

    const handleCheckout = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            const total = cart.items.reduce((acc: number, item: any) => {
                const itemPrice = item.isCustom ? item.price : item.product.price;
                return acc + itemPrice * item.quantity;
            }, 0);

            const products = cart.items.map((item: any) => ({
                product: item.product._id,
                quantity: item.quantity,
                price: item.isCustom ? item.price : item.product.price,
                isCustom: item.isCustom || false,
                customDetails: item.customDetails || null
            }));

            const { data } = await API.post('/orders', { products, totalAmount: total, shippingAddress: address });
            
            const options = {
                key: 'your_razorpay_key_id', // This should be from .env but for frontend it's hardcoded for simplicity in this example
                amount: data.razorpayOrder.amount,
                currency: data.razorpayOrder.currency,
                name: 'craftco.lab',
                description: 'Purchase Payment',
                order_id: data.razorpayOrder.id,
                handler: async (response: any) => {
                    try {
                        await API.post('/orders/verify', {
                            razorpayOrderId: response.razorpay_order_id,
                            razorpayPaymentId: response.razorpay_payment_id,
                            razorpaySignature: response.razorpay_signature
                        });
                        alert('Order placed successfully!');
                        navigate('/orders');
                    } catch (err) {
                        alert('Payment verification failed');
                    }
                },
                prefill: {
                    name: JSON.parse(localStorage.getItem('userInfo')!).name,
                    email: JSON.parse(localStorage.getItem('userInfo')!).email
                },
                theme: {
                    color: '#D85C63'
                }
            };

            const rzp = new (window as any).Razorpay(options);
            rzp.open();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Checkout failed');
        } finally {
            setLoading(false);
        }
    };

    if (!cart) return <div className="text-center py-20">Loading checkout...</div>;

    const total = cart.items.reduce((acc: number, item: any) => {
        const itemPrice = item.isCustom ? item.price : item.product.price;
        return acc + itemPrice * item.quantity;
    }, 0);

    return (
        <PageWrapper>
            <section className="max-w-4xl mx-auto px-4 py-10 md:py-20">
                <h2 className="text-3xl md:text-4xl text-center mb-8 md:mb-12" style={{ fontFamily: "'Playfair Display', serif" }}>Checkout</h2>
                <div className="flex flex-col-reverse md:grid md:grid-cols-2 gap-8 md:gap-12">
                    <div className="bg-white p-6 md:p-0 rounded-2xl shadow-sm md:shadow-none border border-gray-100 md:border-none">
                        <h3 className="text-xl md:text-2xl mb-6 font-medium">Shipping Details</h3>
                        <form onSubmit={handleCheckout} className="space-y-6">
                            <div>
                                <label className="block text-sm md:text-base text-gray-700 mb-2 font-medium">Shipping Address</label>
                                <textarea 
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#D85C63]/50 min-h-[120px] md:min-h-[150px] text-sm md:text-base"
                                    placeholder="Enter your full address with PIN code"
                                    required
                                />
                            </div>
                            <button 
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#D85C63] text-white py-4 rounded-2xl text-base md:text-lg font-bold hover:bg-[#d1535a] transition-all shadow-lg disabled:bg-gray-400 active:scale-[0.98]"
                            >
                                {loading ? 'Processing...' : `Pay ₹${total}`}
                            </button>
                        </form>
                    </div>
                    
                    <div className="bg-gray-50 p-6 md:p-8 rounded-3xl h-fit border border-gray-100">
                        <h3 className="text-xl md:text-2xl mb-6 font-medium border-b border-gray-200 pb-4">Order Summary</h3>
                        <div className="space-y-4">
                            {cart.items.map((item: any, idx: number) => (
                                <div key={item.product?._id || idx} className="flex justify-between items-center text-gray-600 text-sm md:text-base">
                                    <span className="flex-1 truncate pr-4">{item.isCustom ? 'Custom Painting' : item.product?.name} (x{item.quantity})</span>
                                    <span className="font-medium text-gray-900">₹{(item.isCustom ? item.price : item.product?.price) * item.quantity}</span>
                                </div>
                            ))}
                            <div className="flex justify-between items-center text-gray-600 text-sm md:text-base">
                                <span>Shipping</span>
                                <span className="text-green-600 font-bold">FREE</span>
                            </div>
                            <div className="border-t border-gray-200 pt-4 flex justify-between text-lg md:text-xl font-bold mt-4">
                                <span>Total Amount</span>
                                <span className="text-[#D85C63]">₹{total}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </PageWrapper>
    );
};

export default CheckoutPage;
