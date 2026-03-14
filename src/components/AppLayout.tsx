import React from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import CategorySection from '@/components/CategorySection';
import FeaturedProducts from '@/components/FeaturedProducts';
import PromoSection from '@/components/PromoSection';
import Footer from '@/components/Footer';

const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <Header />
      <HeroSection />
      <FeaturedProducts
        title="Best Sellers"
        subtitle="Our most popular products loved by thousands"
        collectionHandle="best-sellers"
        limit={8}
      />
      <CategorySection />
      <FeaturedProducts
        title="New Arrivals"
        subtitle="Fresh drops you don't want to miss"
        collectionHandle="new-arrivals"
        limit={8}
      />
      <PromoSection />
      <FeaturedProducts
        title="All Products"
        subtitle="Browse our complete collection"
        limit={12}
      />
      <Footer />
    </div>
  );
};

export default AppLayout;
