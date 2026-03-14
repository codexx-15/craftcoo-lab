import { MessageCircle, Mail } from 'lucide-react';

export function ConnectSection() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <h2 className="text-4xl text-center mb-12" style={{ fontFamily: "'Playfair Display', serif" }}>
        Connect With Us
      </h2>
      
      <div className="grid grid-cols-2 gap-8">
        <div 
          className="bg-white rounded-2xl p-12 text-center shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer group border border-[#E6A8A8]/30"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[#E6A8A8]/30 rounded-full mb-6 group-hover:bg-[#E6A8A8]/50 transition-colors duration-300">
            <MessageCircle className="w-10 h-10 text-[#D85C63]" />
          </div>
          <h3 className="text-2xl mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Chat With Us
          </h3>
          <p className="text-gray-600 leading-relaxed">
            Get instant support from our friendly team
          </p>
        </div>
        
        <div 
          className="bg-white rounded-2xl p-12 text-center shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer group border border-[#E6A8A8]/30"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[#E6A8A8]/30 rounded-full mb-6 group-hover:bg-[#E6A8A8]/50 transition-colors duration-300">
            <Mail className="w-10 h-10 text-[#D85C63]" />
          </div>
          <h3 className="text-2xl mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Email Us
          </h3>
          <p className="text-gray-600 leading-relaxed">
            We'll respond to your inquiry within 24 hours
          </p>
        </div>
      </div>
    </section>
  );
}
