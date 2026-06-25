import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import API from '../../utils/api';
import toast from 'react-hot-toast';
import { IconCheck } from '../../components/common/Icons';

const CheckoutPage = () => {
  const { cart, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading,  setLoading]  = useState(false);
  const [success,  setSuccess]  = useState(false);
  const [orderNum, setOrderNum] = useState('');
  const [form, setForm] = useState({ name:'', email:'', phone:'', street:'', city:'', state:'', zipCode:'', country:'', notes:'' });
  const set = (k,v) => setForm(p => ({ ...p, [k]:v }));
  const shippingCost = total >= 100 ? 0 : 9.99;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cart.length) return;
    setLoading(true);
    try {
      const res = await API.post('/orders', {
        customer: { name:form.name, email:form.email, phone:form.phone },
        shippingAddress: { street:form.street, city:form.city, state:form.state, zipCode:form.zipCode, country:form.country },
        items: cart.map(i => ({ productId:i._id, quantity:i.quantity })),
        paymentMethod:'manual', notes:form.notes,
      });
      setOrderNum(res.data.order.orderNumber);
      setSuccess(true);
      clearCart();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Order failed');
    } finally { setLoading(false); }
  };

  if (success) return (
    <div style={{ minHeight:'100vh', background:'#020817', display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}>
      <div style={{ textAlign:'center', maxWidth:480, animation:'scaleIn 0.6s ease forwards' }}>
        <div style={{ width:80, height:80, borderRadius:'50%', background:'rgba(16,185,129,0.15)', border:'2px solid #10b981', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 24px' }}>
          <IconCheck size={40} color="#10b981"/>
        </div>
        <h1 style={{ color:'#fff', fontWeight:800, fontSize:'clamp(24px,4vw,34px)', marginBottom:10 }}>Order Confirmed!</h1>
        <p style={{ color:'#3b82f6', fontWeight:700, fontSize:20, marginBottom:12 }}>#{orderNum}</p>
        <p style={{ color:'#64748b', fontSize:15, marginBottom:32 }}>A confirmation email has been sent. We'll process your order shortly.</p>
        <button onClick={() => navigate('/shop')} className="btn-primary" style={{ padding:'14px 32px' }}>Continue Shopping</button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight:'100vh', background:'#020817', padding:'60px 0 80px' }}>
      <div className="container">
        <h1 style={{ color:'#fff', fontWeight:800, fontSize:'clamp(26px,4vw,36px)', marginBottom:36 }}>Checkout</h1>
        <form onSubmit={handleSubmit}>
          {/* Stack on mobile, side-by-side on desktop */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:28, alignItems:'start' }}>

            {/* Forms */}
            <div>
              <div className="glass-card" style={{ padding:28, marginBottom:20 }}>
                <h3 style={{ color:'#fff', fontWeight:700, fontSize:17, marginBottom:20 }}>Contact Information</h3>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:14 }}>
                  {[['name','Full Name','text',true],['email','Email Address','email',true],['phone','Phone Number','tel',false]].map(([k,l,t,r]) => (
                    <div key={k} style={{ gridColumn: k==='phone' ? '1 / -1' : 'auto' }}>
                      <label style={{ color:'#94a3b8', fontSize:12, fontWeight:600, display:'block', marginBottom:7 }}>{l}{r?' *':''}</label>
                      <input type={t} required={r} value={form[k]} onChange={e=>set(k,e.target.value)} className="input-dark"/>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card" style={{ padding:28, marginBottom:20 }}>
                <h3 style={{ color:'#fff', fontWeight:700, fontSize:17, marginBottom:20 }}>Shipping Address</h3>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:14 }}>
                  {[['street','Street Address','1 / -1'],['city','City',''],['state','State/Province',''],['zipCode','ZIP Code',''],['country','Country','']].map(([k,l,gc]) => (
                    <div key={k} style={ gc ? { gridColumn:gc } : {}}>
                      <label style={{ color:'#94a3b8', fontSize:12, fontWeight:600, display:'block', marginBottom:7 }}>{l}</label>
                      <input type="text" value={form[k]} onChange={e=>set(k,e.target.value)} className="input-dark"/>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card" style={{ padding:28 }}>
                <label style={{ color:'#94a3b8', fontSize:12, fontWeight:600, display:'block', marginBottom:7 }}>Order Notes (optional)</label>
                <textarea value={form.notes} onChange={e=>set('notes',e.target.value)} className="input-dark" rows={3} style={{ resize:'vertical' }} placeholder="Special instructions..."/>
              </div>
            </div>

            {/* Summary */}
            <div>
              <div className="glass-card" style={{ padding:26 }}>
                <h3 style={{ color:'#fff', fontWeight:700, fontSize:17, marginBottom:18 }}>Order Summary</h3>
                {cart.map(item => (
                  <div key={item._id} style={{ display:'flex', justifyContent:'space-between', padding:'10px 0', borderBottom:'1px solid rgba(30,58,95,0.4)' }}>
                    <div>
                      <p style={{ color:'#e2e8f0', fontSize:14, fontWeight:500 }}>{item.name}</p>
                      <p style={{ color:'#64748b', fontSize:12 }}>{item.dosage} × {item.quantity}</p>
                    </div>
                    <span style={{ color:'#3b82f6', fontWeight:700 }}>${(item.price*item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div style={{ marginTop:14 }}>
                  {[['Subtotal', `$${total.toFixed(2)}`],['Shipping', shippingCost===0 ? 'FREE' : `$${shippingCost}`]].map(([l,v]) => (
                    <div key={l} style={{ display:'flex', justifyContent:'space-between', padding:'7px 0', color:'#94a3b8', fontSize:14 }}>
                      <span>{l}</span><span style={ l==='Shipping' && shippingCost===0 ? { color:'#34d399' } : {}}>{v}</span>
                    </div>
                  ))}
                  <div style={{ display:'flex', justifyContent:'space-between', padding:'14px 0 0', borderTop:'1px solid rgba(30,58,95,0.4)', marginTop:6 }}>
                    <span style={{ color:'#fff', fontWeight:700, fontSize:17 }}>Total</span>
                    <span style={{ color:'#3b82f6', fontWeight:800, fontSize:22 }}>${(total+shippingCost).toFixed(2)}</span>
                  </div>
                </div>
                <div style={{ margin:'14px 0', padding:12, background:'rgba(59,130,246,0.05)', borderRadius:10, border:'1px solid rgba(59,130,246,0.1)' }}>
                  <p style={{ color:'#475569', fontSize:12, lineHeight:1.65 }}>Payment instructions will be sent via email after order confirmation.</p>
                </div>
                <button type="submit" disabled={loading||!cart.length} className="btn-primary" style={{ width:'100%', justifyContent:'center', padding:14 }}>
                  {loading ? 'Placing Order...' : 'Place Order'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
