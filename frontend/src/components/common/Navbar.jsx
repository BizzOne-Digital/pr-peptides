import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { IconCart, IconSearch, IconMenu, IconX } from './Icons';
import CartDrawer from './CartDrawer';

const navLinks = [
  { label: 'Home',    to: '/' },
  { label: 'Shop',    to: '/shop' },
  { label: 'Quality', to: '/quality' },
  { label: 'About',   to: '/about' },
  { label: 'Contact', to: '/contact' },
];

const Navbar = () => {
  const [scrolled,    setScrolled]    = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const { itemCount, setIsOpen } = useCart();
  const location = useLocation();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  // close mobile on route change
  useEffect(() => { setMobileOpen(false); }, [location]);

  const isActive = (to) => location.pathname === to;

  return (
    <>
      {/* ---- TOP TICKER ---- */}
      <div style={{
        background: 'rgba(59,130,246,0.08)',
        borderBottom: '1px solid rgba(59,130,246,0.18)',
        padding: '7px 0', overflow: 'hidden',
      }}>
        <div className="ticker-content" style={{ gap: '60px' }}>
          {[0, 1].map(k => (
            <React.Fragment key={k}>
              {['RESEARCH USE ONLY','LAB-TESTED QUALITY','TRANSPARENT SOURCING',
                'COA AVAILABLE','99%+ PURITY STANDARD','FREE SHIPPING OVER $100'].map(t => (
                <span key={t} style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  color: '#60a5fa', fontSize: '11px', fontWeight: 700,
                  letterSpacing: '0.06em', paddingRight: '60px',
                }}>
                  <span style={{ width:4, height:4, borderRadius:'50%', background:'#3b82f6', display:'inline-block' }} />
                  {t}
                </span>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* ---- MAIN NAV ---- */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: scrolled ? 'rgba(2,8,23,0.97)' : 'rgba(2,8,23,0.85)',
        backdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${scrolled ? 'rgba(59,130,246,0.3)' : 'rgba(30,58,95,0.4)'}`,
        boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.5)' : 'none',
        transition: 'all 0.3s ease',
      }}>
        <div className="container" style={{ height: 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

          {/* LOGO */}
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            <img src="/logo.png" alt="PR Peptides" style={{ height: 48, width: 'auto', objectFit: 'contain' }} />
          </Link>

          {/* DESKTOP LINKS */}
          <div className="hide-mobile" style={{ display:'flex', gap:2, alignItems:'center' }}>
            {navLinks.map(l => (
              <Link key={l.to} to={l.to} style={{
                color: isActive(l.to) ? '#3b82f6' : '#94a3b8',
                fontSize: 14, fontWeight: 500,
                padding: '8px 14px', borderRadius: 8,
                textDecoration: 'none',
                background: isActive(l.to) ? 'rgba(59,130,246,0.1)' : 'transparent',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { if (!isActive(l.to)) { e.target.style.color='#fff'; e.target.style.background='rgba(59,130,246,0.08)'; }}}
              onMouseLeave={e => { if (!isActive(l.to)) { e.target.style.color='#94a3b8'; e.target.style.background='transparent'; }}}>
                {l.label}
              </Link>
            ))}
          </div>

          {/* ACTIONS */}
          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
            {/* Cart */}
            <button onClick={() => setIsOpen(true)} style={{
              background:'none', border:'none', cursor:'pointer',
              color:'#94a3b8', padding:8, borderRadius:8,
              display:'flex', position:'relative', transition:'color 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.color='#fff'}
            onMouseLeave={e => e.currentTarget.style.color='#94a3b8'}>
              <IconCart size={21}/>
              {itemCount > 0 && (
                <span style={{
                  position:'absolute', top:2, right:2,
                  background:'#3b82f6', color:'#fff', fontSize:10, fontWeight:700,
                  width:17, height:17, borderRadius:'50%',
                  display:'flex', alignItems:'center', justifyContent:'center',
                }}>{itemCount}</span>
              )}
            </button>

            {/* Shop Now — desktop */}
            <Link to="/shop" className="hide-mobile" style={{ textDecoration:'none' }}>
              <button className="btn-primary" style={{ padding:'8px 20px', fontSize:13 }}>Shop Now</button>
            </Link>

            {/* Hamburger — mobile */}
            <button
              className="show-mobile"
              onClick={() => setMobileOpen(true)}
              style={{ background:'rgba(30,58,95,0.4)', border:'1px solid rgba(59,130,246,0.2)', color:'#94a3b8', padding:8, borderRadius:8, cursor:'pointer', display:'none', alignItems:'center', justifyContent:'center' }}>
              <IconMenu size={22}/>
            </button>
          </div>
        </div>
      </nav>

      {/* ---- MOBILE MENU ---- */}
      <div className={`mobile-menu ${mobileOpen ? 'open' : ''}`}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:40 }}>
          <img src="/logo.png" alt="PR Peptides" style={{ height: 42, width: 'auto', objectFit: 'contain' }} />
          <button onClick={() => setMobileOpen(false)} style={{ background:'rgba(30,58,95,0.5)', border:'none', color:'#94a3b8', cursor:'pointer', width:36, height:36, borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <IconX size={20}/>
          </button>
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:4, flex:1 }}>
          {navLinks.map(l => (
            <Link key={l.to} to={l.to} style={{
              color: isActive(l.to) ? '#3b82f6' : '#e2e8f0',
              fontSize:18, fontWeight:600, padding:'14px 16px',
              borderRadius:12, textDecoration:'none',
              background: isActive(l.to) ? 'rgba(59,130,246,0.15)' : 'transparent',
              borderLeft: isActive(l.to) ? '3px solid #3b82f6' : '3px solid transparent',
              transition:'all 0.2s',
            }}>
              {l.label}
            </Link>
          ))}
        </div>

        <div style={{ paddingTop:24, borderTop:'1px solid rgba(30,58,95,0.5)', marginTop:24 }}>
          <Link to="/shop" style={{ textDecoration:'none' }}>
            <button className="btn-primary" style={{ width:'100%', justifyContent:'center', padding:'14px', fontSize:16 }}>
              Shop Now
            </button>
          </Link>
          <p style={{ color:'#334155', fontSize:11, textAlign:'center', marginTop:16 }}>For Research Use Only</p>
        </div>
      </div>

      <CartDrawer/>
    </>
  );
};

export default Navbar;