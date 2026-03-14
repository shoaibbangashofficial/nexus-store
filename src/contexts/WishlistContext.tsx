import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image?: string;
  handle: string;
}

interface WishlistContextType {
  wishlist: WishlistItem[];
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (id: string) => void;
  isInWishlist: (id: string) => boolean;
  toggleWishlist: (item: WishlistItem) => void;
  wishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType>({
  wishlist: [],
  addToWishlist: () => {},
  removeFromWishlist: () => {},
  isInWishlist: () => false,
  toggleWishlist: () => {},
  wishlistCount: 0,
});

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('ecom_wishlist');
    if (stored) {
      try { setWishlist(JSON.parse(stored)); } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('ecom_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const addToWishlist = useCallback((item: WishlistItem) => {
    setWishlist(prev => {
      if (prev.find(i => i.id === item.id)) return prev;
      return [...prev, item];
    });
    toast.success('Added to wishlist');
  }, []);

  const removeFromWishlist = useCallback((id: string) => {
    setWishlist(prev => prev.filter(i => i.id !== id));
    toast.success('Removed from wishlist');
  }, []);

  const isInWishlist = useCallback((id: string) => wishlist.some(i => i.id === id), [wishlist]);

  const toggleWishlist = useCallback((item: WishlistItem) => {
    if (wishlist.some(i => i.id === item.id)) {
      removeFromWishlist(item.id);
    } else {
      addToWishlist(item);
    }
  }, [wishlist, addToWishlist, removeFromWishlist]);

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist, toggleWishlist, wishlistCount: wishlist.length }}>
      {children}
    </WishlistContext.Provider>
  );
};
