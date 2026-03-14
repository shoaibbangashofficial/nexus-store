import React from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, X, ShoppingBag, ArrowLeft, Truck } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const CartPage: React.FC = () => {
  const { cart, cartTotal, cartCount, removeFromCart, updateQuantity, clearCart } = useCart();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">Shopping Cart</h1>
          {cart.length > 0 && (
            <button onClick={clearCart} className="text-sm text-red-600 hover:text-red-700 font-medium">Clear Cart</button>
          )}
        </div>

        {cart.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag className="w-20 h-20 text-gray-300 dark:text-gray-700 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">Looks like you haven't added anything to your cart yet.</p>
            <Link to="/products" className="inline-flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-2xl font-semibold hover:bg-indigo-700 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map(item => (
                <div key={item.product_id + (item.variant_id || '')}
                  className="flex gap-4 sm:gap-6 p-4 sm:p-6 bg-gray-50 dark:bg-gray-900 rounded-2xl transition-all hover:shadow-lg">
                  {item.image && (
                    <img src={item.image} alt={item.name} className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl object-cover flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white">{item.name}</h3>
                        {item.variant_title && <p className="text-sm text-gray-500 mt-0.5">{item.variant_title}</p>}
                      </div>
                      <button onClick={() => removeFromCart(item.product_id, item.variant_id)}
                        className="p-2 hover:bg-red-100 dark:hover:bg-red-950/50 rounded-xl transition-colors">
                        <X className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                    <p className="text-lg font-bold text-indigo-600 mt-2">${(item.price / 100).toFixed(2)}</p>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border-2 border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                        <button onClick={() => updateQuantity(item.product_id, item.variant_id, item.quantity - 1)}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                          <Minus className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        </button>
                        <span className="px-4 font-bold text-gray-900 dark:text-white">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.product_id, item.variant_id, item.quantity + 1)}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                          <Plus className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        </button>
                      </div>
                      <p className="font-bold text-gray-900 dark:text-white">${((item.price * item.quantity) / 100).toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 space-y-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Order Summary</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Subtotal ({cartCount} items)</span>
                    <span className="font-semibold text-gray-900 dark:text-white">${(cartTotal / 100).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Shipping</span>
                    <span className="font-semibold text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Tax</span>
                    <span className="text-gray-400 text-xs">Calculated at checkout</span>
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-800 pt-3 flex justify-between">
                    <span className="font-bold text-gray-900 dark:text-white">Estimated Total</span>
                    <span className="text-xl font-black text-gray-900 dark:text-white">${(cartTotal / 100).toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950/50 rounded-xl">
                  <Truck className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <p className="text-sm text-green-700 dark:text-green-400 font-medium">Free shipping on all orders</p>
                </div>

                <Link to="/checkout"
                  className="block w-full py-4 text-center bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold transition-all shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:-translate-y-0.5">
                  Proceed to Checkout
                </Link>
                <Link to="/products"
                  className="block w-full py-3 text-center text-indigo-600 font-semibold hover:bg-indigo-50 dark:hover:bg-indigo-950/50 rounded-xl transition-colors">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default CartPage;
