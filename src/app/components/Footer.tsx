export function Footer() {
    return (
      <footer className="bg-[#D85C63] text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-4 gap-12 mb-12">
            {/* About */}
            <div>
              <h3 className="text-xl mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                About craftco.lab
              </h3>
              <p className="text-white/90 leading-relaxed text-sm">
                We create handmade art pieces that bring beauty and creativity to your space. Every piece is crafted with love and attention to detail.
              </p>
            </div>
            
            {/* Quick Links */}
            <div>
              <h3 className="text-xl mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                Quick Links
              </h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <a href="#" className="text-white/90 hover:text-white transition-colors duration-300">
                    Categories
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/90 hover:text-white transition-colors duration-300">
                    Hot Deals
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/90 hover:text-white transition-colors duration-300">
                    Track Order
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/90 hover:text-white transition-colors duration-300">
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
            
            {/* Store Policy */}
            <div>
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
            
            {/* Newsletter */}
            <div>
              <h3 className="text-xl mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                Newsletter
              </h3>
              <p className="text-white/90 text-sm mb-4 leading-relaxed">
                Subscribe to get updates on new arrivals and exclusive offers.
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-4 py-2 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300"
                />
                <button 
                  className="px-6 py-2 bg-white text-[#D85C63] rounded-lg hover:bg-white/90 transition-all duration-300 hover:shadow-lg"
                >
                  Subscribe
                </button>
              </div>
            </div>
  
          </div>
          
          <div className="border-t border-white/20 pt-8 text-center text-sm text-white/80">
            <p>© 2026 craftco.lab. All rights reserved.</p>
          </div>
        </div>
      </footer>
    );
  }
  