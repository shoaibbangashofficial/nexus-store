import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Truck, Shield, RotateCcw, Headphones, ArrowRight } from 'lucide-react';

const features = [
  { icon: Truck, title: 'Free Shipping', desc: 'On all orders, always', color: 'text-indigo-600 bg-indigo-100 dark:bg-indigo-900/50' },
  { icon: Shield, title: 'Secure Payment', desc: '256-bit SSL encryption', color: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/50' },
  { icon: RotateCcw, title: 'Easy Returns', desc: '30-day return policy', color: 'text-purple-600 bg-purple-100 dark:bg-purple-900/50' },
  { icon: Headphones, title: '24/7 Support', desc: 'Expert help anytime', color: 'text-amber-600 bg-amber-100 dark:bg-amber-900/50' },
];

const PromoSection: React.FC = () => {
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

  return (
    <>
      {/* Features Bar */}
      <section ref={ref} className="py-12 border-y border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feat, i) => (
              <div key={i}
                className={`flex items-center gap-4 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                style={{ transitionDelay: `${i * 100}ms` }}>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${feat.color}`}>
                  <feat.icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white text-sm">{feat.title}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-8 sm:p-12 lg:p-16">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

            <div className="relative flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="text-center lg:text-left">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4">
                  Get 30% Off<br />Your First Order
                </h2>
                <p className="text-white/80 text-lg max-w-md">
                  Sign up today and receive an exclusive discount on your first purchase. Limited time offer.
                </p>
              </div>
              <Link to="/register"
                className="group inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-700 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-all shadow-2xl hover:-translate-y-1">
                Get Started
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default PromoSection;
