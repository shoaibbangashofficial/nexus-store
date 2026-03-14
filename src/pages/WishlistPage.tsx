import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, X, ArrowLeft } from 'lucide-react';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const WishlistPage: React.FC = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleAddToCart = (item: any) => {
    addToCart({
      product_id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      sku: item.handle,
    });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-8">My Wishlist ({wishlist.length})</h1>

        {wishlist.length === 0 ? (
          <div className="text-center py-20">
            <Heart className="w-20 h-20 text-gray-300 dark:text-gray-700 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Your wishlist is empty</h2>
            <p className="text-gray-500 mb-6">Save items you love and come back to them later.</p>
            <Link to="/products" className="inline-flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-2xl font-semibold hover:bg-indigo-700 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {wishlist.map(item => (
              <div key={item.id} className="group bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                <Link to={`/product/${item.handle}`} className="block">
                  <div className="relative aspect-square bg-gray-100 dark:bg-gray-800">
                    {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />}
                    <button onClick={(e) => { e.preventDefault(); removeFromWishlist(item.id); }}
                      className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 dark:bg-gray-900/90 flex items-center justify-center shadow-lg hover:bg-red-50 transition-colors">
                      <X className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </Link>
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-1 line-clamp-1">{item.name}</h3>
                  <p className="text-lg font-bold text-indigo-600 mb-3">${(item.price / 100).toFixed(2)}</p>
                  <button onClick={() => handleAddToCart(item)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-sm transition-colors">
                    <ShoppingBag className="w-4 h-4" /> Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default WishlistPage;
