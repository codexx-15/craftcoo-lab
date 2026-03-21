import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import API from '../api';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { toast } from 'sonner';
import { Heart, ShoppingBag } from 'lucide-react';

export function FeaturedProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const { updateCartCount } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
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

  const handleWishlistToggle = (product: any) => {
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
                <p className="text-2xl text-[#D85C63] mb-5 font-semibold">
                  ₹{product.price}
                </p>
                
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => handleWishlistToggle(product)}
                    className="flex items-center justify-center w-12 h-12 rounded-full border border-gray-100 bg-white shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300 group/wish"
                    aria-label="Add to wishlist"
                  >
                    <Heart 
                      className={`w-5 h-5 transition-colors duration-300 ${isInWishlist(product._id) ? 'fill-[#D85C63] text-[#D85C63]' : 'text-gray-400 group-hover/wish:text-[#D85C63]'}`} 
                    />
                  </button>

                  <button 
                    onClick={async () => {
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
                    }}
                    className="flex-1 flex items-center justify-center gap-2 bg-[#D85C63] text-white py-3 px-4 rounded-2xl font-semibold hover:bg-[#d1535a] hover:scale-[1.02] transition-all duration-300 shadow-[0_8px_18px_rgba(216,92,99,0.25)] hover:shadow-[0_10px_22px_rgba(216,92,99,0.35)]"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
