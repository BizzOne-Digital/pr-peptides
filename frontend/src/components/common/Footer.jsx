import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../../utils/api';
import toast from 'react-hot-toast';
import { IconEmail, IconPhone, IconArrowRight } from './Icons';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await API.post('/subscribers', { email });
      toast.success('Successfully subscribed!', { style:{ background:'#0d1526', color:'#fff', border:'1px solid #10b981' } });
      setEmail('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Subscription failed');
    } finally { setLoading(false); }
  };

  return (
    <footer style={{ background:'#020817', borderTop:'1px solid rgba(30,58,95,0.55)', paddingTop:60 }}>
      <div className="container">
        <div className="footer-grid" style={{ paddingBottom:48 }}>

          {/* Brand */}
          <div>
            <div style={{ marginBottom:14 }}>
              <img src="/logo.png" alt="PR Peptides" style={{ height:48, width:'auto', objectFit:'contain' }}/>
            </div>
            <p style={{ color:'#64748b', fontSize:13, lineHeight:1.85, maxWidth:280 }}>
              Carefully sourced research compounds backed by complete transparency, lab-tested quality, and reliable documentation.
            </p>
            <div style={{ marginTop:18, display:'flex', flexDirection:'column', gap:9 }}>
              {[
                { icon:<IconEmail size={13} color="#3b82f6"/>, text:'benitz@hotmail.com' },
                { icon:<IconPhone size={13} color="#3b82f6"/>, text:'+383 44 108 882' },
              ].map((x,i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:8, color:'#64748b', fontSize:13 }}>
                  {x.icon} {x.text}
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color:'#fff', fontWeight:700, fontSize:14, marginBottom:18 }}>Quick Links</h4>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {[['Home','/'],[  'Shop','/shop'],['Quality','/quality'],['About Us','/about'],['Contact','/contact']].map(([l,to]) => (
                <Link key={to} to={to} style={{ color:'#64748b', fontSize:13, textDecoration:'none', transition:'color 0.2s' }}
                  onMouseEnter={e=>e.target.style.color='#60a5fa'}
                  onMouseLeave={e=>e.target.style.color='#64748b'}>{l}</Link>
              ))}
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 style={{ color:'#fff', fontWeight:700, fontSize:14, marginBottom:18 }}>Products</h4>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {['SLU-PP-332','Epithalon','KPV','Retatrutide','BPC-157','TB-500'].map(p => (
                <Link key={p} to="/shop" style={{ color:'#64748b', fontSize:13, textDecoration:'none', transition:'color 0.2s' }}
                  onMouseEnter={e=>e.target.style.color='#60a5fa'}
                  onMouseLeave={e=>e.target.style.color='#64748b'}>{p}</Link>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 style={{ color:'#fff', fontWeight:700, fontSize:14, marginBottom:8 }}>Stay Updated</h4>
            <p style={{ color:'#64748b', fontSize:13, marginBottom:16 }}>Subscribe for research updates and new product alerts.</p>
            <form onSubmit={handleSubscribe} style={{ display:'flex', gap:8 }}>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Your email" className="input-dark" style={{ flex:1, fontSize:13, padding:'10px 14px' }}/>
              <button type="submit" disabled={loading} className="btn-primary" style={{ padding:'10px 14px', flexShrink:0 }}>
                <IconArrowRight size={16}/>
              </button>
            </form>
            <div style={{ marginTop:18, padding:14, background:'rgba(59,130,246,0.05)', borderRadius:10, border:'1px solid rgba(59,130,246,0.15)' }}>
              <p style={{ color:'#475569', fontSize:12, lineHeight:1.7 }}>
                ⚠️ <strong style={{ color:'#64748b' }}>For Research Use Only</strong> — Not for human consumption. All products are sold for research purposes only.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div style={{ borderTop:'1px solid rgba(30,58,95,0.4)', padding:'20px 0', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:10 }}>
          <p style={{ color:'#334155', fontSize:12 }}>© 2025 PR Peptides Research. All rights reserved.</p>
          <p style={{ color:'#334155', fontSize:12 }}>Research Use Only — Not for Human Consumption</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;