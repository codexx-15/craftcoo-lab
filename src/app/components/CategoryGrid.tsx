import { Link } from 'react-router';
import { useState, useEffect } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import API from '../api';

export function CategoryGrid() {
  const [collections, setCollections] = useState<any[]>([]);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await API.get('/settings');
        setCollections(data.collections);
      } catch (err) {
        console.error('Failed to fetch collections:', err);
      }
    };
    fetchSettings();
  }, []);

  const displayCollections = collections.length > 0 ? collections : [
    { id: 1, title: 'Paintings', image: '/images/paintings.png', slug: 'paintings' },
    { id: 2, title: 'Custom Paintings', image: '/images/custom-paintings.png', slug: 'custom-paintings', isCustom: true },
    { id: 3, title: 'Bookmarks', image: '/images/bookmarks.png', slug: 'bookmarks' },
    { id: 4, title: 'Postcards', image: '/images/postcards.png', slug: 'postcards' }
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
      <h2 className="text-3xl md:text-4xl text-center mb-8 md:mb-12" style={{ fontFamily: "'Playfair Display', serif" }}>
        Explore Our Collections
      </h2>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {displayCollections.map((category, idx) => (
          <Link 
            to={category.isCustom ? '/custom-paintings' : `/category/${category.slug}`}
            key={category._id || idx}
            className="group relative rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-lg transition-all duration-500"
          >
            <div className="aspect-[3/4] relative">
              <ImageWithFallback
                src={category.image}
                alt={category.title}
                className="w-full h-full object-cover"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-[#D85C63]/0 group-hover:bg-[#D85C63]/40 transition-all duration-500" />
              
              {/* Title */}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
                <h3 className="text-white text-xl" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {category.title}
                </h3>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}