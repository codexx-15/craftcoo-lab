import { Search, User, Heart, ShoppingCart } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-black/5 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Logo */}
        <div className="flex items-center justify-center mb-8">
          <h1 
            className="text-4xl tracking-wide"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            craftco.lab
          </h1>
        </div>
        
        {/* Navigation and Icons */}
        <div className="flex items-center justify-between">
          {/* Empty space for balance */}
          <div className="w-[140px]"></div>
          
          {/* Navigation - Centered */}
          <nav>
            <ul className="flex items-center gap-8 text-sm">
              <li>
                <a href="#" className="hover:text-[#D85C63] transition-colors duration-300">
                  Categories
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#D85C63] transition-colors duration-300">
                  Store
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#D85C63] transition-colors duration-300">
                  Track Order
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#D85C63] transition-colors duration-300">
                  Contact Us
                </a>
              </li>
            </ul>
          </nav>
          
          {/* Icons - Right Corner */}
          <div className="flex items-center gap-5">
            <button className="hover:text-[#D85C63] transition-colors duration-300" aria-label="Search">
              <Search className="w-5 h-5" />
            </button>
            <button className="hover:text-[#D85C63] transition-colors duration-300" aria-label="User Login">
              <User className="w-5 h-5" />
            </button>
            <button className="hover:text-[#D85C63] transition-colors duration-300" aria-label="Wishlist">
              <Heart className="w-5 h-5" />
            </button>
            <button className="hover:text-[#D85C63] transition-colors duration-300" aria-label="Cart">
              <ShoppingCart className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}