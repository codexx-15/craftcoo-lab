import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import API from '../api';

interface CartContextType {
  cartCount: number;
  updateCartCount: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartCount, setCartCount] = useState(0);

  const updateCartCount = async () => {
    try {
      const userInfo = localStorage.getItem('userInfo');
      if (userInfo) {
        const { data } = await API.get('/cart');
        const count = data.items.reduce((acc: number, item: any) => acc + item.quantity, 0);
        setCartCount(count);
      } else {
        setCartCount(0);
      }
    } catch (err) {
      console.error('Failed to fetch cart count:', err);
      setCartCount(0);
    }
  };

  useEffect(() => {
    updateCartCount();
    // Listen for storage changes (login/logout)
    window.addEventListener('storage', updateCartCount);
    return () => window.removeEventListener('storage', updateCartCount);
  }, []);

  return (
    <CartContext.Provider value={{ cartCount, updateCartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
