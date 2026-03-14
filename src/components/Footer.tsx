import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Send, MapPin, Phone, Mail, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) { toast.error('Please enter a valid email'); return; }
    toast.success('Thanks for subscribing!');
    setEmail('');
  };

  return (
    <footer className="bg-gray-950 text-gray-300">
      {/* Newsletter Section */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left">
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">Join Our Newsletter</h3>
              <p className="text-gray-400 max-w-md">Get exclusive offers, new product alerts, and style inspiration delivered to your inbox.</p>
            </div>
            <form onSubmit={handleNewsletter} className="flex w-full max-w-md">
              <input type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)}
                className="flex-1 px-5 py-3.5 bg-gray-900 border border-gray-800 rounded-l-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
              <button type="submit" className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-r-xl font-semibold transition-colors flex items-center gap-2">
                Subscribe <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-black text-lg">N</span>
              </div>
              <span className="text-xl font-black text-white">NEXUS<span className="text-indigo-500">.</span></span>
            </Link>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">Premium marketplace for modern lifestyle products. Curated collections of electronics, fashion, and accessories.</p>
            <div className="flex gap-3">
              {['twitter', 'instagram', 'facebook', 'youtube'].map(social => (
                <a key={social} href="#" onClick={e => e.preventDefault()} className="w-10 h-10 rounded-xl bg-gray-900 hover:bg-indigo-600 flex items-center justify-center transition-all duration-300 group">
                  <svg className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="4" />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-3">
              {[{ to: '/products', label: 'All Products' }, { to: '/collections/new-arrivals', label: 'New Arrivals' }, { to: '/collections/best-sellers', label: 'Best Sellers' }, { to: '/about', label: 'About Us' }, { to: '/contact', label: 'Contact' }].map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-gray-400 hover:text-indigo-400 transition-colors flex items-center gap-1 group">
                    <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Customer Service</h4>
            <ul className="space-y-3">
              {['FAQ', 'Shipping Policy', 'Return Policy', 'Privacy Policy', 'Terms of Service'].map(item => (
                <li key={item}>
                  <a href="#" onClick={e => e.preventDefault()} className="text-sm text-gray-400 hover:text-indigo-400 transition-colors flex items-center gap-1 group">
                    <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-indigo-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-400">123 Commerce Street, San Francisco, CA 94102</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-indigo-500 flex-shrink-0" />
                <span className="text-sm text-gray-400">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-indigo-500 flex-shrink-0" />
                <span className="text-sm text-gray-400">hello@nexusstore.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">&copy; 2026 NEXUS. All rights reserved.</p>
          <div className="flex items-center gap-4">
            {['Visa', 'Mastercard', 'Amex', 'PayPal'].map(method => (
              <div key={method} className="px-3 py-1.5 bg-gray-900 rounded-lg text-xs font-medium text-gray-400">{method}</div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
