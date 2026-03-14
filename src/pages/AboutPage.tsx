import React from 'react';
import { Link } from 'react-router-dom';
import { Target, Zap, Heart, Globe, ArrowRight, Users, Award, TrendingUp } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const stats = [
  { icon: Users, value: '10K+', label: 'Happy Customers' },
  { icon: Award, value: '500+', label: 'Premium Products' },
  { icon: Globe, value: '50+', label: 'Countries Served' },
  { icon: TrendingUp, value: '99%', label: 'Satisfaction Rate' },
];

const values = [
  { icon: Target, title: 'Quality First', desc: 'Every product is carefully curated and tested to meet our high standards of quality and durability.', color: 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600' },
  { icon: Zap, title: 'Innovation', desc: 'We stay ahead of trends to bring you the latest and most innovative products on the market.', color: 'bg-purple-100 dark:bg-purple-900/50 text-purple-600' },
  { icon: Heart, title: 'Customer Love', desc: 'Your satisfaction is our priority. We go above and beyond to ensure an exceptional shopping experience.', color: 'bg-rose-100 dark:bg-rose-900/50 text-rose-600' },
  { icon: Globe, title: 'Sustainability', desc: 'We partner with eco-conscious brands and use sustainable packaging to minimize our environmental impact.', color: 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600' },
];

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <Header />
      
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-950 via-purple-950 to-gray-950 py-24">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6">
            About <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">NEXUS</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            We're on a mission to make premium lifestyle products accessible to everyone. Founded in 2024, NEXUS has grown into a trusted marketplace for modern consumers.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <stat.icon className="w-8 h-8 text-indigo-600 mx-auto mb-3" />
                <p className="text-3xl font-black text-gray-900 dark:text-white">{stat.value}</p>
                <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                <p>NEXUS was born from a simple idea: everyone deserves access to premium products without the premium price tag. What started as a small curated collection has grown into a comprehensive marketplace.</p>
                <p>We work directly with manufacturers and designers to bring you the best electronics, fashion, and accessories at competitive prices. Our team of product experts tests every item before it reaches our shelves.</p>
                <p>Today, we serve over 10,000 customers across 50+ countries, and we're just getting started. Our commitment to quality, innovation, and customer satisfaction drives everything we do.</p>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-3xl blur-2xl" />
              <div className="relative bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
                <p className="text-white/80 leading-relaxed mb-6">To curate and deliver the world's finest lifestyle products, making premium quality accessible to everyone, everywhere.</p>
                <Link to="/products" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-indigo-700 rounded-xl font-bold hover:bg-gray-100 transition-colors">
                  Shop Now <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 lg:py-24 bg-gray-50 dark:bg-gray-950/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white mb-3">Our Values</h2>
            <p className="text-gray-500 max-w-lg mx-auto">The principles that guide everything we do</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((val, i) => (
              <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${val.color}`}>
                  <val.icon className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">{val.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutPage;
