import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import { Lock, ChevronRight, Truck, ArrowLeft } from 'lucide-react';

const PROJECT_ID = window.location.hostname.split('.')[0];
const SHIPPING_RULES = "Free shipping on all orders";

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const [shippingCost, setShippingCost] = useState(0);
  const [tax, setTax] = useState(0);
  const [taxRate, setTaxRate] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [address, setAddress] = useState({
    name: user?.name || '', email: user?.email || '',
    address: '', city: '', state: '', zip: '', country: 'US',
  });

  useEffect(() => { if (cart.length === 0) navigate('/cart'); }, []);

  useEffect(() => {
    if (cart.length === 0) return;
    supabase.functions.invoke('calculate-shipping', {
      body: { cartItems: cart.map(i => ({ name: i.name, quantity: i.quantity, price: i.price })), shippingRules: SHIPPING_RULES, subtotal: cartTotal }
    }).then(({ data }) => { if (data?.success) setShippingCost(data.shippingCents); });
  }, [cart, cartTotal]);

  useEffect(() => {
    if (!address.state || cart.length === 0) return;
    const t = setTimeout(() => {
      supabase.functions.invoke('calculate-tax', { body: { state: address.state, subtotal: cartTotal } })
        .then(({ data }) => { if (data?.success) { setTax(data.taxCents); setTaxRate(data.taxRate); } });
    }, 500);
    return () => clearTimeout(t);
  }, [address.state, cartTotal]);

  const total = cartTotal + shippingCost + tax;
  const formValid = address.name && address.email && address.address && address.city && address.state && address.zip;

  const handlePlaceOrder = async () => {
    if (!formValid || processing) return;
    setProcessing(true);

    let paymentIntentId: string | null = null;
    try {
      const { data } = await supabase.functions.invoke('create-payment-intent', { body: { amount: total, currency: 'usd' } });
      if (data?.paymentIntentId) paymentIntentId = data.paymentIntentId;
    } catch {}

    const { data: customer } = await supabase.from('ecom_customers')
      .upsert({ email: address.email, name: address.name }, { onConflict: 'email' }).select('id').single();

    const { data: order } = await supabase.from('ecom_orders').insert({
      customer_id: customer?.id, status: 'paid', subtotal: cartTotal, tax, shipping: shippingCost,
      total, shipping_address: address, stripe_payment_intent_id: paymentIntentId,
    }).select('id').single();

    if (order) {
      await supabase.from('ecom_order_items').insert(cart.map(item => ({
        order_id: order.id, product_id: item.product_id, variant_id: item.variant_id || null,
        product_name: item.name, variant_title: item.variant_title || null, sku: item.sku || null,
        quantity: item.quantity, unit_price: item.price, total: item.price * item.quantity,
      })));
      try {
        await fetch(`https://famous.ai/api/ecommerce/${PROJECT_ID}/send-confirmation`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId: order.id, customerEmail: address.email, customerName: address.name, subtotal: cartTotal, shipping: shippingCost, tax, total, shippingAddress: address }),
        });
      } catch {}
    }

    clearCart();
    navigate('/order-confirmation', { state: { orderId: order?.id, total, email: address.email } });
  };

  const inputClass = 'w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all';

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <Header />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link to="/cart" className="hover:text-indigo-600">Cart</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-indigo-600 font-medium">Checkout</span>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Shipping Information</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                  <input placeholder="John Doe" value={address.name} onChange={e => setAddress({ ...address, name: e.target.value })} className={inputClass} /></div>
                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                  <input type="email" placeholder="john@example.com" value={address.email} onChange={e => setAddress({ ...address, email: e.target.value })} className={inputClass} /></div>
              </div>
              <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Street Address</label>
                <input placeholder="123 Main Street" value={address.address} onChange={e => setAddress({ ...address, address: e.target.value })} className={inputClass} /></div>
              <div className="grid grid-cols-3 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">City</label>
                  <input placeholder="San Francisco" value={address.city} onChange={e => setAddress({ ...address, city: e.target.value })} className={inputClass} /></div>
                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">State</label>
                  <input placeholder="CA" maxLength={2} value={address.state} onChange={e => setAddress({ ...address, state: e.target.value.toUpperCase() })} className={inputClass} /></div>
                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ZIP Code</label>
                  <input placeholder="94102" value={address.zip} onChange={e => setAddress({ ...address, zip: e.target.value })} className={inputClass} /></div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 rounded-xl">
              <p className="text-sm text-amber-800 dark:text-amber-200 font-medium">Stripe credit card payments will be enabled once connected from the Payments tab.</p>
            </div>

            <button onClick={handlePlaceOrder} disabled={!formValid || processing}
              className="w-full mt-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-xl shadow-indigo-500/20">
              <Lock className="w-4 h-4" /> {processing ? 'Processing...' : 'Place Order'}
            </button>
          </div>

          <div className="lg:col-span-2">
            <div className="sticky top-24 bg-gray-50 dark:bg-gray-900 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Order Summary</h3>
              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {cart.map(item => (
                  <div key={item.product_id + (item.variant_id || '')} className="flex gap-3">
                    {item.image && <img src={item.image} alt={item.name} className="w-14 h-14 rounded-lg object-cover flex-shrink-0" />}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{item.name}</p>
                      {item.variant_title && <p className="text-xs text-gray-500">{item.variant_title}</p>}
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">${((item.price * item.quantity) / 100).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-200 dark:border-gray-800 pt-4 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span className="font-semibold text-gray-900 dark:text-white">${(cartTotal / 100).toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Shipping</span><span className="font-semibold text-green-600">{shippingCost === 0 ? 'Free' : `$${(shippingCost / 100).toFixed(2)}`}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Tax{taxRate > 0 ? ` (${taxRate}%)` : ''}</span><span className="font-semibold text-gray-900 dark:text-white">${(tax / 100).toFixed(2)}</span></div>
                <div className="border-t border-gray-200 dark:border-gray-800 pt-3 flex justify-between">
                  <span className="font-bold text-gray-900 dark:text-white">Total</span>
                  <span className="text-xl font-black text-gray-900 dark:text-white">${(total / 100).toFixed(2)}</span>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950/50 rounded-xl">
                <Truck className="w-4 h-4 text-green-600 flex-shrink-0" />
                <p className="text-xs text-green-700 dark:text-green-400 font-medium">Free shipping on all orders</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
