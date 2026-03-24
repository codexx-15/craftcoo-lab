import { MessageCircle, Mail } from 'lucide-react';

export function ConnectSection() {
  return (
    <section className="py-10 md:py-20">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <h2 className="text-2xl md:text-4xl text-center mb-8 md:mb-12" style={{ fontFamily: "'Playfair Display', serif" }}>
          Connect With Us
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
          <div 
            onClick={() => window.dispatchEvent(new CustomEvent('openChat'))}
            className="bg-white rounded-2xl p-8 md:p-12 text-center shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer group border border-[#E6A8A8]/30"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-[#E6A8A8]/30 rounded-full mb-4 md:mb-6 group-hover:bg-[#E6A8A8]/50 transition-colors duration-300">
              <MessageCircle className="w-8 h-8 md:w-10 md:h-10 text-[#D85C63]" />
            </div>
            <h3 className="text-xl md:text-2xl mb-2 md:mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              Chat With Us
            </h3>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed">
              Get instant support from our friendly team
            </p>
          </div>
          
          <a 
            href="mailto:craftcoo.lab@gmail.com"
            className="bg-white rounded-2xl p-8 md:p-12 text-center shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer group border border-[#E6A8A8]/30 block"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-[#E6A8A8]/30 rounded-full mb-4 md:mb-6 group-hover:bg-[#E6A8A8]/50 transition-colors duration-300">
              <Mail className="w-8 h-8 md:w-10 md:h-10 text-[#D85C63]" />
            </div>
            <h3 className="text-xl md:text-2xl mb-2 md:mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              Email Us
            </h3>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed">
              We'll respond to your inquiry within 24 hours
            </p>
          </a>
        </div>
      </div>
    </section>
  );
}
