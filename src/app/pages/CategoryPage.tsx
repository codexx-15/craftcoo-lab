import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import API from '../api';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

import PageWrapper from '../components/PageWrapper';

const CategoryPage = () => {
    const { category } = useParams();
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
                                    <p className="text-2xl text-[#D85C63] mb-5">
                                        ₹{product.price}
                                    </p>
                                    
                                    <button 
                                        className="w-full bg-[#D85C63] text-white py-3 px-6 rounded-full transition-all duration-300 hover:bg-[#d1535a] shadow-[0_8px_18px_rgba(216,92,99,0.35)]"
                                    >
                                        View Details
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

export default CategoryPage;
