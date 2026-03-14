import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, ShoppingBag, Star, Truck, Shield, RotateCcw, Minus, Plus, ChevronRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FeaturedProducts from '@/components/FeaturedProducts';

const ProductDetailPage: React.FC = () => {
  const { handle } = useParams<{ handle: string }>();
  const [product, setProduct] = useState<any>(null);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('description');
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  useEffect(() => {
    const fetchProduct = async () => {
      setSelectedVariant(null);
      setSelectedSize('');
      setQuantity(1);
      setLoading(true);

      const { data } = await supabase.from('ecom_products')
        .select('*, variants:ecom_product_variants(*)').eq('handle', handle).single();

      if (data) {
        let variants = data.variants || [];
        if (data.has_variants && variants.length === 0) {
          const { data: vd } = await supabase.from('ecom_product_variants')
            .select('*').eq('product_id', data.id).order('position');
          variants = vd || [];
          data.variants = variants;
        }
        setProduct(data);
        if (variants.length > 0) {
          const sorted = [...variants].sort((a: any, b: any) => (a.position || 0) - (b.position || 0));
          const first = sorted.find((v: any) => v.inventory_qty == null || v.inventory_qty > 0) || sorted[0];
          setSelectedVariant(first);
          setSelectedSize(first?.option1 || '');
        }
      }
      setLoading(false);
    };
    fetchProduct();
  }, [handle]);

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
    const variant = product?.variants?.find((v: any) => v.option1 === size || v.title?.toLowerCase().includes(size.toLowerCase()));
    if (variant) setSelectedVariant(variant);
  };

  const variantSizes = [...new Set(product?.variants?.map((v: any) => v.option1).filter(Boolean) || [])];
  const hasVariants = product?.has_variants && product?.variants?.length > 0;

  const getInStock = (): boolean => {
    if (selectedVariant) {
      if (selectedVariant.inventory_qty == null) return true;
      return selectedVariant.inventory_qty > 0;
    }
    if (product?.variants?.length > 0) return product.variants.some((v: any) => v.inventory_qty == null || v.inventory_qty > 0);
    if (product?.has_variants) return true;
    if (product?.inventory_qty == null) return true;
    return product.inventory_qty > 0;
  };
  const inStock = product ? getInStock() : false;

  const handleAddToCart = () => {
    if (!product) return;
    if (hasVariants && !selectedSize) return;
    if (!inStock) return;
    addToCart({
      product_id: product.id,
      variant_id: selectedVariant?.id || undefined,
      name: product.name,
      variant_title: selectedVariant?.title || selectedSize || undefined,
      sku: selectedVariant?.sku || product.sku || product.handle,
      price: selectedVariant?.price || product.price,
      image: product.images?.[0],
    }, quantity);
  };

  const currentPrice = selectedVariant?.price || product?.price || 0;
  const inWishlist = product ? isInWishlist(product.id) : false;

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="aspect-square bg-gray-200 dark:bg-gray-800 rounded-3xl animate-pulse" />
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-3/4 animate-pulse" />
              <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-1/4 animate-pulse" />
              <div className="h-24 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Product Not Found</h1>
          <Link to="/products" className="text-indigo-600 hover:underline">Browse all products</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-8">
          <Link to="/" className="hover:text-indigo-600">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/products" className="hover:text-indigo-600">Products</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-900 dark:text-white font-medium">{product.name}</span>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
          {/* Image */}
          <div className="relative group">
            <div className="aspect-square rounded-3xl overflow-hidden bg-gray-100 dark:bg-gray-900">
              <img src={product.images?.[0]} alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
            {product.tags?.includes('sale') && (
              <span className="absolute top-4 left-4 px-4 py-1.5 bg-rose-500 text-white text-sm font-bold rounded-full">Sale</span>
            )}
            {product.tags?.includes('new-arrival') && (
              <span className="absolute top-4 left-4 px-4 py-1.5 bg-indigo-600 text-white text-sm font-bold rounded-full">New</span>
            )}
          </div>

          {/* Product Info */}
          <div>
            <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-2">{product.vendor}</p>
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white mb-4">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-5 h-5 ${i < 4 ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} />
                ))}
              </div>
              <span className="text-sm text-gray-500">(128 reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-black text-gray-900 dark:text-white">${(currentPrice / 100).toFixed(2)}</span>
              {product.tags?.includes('sale') && (
                <span className="text-xl text-gray-400 line-through">${((currentPrice * 1.3) / 100).toFixed(2)}</span>
              )}
              {inStock ? (
                <span className="px-3 py-1 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-400 text-xs font-bold rounded-full">In Stock</span>
              ) : (
                <span className="px-3 py-1 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-400 text-xs font-bold rounded-full">Out of Stock</span>
              )}
            </div>

            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-8">{product.description}</p>

            {/* Size Selector */}
            {(hasVariants || variantSizes.length > 0) && (
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-900 dark:text-white mb-3">Select Size</label>
                <div className="flex flex-wrap gap-2">
                  {variantSizes.map((size: string) => {
                    const variant = product.variants?.find((v: any) => v.option1 === size);
                    const sizeInStock = variant ? (variant.inventory_qty == null || variant.inventory_qty > 0) : true;
                    return (
                      <button key={size} onClick={() => sizeInStock && handleSizeSelect(size)} disabled={!sizeInStock}
                        className={`px-5 py-2.5 border-2 rounded-xl font-semibold text-sm transition-all duration-300 ${
                          selectedSize === size
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-500/30'
                            : sizeInStock
                            ? 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-indigo-300 dark:hover:border-indigo-700'
                            : 'border-gray-100 dark:border-gray-800 text-gray-300 dark:text-gray-700 cursor-not-allowed line-through'
                        }`}>
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-8">
              <label className="block text-sm font-bold text-gray-900 dark:text-white mb-3">Quantity</label>
              <div className="inline-flex items-center border-2 border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <Minus className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                </button>
                <span className="px-6 py-3 font-bold text-gray-900 dark:text-white min-w-[60px] text-center">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)}
                  className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <Plus className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mb-8">
              <button onClick={handleAddToCart}
                disabled={(hasVariants && !selectedSize) || !inStock}
                className="flex-1 flex items-center justify-center gap-2 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-base transition-all duration-300 shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/40 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5">
                <ShoppingBag className="w-5 h-5" />
                {!inStock ? 'Out of Stock' : hasVariants && !selectedSize ? 'Select a Size' : 'Add to Cart'}
              </button>
              <button onClick={() => toggleWishlist({ id: product.id, name: product.name, price: currentPrice, image: product.images?.[0], handle: product.handle })}
                className={`p-4 rounded-2xl border-2 transition-all duration-300 hover:-translate-y-0.5 ${
                  inWishlist ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/50' : 'border-gray-200 dark:border-gray-700 hover:border-rose-300'
                }`}>
                <Heart className={`w-6 h-6 ${inWishlist ? 'fill-rose-500 text-rose-500' : 'text-gray-600 dark:text-gray-400'}`} />
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl">
              {[
                { icon: Truck, label: 'Free Shipping' },
                { icon: Shield, label: 'Secure Payment' },
                { icon: RotateCcw, label: '30-Day Returns' },
              ].map((feat, i) => (
                <div key={i} className="text-center">
                  <feat.icon className="w-5 h-5 text-indigo-600 mx-auto mb-1" />
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-400">{feat.label}</p>
                </div>
              ))}
            </div>

            {/* Metadata */}
            {product.metadata && Object.keys(product.metadata).length > 0 && (
              <div className="mt-8">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3 uppercase tracking-wider">Specifications</h3>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(product.metadata).map(([key, value]) => (
                    <div key={key} className="flex justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-xl">
                      <span className="text-sm text-gray-500 capitalize">{key.replace(/_/g, ' ')}</span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div className="bg-gray-50 dark:bg-gray-950/50">
        <FeaturedProducts title="You May Also Like" subtitle="Similar products you might enjoy" limit={4} />
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetailPage;
