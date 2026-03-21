import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import API from '../api';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useCart } from '../context/CartContext';
import { toast } from 'sonner';

import PageWrapper from '../components/PageWrapper';

const ProductPage = () => {
    const { id } = useParams();
    const { updateCartCount } = useCart();
    const [product, setProduct] = useState<any>(null);
    const [activeImage, setActiveImage] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [addingToCart, setAddingToCart] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const { data } = await API.get(`/products/id/${id}`);
                setProduct(data);
                setActiveImage(data.image);
            } catch (err) {
                setError('Failed to fetch product details');
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const addToCart = async () => {
        try {
            setAddingToCart(true);
            await API.post('/cart', { productId: id, quantity: 1 });
            await updateCartCount();
            toast.success(`${product.name} added to cart!`, {
                description: 'Check your cart to checkout.',
                position: 'bottom-right',
            });
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to add to cart');
        } finally {
            setAddingToCart(false);
        }
    };

    if (loading) return <div className="text-center py-20">Loading product details...</div>;
    if (error) return <div className="text-center py-20 text-red-500">{error}</div>;
    if (!product) return <div className="text-center py-20">Product not found.</div>;

    const allImages = [product.image, ...(product.images || [])];

    return (
        <PageWrapper>
            <section className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-6">
                        <div className="rounded-3xl overflow-hidden shadow-lg aspect-square bg-white border border-gray-100">
                            <ImageWithFallback
                                src={activeImage}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        {allImages.length > 1 && (
                            <div className="grid grid-cols-4 gap-4">
                                {allImages.map((img, idx) => (
                                    <button 
                                        key={idx}
                                        onClick={() => setActiveImage(img)}
                                        className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${activeImage === img ? 'border-[#D85C63]' : 'border-transparent hover:border-gray-300'}`}
                                    >
                                        <img src={img} alt={`Angle ${idx + 1}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    
                    <div className="flex flex-col justify-center">
                        <div className="mb-2">
                            <span className="bg-[#D85C63]/10 text-[#D85C63] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">{product.category}</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                            {product.name}
                        </h2>
                        <p className="text-3xl text-[#D85C63] mb-8 font-semibold">
                            ₹{product.price}
                        </p>
                        <p className="text-gray-600 mb-8 leading-relaxed text-lg">
                            {product.description}
                        </p>
                        
                        <div className="flex items-center gap-4 mb-10">
                            <div className={`w-3 h-3 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                            <span className={`font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {product.stock > 0 ? `${product.stock} pieces available` : 'Currently out of stock'}
                            </span>
                        </div>
                        
                        <button 
                            onClick={addToCart}
                            disabled={product.stock === 0 || addingToCart}
                            className="w-full md:w-auto bg-[#D85C63] text-white py-4 px-12 rounded-full transition-all duration-300 hover:bg-[#d1535a] shadow-[0_8px_18px_rgba(216,92,99,0.35)] disabled:bg-gray-400 disabled:shadow-none font-bold text-lg"
                        >
                            {addingToCart ? 'Adding...' : (product.stock === 0 ? 'Out of Stock' : 'Add to Cart')}
                        </button>
                    </div>
                </div>
            </section>
        </PageWrapper>
    );
};

export default ProductPage;
