import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import ProductCard from './ProductCard';

interface FeaturedProductsProps {
  title?: string;
  subtitle?: string;
  collectionHandle?: string;
  limit?: number;
  showViewAll?: boolean;
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({
  title = 'Featured Products',
  subtitle = 'Handpicked products just for you',
  collectionHandle,
  limit = 8,
  showViewAll = true,
}) => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      if (collectionHandle) {
        const { data: col } = await supabase.from('ecom_collections').select('id').eq('handle', collectionHandle).single();
        if (col) {
          const { data: links } = await supabase.from('ecom_product_collections').select('product_id, position').eq('collection_id', col.id).order('position').limit(limit);
          if (links && links.length > 0) {
            const ids = links.map(l => l.product_id);
            const { data: prods } = await supabase.from('ecom_products').select('*, variants:ecom_product_variants(*)').in('id', ids).eq('status', 'active');
            const sorted = ids.map(id => prods?.find(p => p.id === id)).filter(Boolean);
            setProducts(sorted);
          }
        }
      } else {
        const { data } = await supabase.from('ecom_products').select('*, variants:ecom_product_variants(*)').eq('status', 'active').limit(limit);
        if (data) setProducts(data);
      }
      setLoading(false);
    };
    fetchProducts();
  }, [collectionHandle, limit]);

  return (
    <section ref={sectionRef} className="py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className={`flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <div>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white mb-2">{title}</h2>
            <p className="text-gray-500 dark:text-gray-400">{subtitle}</p>
          </div>
          {showViewAll && (
            <Link to={collectionHandle ? `/collections/${collectionHandle}` : '/products'}
              className="group mt-4 sm:mt-0 inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold hover:gap-3 transition-all">
              View All <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          )}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-gray-200 dark:bg-gray-800 rounded-2xl mb-4" />
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product, i) => (
              <div key={product.id}
                className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ transitionDelay: `${i * 100}ms` }}>
                <ProductCard product={product} index={i} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;
