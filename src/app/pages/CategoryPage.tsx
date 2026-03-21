import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import API from '../api';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Heart, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { toast } from 'sonner';

import PageWrapper from '../components/PageWrapper';

const CategoryPage = () => {
    const { category } = useParams();
    const { updateCartCount } = useCart();
    const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const { data } = await API.get(`/products/category/${category}`);
                setProducts(data);
            } catch (err) {
                setError('Failed to fetch products');
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [category]);

    const handleWishlistToggle = (e: React.MouseEvent, product: any) => {
        e.preventDefault();
        if (isInWishlist(product._id)) {
            removeFromWishlist(product._id);
            toast('Removed from wishlist', {
                icon: <Heart className="w-4 h-4" />,
            });
        } else {
            addToWishlist({
                _id: product._id,
                name: product.name,
                price: product.price,
                image: product.image,
                category: product.category
            });
            toast.success('Added to wishlist', {
                icon: <Heart className="w-4 h-4 fill-[#D85C63] text-[#D85C63]" />,
            });
        }
    };

    const addToCart = async (e: React.MouseEvent, product: any) => {
        e.preventDefault();
        try {
            await API.post('/cart', { productId: product._id, quantity: 1 });
            await updateCartCount();
            toast.success(`${product.name} added to cart!`, {
                description: 'Check your cart to checkout.',
                position: 'bottom-right',
            });
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to add to cart');
        }
    };

    if (loading) return <div className="text-center py-20">Loading products...</div>;
    if (error) return <div className="text-center py-20 text-red-500">{error}</div>;

    return (
        <PageWrapper>
            <section className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-20">
                <h2 className="text-3xl md:text-4xl text-center mb-8 md:mb-12 capitalize" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {category} Collections
                </h2>
                
                {products.length === 0 ? (
                    <div className="text-center py-10">No products found in this category.</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {products.map((product: any) => (
                            <Link 
                                to={`/product/${product._id}`}
                                key={product._id}
                                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 group border border-[#E6A8A8]/30"
                            >
                                <div className="aspect-square relative overflow-hidden">
                                    <ImageWithFallback
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                </div>
                                
                                <div className="p-6">
                                    <h3 className="text-xl mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
                                        {product.name}
                                    </h3>
                                    <p className="text-2xl text-[#D85C63] mb-5 font-semibold">
                                        ₹{product.price}
                                    </p>
                                    
                                    <div className="flex items-center gap-3">
                                        <button 
                                            onClick={(e) => handleWishlistToggle(e, product)}
                                            className="flex items-center justify-center w-12 h-12 rounded-full border border-gray-100 bg-white shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300 group/wish"
                                            aria-label="Add to wishlist"
                                        >
                                            <Heart 
                                                className={`w-5 h-5 transition-colors duration-300 ${isInWishlist(product._id) ? 'fill-[#D85C63] text-[#D85C63]' : 'text-gray-400 group-hover/wish:text-[#D85C63]'}`} 
                                            />
                                        </button>

                                        <button 
                                            onClick={(e) => addToCart(e, product)}
                                            className="flex-1 flex items-center justify-center gap-2 bg-[#D85C63] text-white py-3 px-4 rounded-2xl font-semibold hover:bg-[#d1535a] hover:scale-[1.02] transition-all duration-300 shadow-[0_8px_18px_rgba(216,92,99,0.25)] hover:shadow-[0_10px_22px_rgba(216,92,99,0.35)]"
                                        >
                                            <ShoppingBag className="w-5 h-5" />
                                            <span>Add to Cart</span>
                                        </button>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </section>
        </PageWrapper>
    );
};

export default CategoryPage;
