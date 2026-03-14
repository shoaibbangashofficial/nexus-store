import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Package, LogOut, Mail, Calendar } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const ProfilePage: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) { navigate('/login'); return; }
    const fetchOrders = async () => {
      if (!user?.id) return;
      const { data } = await supabase.from('ecom_orders')
        .select('*, items:ecom_order_items(*)').eq('customer_id', user.id)
        .order('created_at', { ascending: false });
      if (data) setOrders(data);
      setLoading(false);
    };
    fetchOrders();
  }, [user, isAuthenticated]);

  if (!isAuthenticated) return null;

  const statusColors: Record<string, string> = {
    paid: 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400',
    shipped: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400',
    delivered: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-400',
    pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400',
    cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400',
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <Header />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 sm:p-10 mb-8">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <span className="text-white font-black text-3xl">{user?.name?.[0]?.toUpperCase() || 'U'}</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{user?.name}</h1>
              <p className="text-white/70 flex items-center gap-2 mt-1"><Mail className="w-4 h-4" /> {user?.email}</p>
            </div>
            <button onClick={() => { logout(); navigate('/'); }}
              className="ml-auto px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold transition-colors flex items-center gap-2 backdrop-blur-sm">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>

        {/* Orders */}
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <Package className="w-5 h-5 text-indigo-600" /> Order History
        </h2>

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-100 dark:bg-gray-900 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 dark:bg-gray-900 rounded-2xl">
            <Package className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No orders yet</p>
            <Link to="/products" className="text-indigo-600 font-semibold hover:underline mt-2 inline-block">Start Shopping</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <div key={order.id} className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500 flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(order.created_at).toLocaleDateString()}</p>
                    <p className="font-mono text-xs text-gray-400 mt-0.5">#{order.id.slice(0, 8)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${statusColors[order.status] || 'bg-gray-100 text-gray-700'}`}>
                      {order.status}
                    </span>
                    <span className="font-bold text-gray-900 dark:text-white">${(order.total / 100).toFixed(2)}</span>
                  </div>
                </div>
                {order.items && order.items.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {order.items.map((item: any) => (
                      <div key={item.id} className="text-xs bg-white dark:bg-gray-800 px-3 py-1.5 rounded-lg text-gray-600 dark:text-gray-400">
                        {item.product_name} {item.variant_title ? `(${item.variant_title})` : ''} x{item.quantity}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ProfilePage;
