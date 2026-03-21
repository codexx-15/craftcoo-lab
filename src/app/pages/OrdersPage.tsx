import React, { useEffect, useState } from 'react';
import API from '../api';

import PageWrapper from '../components/PageWrapper';

const OrdersPage = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                const { data } = await API.get('/orders');
                setOrders(data);
            } catch (err: any) {
                setError(err.response?.data?.message || 'Failed to fetch orders');
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    if (loading) return <div className="text-center py-20">Loading your orders...</div>;
    if (error) return <div className="text-center py-20 text-red-500">{error}</div>;

    return (
        <PageWrapper>
            <section className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-20">
                <h2 className="text-4xl mb-12" style={{ fontFamily: "'Playfair Display', serif" }}>Your Orders</h2>
                
                {orders.length === 0 ? (
                    <div className="text-center py-10 bg-white rounded-2xl border border-dashed border-gray-300">
                        <p className="text-xl text-gray-500">You have no orders yet.</p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {orders.map((order) => (
                            <div key={order._id} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                                <div className="flex flex-col md:flex-row justify-between mb-8 border-b border-gray-100 pb-6 gap-6">
                                    <div className="space-y-1">
                                        <p className="text-sm text-gray-400 font-medium">ORDER ID</p>
                                        <p className="font-mono text-gray-700">{order._id}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm text-gray-400 font-medium">DATE</p>
                                        <p className="text-gray-700">{new Date(order.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm text-gray-400 font-medium">TOTAL AMOUNT</p>
                                        <p className="text-[#D85C63] font-bold text-xl">₹{order.totalAmount}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm text-gray-400 font-medium">STATUS</p>
                                        <span className={`px-4 py-1.5 rounded-full text-sm font-semibold inline-block ${
                                            order.orderStatus === 'Delivered' ? 'bg-green-100 text-green-700' :
                                            order.orderStatus === 'Shipped' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                            {order.orderStatus}
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="space-y-6">
                                    {order.products.map((item: any) => (
                                        <div key={item.product._id} className="flex items-center gap-6">
                                            <img src={item.product.image} alt={item.product.name} className="w-20 h-20 object-cover rounded-xl border border-gray-100" />
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-medium text-lg truncate text-gray-800">{item.product.name}</h4>
                                                <p className="text-gray-500">Quantity: {item.quantity} × ₹{item.price}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                
                                <div className="mt-8 pt-6 border-t border-gray-100">
                                    <p className="text-sm text-gray-400 font-medium mb-2">SHIPPING ADDRESS</p>
                                    <p className="text-gray-600 text-sm italic">{order.shippingAddress}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </PageWrapper>
    );
};

export default OrdersPage;
