import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, Grid3X3, LayoutList, X, ChevronDown } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';

const sortOptions = [
  { label: 'Newest', value: 'created_at-desc' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Name: A-Z', value: 'name-asc' },
];

const ProductsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [productTypes, setProductTypes] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<string>('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [sortBy, setSortBy] = useState('created_at-desc');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [showFilters, setShowFilters] = useState(false);
  const [gridCols, setGridCols] = useState(4);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const { data } = await supabase.from('ecom_products')
        .select('*, variants:ecom_product_variants(*)').eq('status', 'active');
      if (data) {
        setProducts(data);
        const types = [...new Set(data.map(p => p.product_type).filter(Boolean))];
        setProductTypes(types as string[]);
        const maxPrice = Math.max(...data.map(p => (p.variants?.[0]?.price || p.price || 0) / 100));
        setPriceRange([0, Math.ceil(maxPrice / 100) * 100]);
      }
      setLoading(false);
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    let result = [...products];
    if (searchQuery) {
      result = result.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.description?.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    if (selectedType) {
      result = result.filter(p => p.product_type === selectedType);
    }
    result = result.filter(p => {
      const price = (p.variants?.[0]?.price || p.price || 0) / 100;
      return price >= priceRange[0] && price <= priceRange[1];
    });
    const [field, dir] = sortBy.split('-');
    result.sort((a, b) => {
      if (field === 'price') {
        const pa = (a.variants?.[0]?.price || a.price || 0);
        const pb = (b.variants?.[0]?.price || b.price || 0);
        return dir === 'asc' ? pa - pb : pb - pa;
      }
      if (field === 'name') return dir === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
      return dir === 'desc' ? new Date(b.created_at).getTime() - new Date(a.created_at).getTime() : new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    });
    setFilteredProducts(result);
  }, [products, searchQuery, selectedType, priceRange, sortBy]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
          <a href="/" className="hover:text-indigo-600">Home</a>
          <span>/</span>
          <span className="text-gray-900 dark:text-white font-medium">All Products</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className={`lg:w-64 flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="sticky top-24 space-y-6">
              <div className="flex items-center justify-between lg:hidden">
                <h3 className="font-bold text-gray-900 dark:text-white">Filters</h3>
                <button onClick={() => setShowFilters(false)}><X className="w-5 h-5" /></button>
              </div>

              {/* Search */}
              <div>
                <label className="text-sm font-semibold text-gray-900 dark:text-white mb-2 block">Search</label>
                <input type="text" placeholder="Search products..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-900 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>

              {/* Category */}
              <div>
                <label className="text-sm font-semibold text-gray-900 dark:text-white mb-2 block">Category</label>
                <div className="space-y-1">
                  <button onClick={() => setSelectedType('')}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${!selectedType ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900'}`}>
                    All Categories
                  </button>
                  {productTypes.map(type => (
                    <button key={type} onClick={() => setSelectedType(type)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${selectedType === type ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900'}`}>
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <label className="text-sm font-semibold text-gray-900 dark:text-white mb-2 block">
                  Price Range: ${priceRange[0]} - ${priceRange[1]}
                </label>
                <input type="range" min={0} max={1000} step={10} value={priceRange[1]}
                  onChange={e => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full accent-indigo-600" />
              </div>

              {/* Clear Filters */}
              {(selectedType || searchQuery) && (
                <button onClick={() => { setSelectedType(''); setSearchQuery(''); setPriceRange([0, 1000]); }}
                  className="w-full py-2.5 text-sm font-semibold text-red-600 bg-red-50 dark:bg-red-950/50 rounded-xl hover:bg-red-100 dark:hover:bg-red-950 transition-colors">
                  Clear All Filters
                </button>
              )}
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <button onClick={() => setShowFilters(!showFilters)} className="lg:hidden p-2 rounded-xl bg-gray-100 dark:bg-gray-900">
                  <SlidersHorizontal className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                </button>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold text-gray-900 dark:text-white">{filteredProducts.length}</span> products found
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-1 bg-gray-100 dark:bg-gray-900 rounded-xl p-1">
                  {[4, 3].map(cols => (
                    <button key={cols} onClick={() => setGridCols(cols)}
                      className={`p-2 rounded-lg transition-colors ${gridCols === cols ? 'bg-white dark:bg-gray-800 shadow-sm' : ''}`}>
                      {cols === 4 ? <Grid3X3 className="w-4 h-4 text-gray-700 dark:text-gray-300" /> : <LayoutList className="w-4 h-4 text-gray-700 dark:text-gray-300" />}
                    </button>
                  ))}
                </div>
                <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-900 rounded-xl text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  {sortOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </div>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className={`grid grid-cols-2 ${gridCols === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-4 sm:gap-6`}>
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-square bg-gray-200 dark:bg-gray-800 rounded-2xl mb-4" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4 mb-2" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-400 text-lg font-medium">No products found</p>
                <p className="text-gray-500 text-sm mt-2">Try adjusting your filters</p>
              </div>
            ) : (
              <div className={`grid grid-cols-2 ${gridCols === 4 ? 'md:grid-cols-3 lg:grid-cols-4' : 'md:grid-cols-2 lg:grid-cols-3'} gap-4 sm:gap-6`}>
                {filteredProducts.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductsPage;
