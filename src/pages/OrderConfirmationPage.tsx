import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle, Package, Mail, ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const OrderConfirmationPage: React.FC = () => {
  const location = useLocation();
  const { orderId, total, email } = (location.state as any) || {};

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <Header />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16 text-center">
        <div className="relative mb-8">
          <div className="w-24 h-24 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-14 h-14 text-green-600" />
          </div>
          <div className="absolute inset-0 w-24 h-24 mx-auto bg-green-400/20 rounded-full animate-ping" />
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white mb-4">Order Confirmed!</h1>
        <p className="text-gray-500 dark:text-gray-400 text-lg mb-8">
          Thank you for your purchase. Your order has been placed successfully.
        </p>

        {orderId && (
          <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 mb-8 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Order ID</span>
              <span className="font-mono font-bold text-gray-900 dark:text-white text-sm">{orderId.slice(0, 8)}...</span>
            </div>
            {total && (
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Total Paid</span>
                <span className="font-bold text-gray-900 dark:text-white">${(total / 100).toFixed(2)}</span>
              </div>
            )}
            {email && (
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Confirmation sent to</span>
                <span className="font-medium text-gray-900 dark:text-white">{email}</span>
              </div>
            )}
          </div>
        )}

        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          <div className="p-4 bg-indigo-50 dark:bg-indigo-950/50 rounded-xl">
            <Mail className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-indigo-700 dark:text-indigo-300">Confirmation email sent</p>
          </div>
          <div className="p-4 bg-purple-50 dark:bg-purple-950/50 rounded-xl">
            <Package className="w-6 h-6 text-purple-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-purple-700 dark:text-purple-300">Order is being processed</p>
          </div>
        </div>

        <Link to="/products"
          className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold transition-all shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/40">
          Continue Shopping <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
      <Footer />
    </div>
  );
};

export default OrderConfirmationPage;
