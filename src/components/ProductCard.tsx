import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Eye, Star } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';

interface ProductCardProps {
  product: any;
  index?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, index = 0 }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const price = product.variants?.[0]?.price || product.price || 0;
  const image = product.images?.[0] || '';
  const inWishlist = isInWishlist(product.id);
  const isSale = product.tags?.includes('sale');
  const isNew = product.tags?.includes('new-arrival');

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const variant = product.variants?.[0];
    addToCart({
      product_id: product.id,
      variant_id: variant?.id || undefined,
      name: product.name,
      variant_title: variant?.title || undefined,
      sku: variant?.sku || product.sku || product.handle,
      price: variant?.price || product.price,
      image,
    });
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist({ id: product.id, name: product.name, price, image, handle: product.handle });
  };

  return (
    <div
      className="group relative bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <Link to={`/product/${product.handle}`} className="block">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800">
          {!imageLoaded && (
            <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800" />
          )}
          <img
            src={image}
            alt={product.name}
            className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImageLoaded(true)}
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {isNew && (
              <span className="px-3 py-1 bg-indigo-600 text-white text-xs font-bold rounded-full uppercase tracking-wider">
                New
              </span>
            )}
            {isSale && (
              <span className="px-3 py-1 bg-rose-500 text-white text-xs font-bold rounded-full uppercase tracking-wider">
                Sale
              </span>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={handleToggleWishlist}
            className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110"
          >
            <Heart
              className={`w-5 h-5 transition-all duration-300 ${inWishlist ? 'fill-rose-500 text-rose-500' : 'text-gray-600 dark:text-gray-300'}`}
            />
          </button>

          {/* Hover Actions */}
          <div className={`absolute bottom-0 left-0 right-0 p-4 flex gap-2 transition-all duration-500 ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
            <button
              onClick={handleAddToCart}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-sm transition-all duration-300 shadow-lg"
            >
              <ShoppingBag className="w-4 h-4" />
              Add to Cart
            </button>
            <Link
              to={`/product/${product.handle}`}
              onClick={(e) => e.stopPropagation()}
              className="w-12 flex items-center justify-center bg-white dark:bg-gray-800 rounded-xl shadow-lg transition-all duration-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <Eye className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </Link>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">
            {product.vendor || product.product_type}
          </p>
          <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2 line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-3.5 h-3.5 ${i < 4 ? 'fill-amber-400 text-amber-400' : 'text-gray-300 dark:text-gray-600'}`} />
            ))}
            <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">(4.0)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              ${(price / 100).toFixed(2)}
            </span>
            {isSale && (
              <span className="text-sm text-gray-400 line-through">
                ${((price * 1.3) / 100).toFixed(2)}
              </span>
            )}
          </div>
          {product.tags?.includes('featured') && (
            <div className="mt-2 flex items-center gap-1">
              <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">Free Shipping</span>
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
