import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import API from '../api';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function FeaturedProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data } = await API.get('/products');
        setProducts(data.slice(0, 6)); // Display only 6 products
      } catch (err) {
        setError('Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) return <div className="text-center py-12">Loading products...</div>;
  if (error) return <div className="text-center py-12 text-red-500">{error}</div>;

  return (
    <section className="bg-[#E6A8A8]/20 py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <h2 className="text-3xl md:text-4xl text-center mb-8 md:mb-12" style={{ fontFamily: "'Playfair Display', serif" }}>
          Featured Products
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div 
              key={product._id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 group border border-[#E6A8A8]/30"
            >
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
                <Link to={`/product/${product._id}`}>
                  <h3 className="text-xl mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {product.name}
                  </h3>
                </Link>
                <p className="text-2xl text-[#D85C63] mb-5">
                  ₹{product.price}
                </p>
                
                <div className="relative">
                  <button 
                    onClick={async () => {
                      try {
                        await API.post('/cart', { productId: product._id, quantity: 1 });
                        alert('Added to cart!');
                      } catch (err: any) {
                        alert(err.response?.data?.message || 'Failed to add to cart');
                      }
                    }}
                    className="w-full bg-[#D85C63] text-white py-3 px-6 rounded-full transition-all duration-300 hover:bg-[#d1535a] shadow-[0_8px_18px_rgba(216,92,99,0.35)]"
                  >
                    Add to Cart
                  </button>
                  <div className="pointer-events-none absolute left-3 right-3 top-1 h-2 rounded-full bg-white/40 blur-[2px]" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
