import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, Camera, Palette, Maximize, Check, ArrowRight, ShoppingBag, Plus, Sparkles } from 'lucide-react';
import PageWrapper from '../components/PageWrapper';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useCart } from '../context/CartContext';
import { toast } from 'sonner';
import API from '../api';
import { useNavigate } from 'react-router';

const CustomPaintingPage = () => {
  const [step, setStep] = useState(0); // 0: Landing, 1: Type, 2: Form, 3: Preview/Price
  const { updateCartCount } = useCart();
  const navigate = useNavigate();

  const [customData, setCustomData] = useState({
    type: '',
    image: null as File | null,
    imagePreview: '',
    description: '',
    style: 'Realistic',
    size: 'A4',
    colorPreference: '',
    frame: false,
    extraCharacter: false,
    fastDelivery: false
  });

  const [price, setPrice] = useState(999);

  const types = [
    { id: 'portrait', title: 'Portrait Painting', icon: <User size={32} />, img: '/images/custom-paintings.png' },
    { id: 'pet', title: 'Pet Painting', icon: <Camera size={32} />, img: '/images/animal-canvas.png' },
    { id: 'landscape', title: 'Landscape', icon: <Palette size={32} />, img: '/images/ocean-vinyl.png' },
    { id: 'abstract', title: 'Abstract / Idea', icon: <Sparkles size={32} />, img: '/images/paintings.png' },
    { id: 'text', title: 'Text-based Art', icon: <Maximize size={32} />, img: '/images/postcards.png' }
  ];

  const styles = ['Realistic', 'Cartoon', 'Minimal', 'Oil Painting'];
  const sizes = { 'A4': 999, 'A3': 1499, 'Custom': 2499 };

  useEffect(() => {
    let basePrice = sizes[customData.size as keyof typeof sizes];
    if (customData.frame) basePrice += 499;
    if (customData.extraCharacter) basePrice += 299;
    if (customData.fastDelivery) basePrice += 199;
    setPrice(basePrice);
  }, [customData]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCustomData({ ...customData, image: file, imagePreview: URL.createObjectURL(file) });
    }
  };

  const addToCart = async () => {
    try {
      let imageUrl = '';
      if (customData.image) {
        const formData = new FormData();
        formData.append('image', customData.image);
        const { data: uploadData } = await API.post('/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        imageUrl = uploadData.url;
      }

      const orderData = {
        productId: '69bfda57f84fb4c721f9e6a8', // Valid Custom Painting ID
        quantity: 1,
        isCustom: true,
        price: price,
        customDetails: {
          type: customData.type,
          style: customData.style,
          size: customData.size,
          description: customData.description,
          referenceImage: imageUrl,
          frame: customData.frame,
          extraCharacter: customData.extraCharacter,
          fastDelivery: customData.fastDelivery
        }
      };
      
      await API.post('/cart', orderData);
      
      await updateCartCount();
      toast.success('Custom painting added to cart!');
      setStep(0);
      navigate('/cart'); // Go to cart directly
    } catch (err: any) {
      if (err.response?.status === 401) {
        toast.error('Please login to add to cart');
        navigate('/login');
      } else {
        toast.error('Failed to add to cart. Please try again.');
      }
    }
  };

  return (
    <PageWrapper>
      <div className="min-h-screen pb-20">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.section 
              key="landing"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="max-w-7xl mx-auto px-6 pt-16"
            >
              <div className="text-center mb-16">
                <motion.h2 
                  initial={{ y: 20 }} animate={{ y: 0 }}
                  className="text-5xl md:text-7xl mb-6 font-serif"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Turn Your Ideas into Art
                </motion.h2>
                <p className="text-gray-500 text-lg max-w-2xl mx-auto mb-10">
                  Beautiful, hand-painted memories tailored specifically for you. Choose a style, upload your photo, and let us create magic.
                </p>
                <button 
                  onClick={() => setStep(1)}
                  className="bg-[#D85C63] text-white py-4 px-12 rounded-full text-lg font-bold hover:bg-[#d1535a] transition-all shadow-xl flex items-center gap-3 mx-auto group"
                >
                  Create Your Painting
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {['/images/paintings.png', '/images/custom-paintings.png', '/images/animal-canvas.png', '/images/ocean-vinyl.png'].map((img, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="aspect-[3/4] rounded-3xl overflow-hidden shadow-lg group relative"
                  >
                    <img src={img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Sample" />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}

          {step === 1 && (
            <motion.section 
              key="select-type"
              initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}
              className="max-w-7xl mx-auto px-6 pt-16"
            >
              <h3 className="text-4xl text-center mb-12 font-serif">What should we paint for you?</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {types.map((t) => (
                  <button 
                    key={t.id}
                    onClick={() => { setCustomData({ ...customData, type: t.title }); setStep(2); }}
                    className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-[#D85C63]/30 transition-all duration-300 text-center group"
                  >
                    <div className="w-full aspect-square rounded-2xl overflow-hidden mb-6">
                      <img src={t.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={t.title} />
                    </div>
                    <h4 className="font-semibold text-lg">{t.title}</h4>
                  </button>
                ))}
              </div>
            </motion.section>
          )}

          {step === 2 && (
            <motion.section 
              key="form"
              initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}
              className="max-w-4xl mx-auto px-6 pt-16"
            >
              <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl border border-gray-50">
                <h3 className="text-3xl mb-8 font-serif">Tell us about your masterpiece</h3>
                
                <div className="space-y-8">
                  {/* Upload */}
                  <div>
                    <label className="block text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">Reference Image</label>
                    <div className="relative aspect-video rounded-3xl border-2 border-dashed border-gray-200 hover:border-[#D85C63] transition-colors overflow-hidden group">
                      {customData.imagePreview ? (
                        <img src={customData.imagePreview} className="w-full h-full object-cover" alt="Preview" />
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                          <Upload size={48} className="mb-4 group-hover:text-[#D85C63] transition-colors" />
                          <p>Drag & Drop or Click to Upload</p>
                        </div>
                      )}
                      <input type="file" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">Describe your idea</label>
                    <textarea 
                      placeholder="E.g. I want a sunset background with my dog sitting in the grass..."
                      className="w-full p-6 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-[#D85C63]/20 h-32 outline-none"
                      onChange={(e) => setCustomData({ ...customData, description: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">Painting Style</label>
                      <select 
                        className="w-full p-4 rounded-xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-[#D85C63]/20"
                        onChange={(e) => setCustomData({ ...customData, style: e.target.value })}
                      >
                        {styles.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">Size Selection</label>
                      <div className="flex gap-3">
                        {Object.keys(sizes).map(s => (
                          <button 
                            key={s}
                            onClick={() => setCustomData({ ...customData, size: s })}
                            className={`flex-1 py-3 rounded-xl font-bold transition-all ${customData.size === s ? 'bg-[#D85C63] text-white shadow-lg shadow-[#D85C63]/30' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => setStep(3)}
                    className="w-full bg-[#D85C63] text-white py-5 rounded-2xl text-xl font-bold hover:bg-[#d1535a] transition-all shadow-xl"
                  >
                    Preview & Pricing
                  </button>
                </div>
              </div>
            </motion.section>
          )}

          {step === 3 && (
            <motion.section 
              key="preview"
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              className="max-w-6xl mx-auto px-6 pt-16"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-[2.5rem] shadow-xl border border-gray-50 overflow-hidden">
                    <h4 className="text-xl font-bold mb-6 flex items-center gap-2">
                      <Sparkles className="text-[#D85C63]" /> Style Preview
                    </h4>
                    <div className="aspect-square rounded-3xl overflow-hidden bg-gray-100">
                      {/* Show reference images based on style */}
                      <ImageWithFallback 
                        src={customData.imagePreview || `/images/paintings.png`} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="mt-6 text-gray-500 italic text-center">
                      Your painting will be created in the <span className="text-[#D85C63] font-bold underline">{customData.style}</span> style.
                    </p>
                  </div>
                </div>

                <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl border border-gray-50 flex flex-col">
                  <h4 className="text-3xl mb-8 font-serif">Order Summary</h4>
                  
                  <div className="space-y-6 flex-1">
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl">
                      <div>
                        <p className="font-bold text-lg">{customData.type}</p>
                        <p className="text-sm text-gray-400">{customData.style} • {customData.size}</p>
                      </div>
                      <p className="text-2xl font-bold text-[#D85C63]">₹{sizes[customData.size as keyof typeof sizes]}</p>
                    </div>

                    <div className="space-y-4">
                      <label className="flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all border-gray-50 hover:bg-gray-50">
                        <input type="checkbox" checked={customData.frame} onChange={(e) => setCustomData({ ...customData, frame: e.target.checked })} className="w-6 h-6 rounded accent-[#D85C63]" />
                        <span className="flex-1 font-medium">Add Premium Frame</span>
                        <span className="font-bold text-[#D85C63]">+₹499</span>
                      </label>
                      <label className="flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all border-gray-50 hover:bg-gray-50">
                        <input type="checkbox" checked={customData.extraCharacter} onChange={(e) => setCustomData({ ...customData, extraCharacter: e.target.checked })} className="w-6 h-6 rounded accent-[#D85C63]" />
                        <span className="flex-1 font-medium">Extra Character/Object</span>
                        <span className="font-bold text-[#D85C63]">+₹299</span>
                      </label>
                      <label className="flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all border-gray-50 hover:bg-gray-50">
                        <input type="checkbox" checked={customData.fastDelivery} onChange={(e) => setCustomData({ ...customData, fastDelivery: e.target.checked })} className="w-6 h-6 rounded accent-[#D85C63]" />
                        <span className="flex-1 font-medium">Priority Delivery (3 days)</span>
                        <span className="font-bold text-[#D85C63]">+₹199</span>
                      </label>
                    </div>
                  </div>

                  <div className="mt-12 pt-8 border-t border-gray-100">
                    <div className="flex justify-between items-end mb-8">
                      <p className="text-gray-400 font-bold uppercase tracking-widest">Total Price</p>
                      <p className="text-5xl font-bold text-[#D85C63]">₹{price}</p>
                    </div>
                    <button 
                      onClick={addToCart}
                      className="w-full bg-[#D85C63] text-white py-5 rounded-full text-xl font-bold hover:bg-[#d1535a] transition-all shadow-xl shadow-[#D85C63]/30 flex items-center justify-center gap-3"
                    >
                      <ShoppingBag />
                      Add Custom Order to Cart
                    </button>
                    <button onClick={() => setStep(2)} className="w-full mt-4 text-gray-400 font-medium hover:text-gray-600 transition-colors">
                      Go back and edit
                    </button>
                  </div>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </PageWrapper>
  );
};

// Helper components for icons
const User = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);

export default CustomPaintingPage;
