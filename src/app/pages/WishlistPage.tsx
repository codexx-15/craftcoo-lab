import React from 'react';
import { Link, useNavigate } from 'react-router';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import API from '../api';
import { Trash2, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';
import PageWrapper from '../components/PageWrapper';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

const WishlistPage = () => {
    const { wishlist, removeFromWishlist } = useWishlist();
    const { updateCartCount } = useCart();
    const navigate = useNavigate();

    const addToCart = async (product: any) => {
        try {
            await API.post('/cart', { productId: product._id, quantity: 1 });
            await updateCartCount();
            toast.success(`${product.name} added to cart!`, {
                description: 'Check your cart to checkout.',
                position: 'bottom-right',
            });
        } catch (err: any) {
            if (err.response?.status === 401) {
                navigate('/login');
            } else {
                toast.error(err.response?.data?.message || 'Failed to add to cart');
            }
        }
    };

    return (
        <PageWrapper>
            <section className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-20">
                <h2 className="text-4xl mb-12" style={{ fontFamily: "'Playfair Display', serif" }}>Your Wishlist</h2>
                
                {wishlist.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                        <p className="text-xl text-gray-500 mb-8">Your wishlist is empty.</p>
                        <Link to="/" className="bg-[#D85C63] text-white py-3 px-10 rounded-full hover:bg-[#d1535a] transition-all">
                            Explore Products
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {wishlist.map((product) => (
                            <div key={product._id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 group border border-[#E6A8A8]/30">
                                <Link to={`/product/${product._id}`}>
                                    <div className="aspect-square relative overflow-hidden">
                                        <ImageWithFallback
                                            src={product.image}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                    </div>
                                </Link>
                                
                                <div className="p-6">
                                    <h3 className="text-xl mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
                                        {product.name}
                                    </h3>
                                    <p className="text-2xl text-[#D85C63] mb-5 font-semibold">
                                        ₹{product.price}
                                    </p>
                                    
                                    <div className="flex items-center gap-3">
                                        <button 
                                            onClick={() => removeFromWishlist(product._id)}
                                            className="flex items-center justify-center w-12 h-12 rounded-full border border-gray-100 bg-white shadow-sm hover:text-red-500 transition-all duration-300"
                                            title="Remove from wishlist"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>

                                        <button 
                                            onClick={() => addToCart(product)}
                                            className="flex-1 flex items-center justify-center gap-2 bg-[#D85C63] text-white py-3 px-4 rounded-2xl font-semibold hover:bg-[#d1535a] transition-all duration-300 shadow-md"
                                        >
                                            <ShoppingBag className="w-5 h-5" />
                                            <span>Add to Cart</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </PageWrapper>
    );
};

export default WishlistPage;
