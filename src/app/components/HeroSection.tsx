import { useState, useEffect } from 'react';

const heroImage = '/images/hero1.png';
const heroImage2 = '/images/hero2.png';

export function HeroSection() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = [heroImage, heroImage2];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 6000); // Change image every 6 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <div 
        className="relative rounded-3xl overflow-hidden shadow-lg"
        style={{
          minHeight: '500px'
        }}
      >
        {/* Sliding Images */}
        {images.map((image, index) => (
          <div
            key={index}
            className="absolute inset-0 transition-transform duration-1000 ease-in-out"
            style={{
              transform: `translateX(${(index - currentImageIndex) * 100}%)`,
              backgroundImage: `url(${image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
        ))}
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-black/20" />
        
        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center text-white px-8 py-32">
          <h2 className="text-6xl mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
            #ART COLLECTION
          </h2>
          <p className="text-xl max-w-xl leading-relaxed opacity-95">
            Handmade paintings & creative prints you'll love
          </p>
        </div>
      </div>
    </section>
  );
}