import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, Heart, User, Moon, Sun, Menu, X, ChevronDown } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/components/theme-provider';
import { supabase } from '@/lib/supabase';

const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [collections, setCollections] = useState<any[]>([]);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const { cartCount, isCartOpen, setIsCartOpen, cart, cartTotal, removeFromCart, updateQuantity } = useCart();
  const { wishlistCount } = useWishlist();
  const { isAuthenticated, user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const searchRef = useRef<HTMLInputElement>(null);
  const megaMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    supabase.from('ecom_collections').select('id, title, handle, image_url, description')
      .eq('is_visible', true).then(({ data }) => { if (data) setCollections(data); });
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) { setSearchResults([]); return; }
    const timer = setTimeout(async () => {
      const { data } = await supabase.from('ecom_products').select('id, name, handle, images, price')
        .eq('status', 'active').ilike('name', `%${searchQuery}%`).limit(5);
      if (data) setSearchResults(data);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const mainCollections = collections.filter(c => ['electronics', 'watches', 'footwear', 'accessories'].includes(c.handle));
  const specialCollections = collections.filter(c => ['new-arrivals', 'best-sellers'].includes(c.handle));

  return (
    <>
      {/* Top Bar */}
      <div className="bg-indigo-600 text-white text-center py-2 text-sm font-medium">
        <span className="animate-pulse inline-block mr-2">
          <svg className="w-4 h-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
        </span>
        Free Shipping on All Orders | Shop Now
      </div>

      {/* Main Header */}
      <header className={`sticky top-0 z-50 transition-all duration-500 ${scrolled ? 'bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl shadow-lg' : 'bg-white dark:bg-gray-950'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Mobile Menu Button */}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              {mobileMenuOpen ? <X className="w-6 h-6 text-gray-900 dark:text-white" /> : <Menu className="w-6 h-6 text-gray-900 dark:text-white" />}
            </button>

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-indigo-500/30 transition-all duration-300 group-hover:scale-105">
                <span className="text-white font-black text-lg">N</span>
              </div>
              <span className="text-xl font-black text-gray-900 dark:text-white tracking-tight hidden sm:block">
                NEXUS<span className="text-indigo-600">.</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              <Link to="/" className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-all">
                Home
              </Link>
              <div className="relative" ref={megaMenuRef} onMouseEnter={() => setMegaMenuOpen(true)} onMouseLeave={() => setMegaMenuOpen(false)}>
                <button className="flex items-center gap-1 px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-all">
                  Shop <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${megaMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                {/* Mega Menu */}
                <div className={`absolute top-full left-1/2 -translate-x-1/2 w-[700px] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 p-6 transition-all duration-300 ${megaMenuOpen ? 'opacity-100 visible translate-y-2' : 'opacity-0 invisible -translate-y-2'}`}>
                  <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-2">
                      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Categories</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {mainCollections.map(col => (
                          <Link key={col.id} to={`/collections/${col.handle}`} onClick={() => setMegaMenuOpen(false)}
                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-all group/item">
                            {col.image_url && <img src={col.image_url} alt={col.title} className="w-12 h-12 rounded-lg object-cover" />}
                            <div>
                              <p className="font-semibold text-sm text-gray-900 dark:text-white group-hover/item:text-indigo-600 dark:group-hover/item:text-indigo-400">{col.title}</p>
                              <p className="text-xs text-gray-500">{col.description}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Collections</h3>
                      {specialCollections.map(col => (
                        <Link key={col.id} to={`/collections/${col.handle}`} onClick={() => setMegaMenuOpen(false)}
                          className="block p-3 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-all mb-1">
                          <p className="font-semibold text-sm text-gray-900 dark:text-white">{col.title}</p>
                          <p className="text-xs text-gray-500">{col.description}</p>
                        </Link>
                      ))}
                      <Link to="/products" onClick={() => setMegaMenuOpen(false)}
                        className="block p-3 mt-2 text-center bg-indigo-600 text-white rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-colors">
                        View All Products
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <Link to="/products" className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-all">
                Products
              </Link>
              <Link to="/about" className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-all">
                About
              </Link>
              <Link to="/contact" className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-all">
                Contact
              </Link>
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Search */}
              <button onClick={() => { setSearchOpen(!searchOpen); setTimeout(() => searchRef.current?.focus(), 100); }}
                className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
                <Search className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </button>

              {/* Theme Toggle */}
              <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
                {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-gray-700" />}
              </button>

              {/* Wishlist */}
              <Link to="/wishlist" className="relative p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
                <Heart className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-rose-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-bounce">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <button onClick={() => setIsCartOpen(!isCartOpen)} className="relative p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
                <ShoppingBag className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-indigo-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* User */}
              {isAuthenticated ? (
                <div className="relative group/user">
                  <button className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
                    <div className="w-7 h-7 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">{user?.name?.[0]?.toUpperCase() || 'U'}</span>
                    </div>
                  </button>
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-800 opacity-0 invisible group-hover/user:opacity-100 group-hover/user:visible transition-all duration-300 py-2">
                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/50">My Profile</Link>
                    <button onClick={logout} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50">Logout</button>
                  </div>
                </div>
              ) : (
                <Link to="/login" className="hidden sm:flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-sm transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40">
                  <User className="w-4 h-4" /> Sign In
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Search Overlay */}
        <div className={`absolute top-full left-0 right-0 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 transition-all duration-300 ${searchOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
          <div className="max-w-3xl mx-auto px-4 py-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input ref={searchRef} type="text" placeholder="Search products..." value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && searchQuery) { navigate(`/products?search=${searchQuery}`); setSearchOpen(false); setSearchQuery(''); } }}
                className="w-full pl-12 pr-12 py-3 bg-gray-100 dark:bg-gray-900 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              <button onClick={() => { setSearchOpen(false); setSearchQuery(''); }} className="absolute right-4 top-1/2 -translate-y-1/2">
                <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
              </button>
            </div>
            {searchResults.length > 0 && (
              <div className="mt-3 divide-y divide-gray-100 dark:divide-gray-800">
                {searchResults.map(p => (
                  <Link key={p.id} to={`/product/${p.handle}`} onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                    className="flex items-center gap-3 py-3 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-lg px-2 transition-colors">
                    <img src={p.images?.[0]} alt={p.name} className="w-12 h-12 rounded-lg object-cover" />
                    <div>
                      <p className="font-semibold text-sm text-gray-900 dark:text-white">{p.name}</p>
                      <p className="text-sm text-indigo-600">${(p.price / 100).toFixed(2)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Cart Drawer */}
      {isCartOpen && <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setIsCartOpen(false)} />}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white dark:bg-gray-950 z-50 shadow-2xl transition-transform duration-500 ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Shopping Cart ({cartCount})</h2>
            <button onClick={() => setIsCartOpen(false)} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 font-medium">Your cart is empty</p>
                <Link to="/products" onClick={() => setIsCartOpen(false)} className="inline-block mt-4 px-6 py-2 bg-indigo-600 text-white rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-colors">
                  Start Shopping
                </Link>
              </div>
            ) : cart.map(item => (
              <div key={item.product_id + (item.variant_id || '')} className="flex gap-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-xl">
                {item.image && <img src={item.image} alt={item.name} className="w-20 h-20 rounded-lg object-cover" />}
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm text-gray-900 dark:text-white truncate">{item.name}</h4>
                  {item.variant_title && <p className="text-xs text-gray-500">{item.variant_title}</p>}
                  <p className="text-sm font-bold text-indigo-600 mt-1">${(item.price / 100).toFixed(2)}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button onClick={() => updateQuantity(item.product_id, item.variant_id, item.quantity - 1)}
                      className="w-7 h-7 rounded-lg bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-sm font-bold hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors">-</button>
                    <span className="text-sm font-semibold w-6 text-center text-gray-900 dark:text-white">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.product_id, item.variant_id, item.quantity + 1)}
                      className="w-7 h-7 rounded-lg bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-sm font-bold hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors">+</button>
                    <button onClick={() => removeFromCart(item.product_id, item.variant_id)}
                      className="ml-auto p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-lg transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {cart.length > 0 && (
            <div className="p-6 border-t border-gray-200 dark:border-gray-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                <span className="text-xl font-bold text-gray-900 dark:text-white">${(cartTotal / 100).toFixed(2)}</span>
              </div>
              <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                Free shipping on all orders
              </p>
              <Link to="/cart" onClick={() => setIsCartOpen(false)}
                className="block w-full py-3 text-center bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                View Cart
              </Link>
              <Link to="/checkout" onClick={() => setIsCartOpen(false)}
                className="block w-full py-3 text-center bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/20">
                Checkout
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} onClick={() => setMobileMenuOpen(false)} />
      <div className={`fixed top-0 left-0 h-full w-80 bg-white dark:bg-gray-950 z-40 shadow-2xl transition-transform duration-500 lg:hidden ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <span className="text-xl font-black text-gray-900 dark:text-white">NEXUS<span className="text-indigo-600">.</span></span>
            <button onClick={() => setMobileMenuOpen(false)} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800">
              <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
          <nav className="space-y-1">
            {[{ to: '/', label: 'Home' }, { to: '/products', label: 'All Products' }, ...mainCollections.map(c => ({ to: `/collections/${c.handle}`, label: c.title })), { to: '/about', label: 'About' }, { to: '/contact', label: 'Contact' }].map(item => (
              <Link key={item.to} to={item.to} onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all">
                {item.label}
              </Link>
            ))}
          </nav>
          {!isAuthenticated && (
            <Link to="/login" onClick={() => setMobileMenuOpen(false)}
              className="block mt-6 w-full py-3 text-center bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </>
  );
};

export default Header;
