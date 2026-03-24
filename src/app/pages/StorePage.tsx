import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router';
import API from '../api';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Heart, Search, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { toast } from 'sonner';

import PageWrapper from '../components/PageWrapper';

const StorePage = () => {
    const [searchParams] = useSearchParams();
    const minPrice = searchParams.get('minPrice');
    const isLimitedEdition = searchParams.get('isLimitedEdition');
    const searchQuery = searchParams.get('search');

    const { updateCartCount } = useCart();
    const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const params: any = {};
                if (minPrice) params.minPrice = minPrice;
                if (isLimitedEdition) params.isLimitedEdition = isLimitedEdition;
                if (searchQuery) params.keyword = searchQuery;

                const { data } = await API.get('/products', { params });
                setProducts(data);
            } catch (err) {
                setError('Failed to fetch products');
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [minPrice, isLimitedEdition, searchQuery]);

    const handleWishlistToggle = (e: React.MouseEvent, product: any) => {
        e.preventDefault();
        if (isInWishlist(product._id)) {
            removeFromWishlist(product._id);
            toast('Removed from wishlist');
        } else {
            addToWishlist({
                _id: product._id,
                name: product.name,
                price: product.price,
                image: product.image,
                category: product.category
            });
            toast.success('Added to wishlist');
        }
    };

    const addToCart = async (e: React.MouseEvent, product: any) => {
        e.preventDefault();
        try {
            await API.post('/cart', { productId: product._id, quantity: 1 });
            await updateCartCount();
            toast.success(`${product.name} added to cart!`);
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to add to cart');
        }
    };

    if (loading) return <div className="text-center py-20">Loading products...</div>;
    if (error) return <div className="text-center py-20 text-red-500">{error}</div>;

    const pageTitle = isLimitedEdition === 'true' 
        ? 'Limited Edition Art Drops' 
        : minPrice 
            ? `Products Above ₹${minPrice}` 
            : searchQuery 
                ? `Search Results for "${searchQuery}"`
                : 'Our Collection';

    return (
        <PageWrapper>
            <section className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-20">
                <h2 className="text-3xl md:text-4xl text-center mb-12 capitalize" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {pageTitle}
                </h2>

                {products.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                        <p className="text-xl text-gray-500">No products found matching these criteria.</p>
                        <Link to="/" className="text-[#D85C63] font-bold mt-4 inline-block hover:underline">Back to Home</Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {products.map((product) => (
                            <Link 
                                to={`/product/${product._id}`} 
                                key={product._id}
                                className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 group border border-gray-100 flex flex-col"
                            >
                                <div className="aspect-square relative overflow-hidden bg-gray-50">
                                    <ImageWithFallback
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                    {product.isLimitedEdition && (
                                        <div className="absolute top-4 left-4 bg-[#D85C63] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
                                            Limited Drop
                                        </div>
                                    )}
                                    <button 
                                        onClick={(e) => handleWishlistToggle(e, product)}
                                        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/80 backdrop-blur-md shadow-sm flex items-center justify-center hover:bg-white hover:scale-110 transition-all group/heart"
                                    >
                                        <Heart className={`w-5 h-5 ${isInWishlist(product._id) ? 'fill-[#D85C63] text-[#D85C63]' : 'text-gray-400 group-hover/heart:text-[#D85C63]'}`} />
                                    </button>
                                </div>
                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-xl font-medium text-gray-800" style={{ fontFamily: "'Playfair Display', serif" }}>{product.name}</h3>
                                        <span className="text-[#D85C63] font-bold text-lg">₹{product.price}</span>
                                    </div>
                                    <p className="text-gray-500 text-sm line-clamp-2 mb-6 flex-1">{product.description}</p>
                                    <button 
                                        onClick={(e) => addToCart(e, product)}
                                        className="w-full bg-gray-900 text-white py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-[#D85C63] transition-all duration-300 shadow-sm"
                                    >
                                        <ShoppingBag size={18} /> Add to Cart
                                    </button>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </section>
        </PageWrapper>
    );
};

export default StorePage;
