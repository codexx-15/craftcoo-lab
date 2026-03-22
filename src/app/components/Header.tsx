import { Search, User, Heart, ShoppingCart, Menu, LogOut, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import API from '../api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export function Header() {
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const { wishlist } = useWishlist();
  const userInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')!) : null;

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchTerm.length >= 1) {
        try {
          setIsSearching(true);
          const { data } = await API.get(`/products?keyword=${searchTerm}`);
          setSearchResults(data.slice(0, 5)); // Show top 5 results
        } catch (err) {
          console.error('Search failed:', err);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    navigate('/login');
    window.location.reload();
  };

  const closeSearch = () => {
    setIsSearchOpen(false);
    setSearchTerm('');
    setSearchResults([]);
  };

  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-black/5 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 md:py-6">
        {/* Search Overlay - Mobile & Desktop */}
        {isSearchOpen && (
          <div className="absolute inset-0 bg-white z-50 flex items-center px-6">
            <div className="flex-1 flex items-center gap-4 max-w-3xl mx-auto relative">
              <Search className="w-6 h-6 text-gray-400" />
              <input 
                autoFocus
                type="text" 
                placeholder="Search products, categories, or styles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 text-xl outline-none py-2 border-b-2 border-[#D85C63]/30 focus:border-[#D85C63] transition-all"
              />
              <button onClick={closeSearch} className="hover:text-[#D85C63] transition-colors">
                <X className="w-6 h-6" />
              </button>

              {/* Live Search Results Dropdown */}
              {(searchResults.length > 0 || isSearching) && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-100 z-50">
                  {isSearching ? (
                    <div className="p-4 text-center text-gray-500 italic">Searching...</div>
                  ) : (
                    <div className="divide-y divide-gray-50">
                      {searchResults.map((product: any) => (
                        <Link 
                          to={`/product/${product._id}`} 
                          key={product._id} 
                          onClick={closeSearch}
                          className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors group"
                        >
                          <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded-lg" />
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-800 group-hover:text-[#D85C63] transition-colors">{product.name}</h4>
                            <p className="text-sm text-gray-400 capitalize">{product.category}</p>
                          </div>
                          <span className="font-bold text-[#D85C63]">₹{product.price}</span>
                        </Link>
                      ))}
                      <Link 
                        to={`/store?search=${searchTerm}`} 
                        onClick={closeSearch}
                        className="block p-4 text-center text-sm font-semibold text-[#D85C63] hover:bg-gray-50"
                      >
                        View all results for "{searchTerm}"
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Logo - Responsive sizes */}
        <div className="flex items-center justify-between md:justify-center mb-4 md:mb-8">
          <button className="md:hidden hover:text-[#D85C63] transition-colors" aria-label="Menu">
            <Menu className="w-6 h-6" />
          </button>
          
          <Link to="/">
            <h1 
              className="text-2xl md:text-4xl tracking-wide"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              craftco.lab
            </h1>
          </Link>

          <div className="flex md:hidden items-center gap-3">
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="hover:text-[#D85C63] transition-colors" 
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
            <Link to="/cart" className="hover:text-[#D85C63] transition-colors relative" aria-label="Cart">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#D85C63] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-in zoom-in duration-300">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
        
        {/* Navigation and Icons - Desktop Only */}
        <div className="hidden md:flex items-center justify-between">
          {/* User Name for balance */}
          <div className="w-[140px] text-sm text-gray-500 italic">
            {userInfo ? `Hi, ${userInfo.name.split(' ')[0]}` : ''}
          </div>
          
          {/* Navigation - Centered */}
          <nav>
            <ul className="flex items-center gap-4 lg:gap-8 text-sm">
              <li>
                <Link to="/category/paintings" className="hover:text-[#D85C63] transition-colors duration-300">
                  Categories
                </Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-[#D85C63] transition-colors duration-300 whitespace-nowrap">
                  My Orders
                </Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-[#D85C63] transition-colors duration-300 whitespace-nowrap">
                  Track Order
                </Link>
              </li>
              <li>
                <a href="mailto:craftcoo.lab@gmail.com" className="hover:text-[#D85C63] transition-colors duration-300 whitespace-nowrap">
                  Contact Us
                </a>
              </li>
              {userInfo?.isAdmin && (
                <li>
                  <Link to="/admin" className="hover:text-[#D85C63] transition-colors duration-300 font-bold">
                    Admin Panel
                  </Link>
                </li>
              )}
            </ul>
          </nav>
          
          {/* Icons - Right Corner */}
          <div className="flex items-center gap-5">
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="hover:text-[#D85C63] transition-colors duration-300" 
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
            
            {userInfo ? (
              <button onClick={handleLogout} className="hover:text-[#D85C63] transition-colors duration-300" title="Logout">
                <LogOut className="w-5 h-5" />
              </button>
            ) : (
              <Link to="/login" className="hover:text-[#D85C63] transition-colors duration-300" aria-label="User Login">
                <User className="w-5 h-5" />
              </Link>
            )}

            <button 
              onClick={() => navigate('/wishlist')}
              className="hover:text-[#D85C63] transition-colors duration-300 relative" 
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-2.5 -right-2.5 bg-[#D85C63] text-white text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 border-white animate-in zoom-in duration-300">
                  {wishlist.length}
                </span>
              )}
            </button>
            <Link to="/cart" className="hover:text-[#D85C63] transition-colors duration-300 relative" aria-label="Cart">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-2.5 -right-2.5 bg-[#D85C63] text-white text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 border-white animate-in zoom-in duration-300">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
