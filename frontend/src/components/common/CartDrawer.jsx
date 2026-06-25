import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { IconX, IconTrash, IconCart } from './Icons';

const CartDrawer = () => {
  const { cart, isOpen, setIsOpen, removeFromCart, updateQty, total, itemCount } = useCart();
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <>
      <div onClick={() => setIsOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 200, backdropFilter: 'blur(4px)' }} />
      <div style={{ position: 'fixed', right: 0, top: 0, bottom: 0, width: '420px', maxWidth: '100vw', background: '#0d1526', borderLeft: '1px solid rgba(30,58,95,0.8)', zIndex: 201, display: 'flex', flexDirection: 'column', boxShadow: '-20px 0 60px rgba(0,0,0,0.5)' }}>
        {/* Header */}
        <div style={{ padding: '24px', borderBottom: '1px solid rgba(30,58,95,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <IconCart size={22} color="#3b82f6" />
            <h2 style={{ color: '#fff', fontSize: '18px', fontWeight: 700 }}>Cart ({itemCount})</h2>
          </div>
          <button onClick={() => setIsOpen(false)} style={{ background: 'rgba(30,58,95,0.5)', border: 'none', color: '#94a3b8', cursor: 'pointer', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <IconX size={18} />
          </button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#475569' }}>
              <IconCart size={48} color="#1e3a5f" />
              <p style={{ marginTop: '16px', fontSize: '15px' }}>Your cart is empty</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item._id} style={{ display: 'flex', gap: '12px', padding: '16px', marginBottom: '8px', background: 'rgba(30,58,95,0.2)', borderRadius: '12px', border: '1px solid rgba(30,58,95,0.4)' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '10px', background: 'rgba(30,58,95,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {item.images?.[0] ? <img src={item.images[0]} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }} /> : <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.5"><path d="M10 2v6.292a1 1 0 01-.172.557L3.6 17.6A2 2 0 005.244 21h13.512A2 2 0 0020.4 17.6l-6.228-8.751A1 1 0 0114 8.293V2"/><path d="M8.5 2h7"/></svg>}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ color: '#e2e8f0', fontWeight: 600, fontSize: '14px', marginBottom: '4px' }}>{item.name}</p>
                  <p style={{ color: '#60a5fa', fontSize: '12px', marginBottom: '8px' }}>{item.dosage}</p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button onClick={() => updateQty(item._id, item.quantity - 1)} style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'rgba(30,58,95,0.6)', border: '1px solid rgba(59,130,246,0.3)', color: '#fff', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                      <span style={{ color: '#fff', fontWeight: 600, minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
                      <button onClick={() => updateQty(item._id, item.quantity + 1)} style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'rgba(30,58,95,0.6)', border: '1px solid rgba(59,130,246,0.3)', color: '#fff', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ color: '#3b82f6', fontWeight: 700 }}>${(item.price * item.quantity).toFixed(2)}</span>
                      <button onClick={() => removeFromCart(item._id)} style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', display: 'flex' }}>
                        <IconTrash size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div style={{ padding: '20px', borderTop: '1px solid rgba(30,58,95,0.6)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <span style={{ color: '#94a3b8', fontSize: '15px' }}>Subtotal</span>
              <span style={{ color: '#fff', fontSize: '18px', fontWeight: 700 }}>${total.toFixed(2)}</span>
            </div>
            <p style={{ color: '#475569', fontSize: '12px', marginBottom: '12px', textAlign: 'center' }}>Free shipping on orders over $100</p>
            <button onClick={() => { setIsOpen(false); navigate('/checkout'); }} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px' }}>
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
