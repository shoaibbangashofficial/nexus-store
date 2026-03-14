import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const CategorySection: React.FC = () => {
  const [collections, setCollections] = useState<any[]>([]);
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    supabase.from('ecom_collections').select('*').eq('is_visible', true)
      .in('handle', ['electronics', 'watches', 'footwear', 'accessories'])
      .then(({ data }) => { if (data) setCollections(data); });
  }, []);

  const gradients = [
    'from-indigo-600 to-blue-600',
    'from-purple-600 to-pink-600',
    'from-emerald-600 to-teal-600',
    'from-amber-600 to-orange-600',
  ];

  return (
    <section ref={ref} className="py-16 lg:py-24 bg-gray-50 dark:bg-gray-950/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className={`text-center mb-12 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white mb-3">Shop by Category</h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto">Browse our curated collections and find exactly what you're looking for</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {collections.map((col, i) => (
            <Link key={col.id} to={`/collections/${col.handle}`}
              className={`group relative overflow-hidden rounded-2xl aspect-[4/5] transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: `${i * 150}ms` }}>
              {/* Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${gradients[i % gradients.length]} transition-transform duration-700 group-hover:scale-110`} />
              
              {/* Image */}
              {col.image_url && (
                <img src={col.image_url} alt={col.title}
                  className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-50 transition-transform duration-700 group-hover:scale-110" />
              )}

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">{col.title}</h3>
                <p className="text-white/70 text-sm mb-3 line-clamp-2">{col.description}</p>
                <div className="flex items-center gap-2 text-white font-semibold text-sm group-hover:gap-3 transition-all">
                  Shop Now <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
