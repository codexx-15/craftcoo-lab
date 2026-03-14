import { ImageWithFallback } from './figma/ImageWithFallback';

const paintingsImage = '/images/paintings.png';
const customPaintingsImage = '/images/custom-paintings.png';
const postcardsImage = '/images/postcards.png';
const bookmarksImage = '/images/bookmarks.png';

const categories = [
  {
    id: 1,
    title: 'Paintings',
    image: paintingsImage
  },
  {
    id: 2,
    title: 'Custom Paintings',
    image: customPaintingsImage
  },
  {
    id: 3,
    title: 'Bookmarks',
    image: bookmarksImage
  },
  {
    id: 4,
    title: 'Postcards',
    image: postcardsImage
  }
];

export function CategoryGrid() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <h2 className="text-4xl text-center mb-12" style={{ fontFamily: "'Playfair Display', serif" }}>
        Explore Our Collections
      </h2>
      
      <div className="grid grid-cols-4 gap-6">
        {categories.map((category) => (
          <div 
            key={category.id}
            className="group relative rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-500"
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
          </div>
        ))}
      </div>
    </section>
  );
}