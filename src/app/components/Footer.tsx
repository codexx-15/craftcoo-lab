import { Link } from "react-router";

export function Footer() {
    return (
      <footer className="bg-[#D85C63] text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between gap-12 mb-12 text-center md:text-left">
            {/* About */}
            <div className="max-w-sm mx-auto md:mx-0">
              <h3 className="text-xl mb-6 font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
                About craftco.lab
              </h3>
              <p className="text-white/90 leading-relaxed text-sm">
                We create handmade art pieces that bring beauty and creativity to your space. Every piece is crafted with love and attention to detail.
              </p>
            </div>
            
            {/* Quick Links */}
            <div className="md:text-center">
              <h3 className="text-xl mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                Quick Links
              </h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link to="/category/paintings" className="text-white/90 hover:text-white transition-colors duration-300">
                    Categories
                  </Link>
                </li>
                <li>
                  <Link to="/store" className="text-white/90 hover:text-white transition-colors duration-300">
                    Store
                  </Link>
                </li>
                <li>
                  <Link to="/orders" className="text-white/90 hover:text-white transition-colors duration-300">
                    Track Order
                  </Link>
                </li>
                <li>
                  <a href="mailto:craftcoo.lab@gmail.com" className="text-white/90 hover:text-white transition-colors duration-300">
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
            
            {/* Store Policy */}
            <div className="md:text-right">
              <h3 className="text-xl mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                Store Policy
              </h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <a href="#" className="text-white/90 hover:text-white transition-colors duration-300">
                    Shipping Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/90 hover:text-white transition-colors duration-300">
                    Returns & Exchange
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/90 hover:text-white transition-colors duration-300">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/90 hover:text-white transition-colors duration-300">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/20 pt-8 text-center text-sm text-white/80">
            <p>© 2026 craftco.lab. All rights reserved.</p>
          </div>
        </div>
      </footer>
    );
  }
  