import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import API from '../api';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Heart, ShoppingBag, Search, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { toast } from 'sonner';

import PageWrapper from '../components/PageWrapper';

const CategoryPage = () => {
    const { category } = useParams();
    const { updateCartCount } = useCart();
    const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const { data } = await API.get(`/products/category/${category}`);
                setProducts(data);
                setSearchQuery(''); // Reset search when category changes
            } catch (err) {
                setError('Failed to fetch products');
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [category]);

    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
                <h2 className="text-3xl md:text-4xl text-center mb-4 capitalize" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {category} Collections
                </h2>

                {/* Search Bar */}
                <div className="max-w-2xl mx-auto mb-12 relative group">
                    <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#D85C63] transition-colors">
                        <Search size={20} />
                    </div>
                    <input 
                        type="text" 
                        placeholder={`Search in ${category}...`}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-14 pr-12 py-5 bg-white rounded-2xl shadow-sm border border-gray-100 focus:outline-none focus:ring-2 focus:ring-[#D85C63]/20 focus:border-[#D85C63]/30 transition-all text-lg font-medium"
                    />
                    {searchQuery && (
                        <button 
                            onClick={() => setSearchQuery('')}
                            className="absolute inset-y-0 right-0 pr-6 flex items-center text-gray-400 hover:text-[#D85C63] transition-colors"
                        >
                            <X size={20} />
                        </button>
                    )}
                </div>
                
                {products.length === 0 ? (
                    <div className="text-center py-10">No products found in this category.</div>
                ) : filteredProducts.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                        <Search size={48} className="mx-auto text-gray-200 mb-4" />
                        <p className="text-xl text-gray-500 font-medium mb-2">No matching products found</p>
                        <p className="text-gray-400">Try adjusting your search terms or clearing the filter.</p>
                        <button 
                            onClick={() => setSearchQuery('')}
                            className="mt-6 text-[#D85C63] font-bold hover:underline underline-offset-4"
                        >
                            Clear search filter
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredProducts.map((product: any) => (
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
