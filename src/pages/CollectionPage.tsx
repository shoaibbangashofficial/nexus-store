import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';

const CollectionPage: React.FC = () => {
  const { handle } = useParams<{ handle: string }>();
  const [collection, setCollection] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollectionProducts = async () => {
      if (!handle) return;
      setLoading(true);

      const { data: collectionData } = await supabase
        .from('ecom_collections').select('*').eq('handle', handle).single();

      if (!collectionData) { setLoading(false); return; }
      setCollection(collectionData);

      const { data: productLinks } = await supabase
        .from('ecom_product_collections').select('product_id, position')
        .eq('collection_id', collectionData.id).order('position');

      if (!productLinks || productLinks.length === 0) {
        setProducts([]);
        setLoading(false);
        return;
      }

      const productIds = productLinks.map(pl => pl.product_id);
      const { data: productsData } = await supabase
        .from('ecom_products').select('*, variants:ecom_product_variants(*)')
        .in('id', productIds).eq('status', 'active');

      const sortedProducts = productIds.map(id => productsData?.find(p => p.id === id)).filter(Boolean);
      setProducts(sortedProducts);
      setLoading(false);
    };

    fetchCollectionProducts();
  }, [handle]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-8">
          <Link to="/" className="hover:text-indigo-600">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/products" className="hover:text-indigo-600">Shop</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-900 dark:text-white font-medium">{collection?.title || 'Collection'}</span>
        </div>

        {/* Collection Header */}
        {collection && (
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 to-purple-600 p-8 sm:p-12 mb-10">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />
            <div className="relative">
              <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">{collection.title}</h1>
              <p className="text-white/80 max-w-lg">{collection.description}</p>
              <p className="text-white/60 text-sm mt-3">{products.length} products</p>
            </div>
          </div>
        )}

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-gray-200 dark:bg-gray-800 rounded-2xl mb-4" />
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg font-medium">No products in this collection yet</p>
            <Link to="/products" className="text-indigo-600 hover:underline mt-2 inline-block">Browse all products</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default CollectionPage;
