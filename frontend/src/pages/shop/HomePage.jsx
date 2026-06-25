import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import API from '../../utils/api';
import ProductCard from '../../components/common/ProductCard';
import { IconFlask, IconShield, IconMicroscope, IconFileCheck, IconGlobe, IconArrowRight, IconDna } from '../../components/common/Icons';

/* Intersection observer hook for scroll animations */
const useInView = (threshold = 0.15) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
};

const stats    = [
  { value:'100%',  label:'Lab Tested' },
  { value:'99%+',  label:'Purity Standard' },
  { value:'500+',  label:'Batches Tested' },
  { value:'1000+', label:'Researchers Trust Us' },
];

const features = [
  { icon:<IconFlask    size={32} color="#3b82f6"/>, title:'Third-Party Lab Tested',  desc:'Every batch undergoes rigorous third-party testing to verify purity, potency, and composition before release.' },
  { icon:<IconFileCheck size={32} color="#3b82f6"/>, title:'COA Available',           desc:'Full Certificate of Analysis for every product — complete batch-level transparency you can verify independently.' },
  { icon:<IconShield   size={32} color="#3b82f6"/>, title:'Transparent Sourcing',    desc:'We disclose our sourcing methods so you always know exactly what you are working with in your research.' },
  { icon:<IconDna      size={32} color="#3b82f6"/>, title:'99%+ Purity Standard',   desc:'Our internal benchmark requires 99%+ purity — no compromises on compound integrity, ever.' },
];

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);

  const [statsRef,    statsInView]    = useInView();
  const [featRef,     featInView]     = useInView();
  const [productsRef, productsInView] = useInView();
  const [ctaRef,      ctaInView]      = useInView();

  useEffect(() => {
    API.get('/products?featured=true&limit=6')
      .then(r => setProducts(r.data.products))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
{/* ====== HERO ====== */}
      <section style={{ position:'relative', minHeight:'92vh', display:'flex', alignItems:'center', overflow:'hidden' }}>
        {/* Full bg image — hero.png */}
        <div style={{ position:'absolute', inset:0, backgroundImage:'url(/hero.png)', backgroundSize:'cover', backgroundPosition:'center', backgroundRepeat:'no-repeat' }}/>
        {/* Dark overlay so text is readable */}
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(90deg, rgba(2,8,23,0.92) 0%, rgba(2,8,23,0.75) 50%, rgba(2,8,23,0.35) 100%)' }}/>
        {/* Bottom fade */}
        <div style={{ position:'absolute', bottom:0, left:0, right:0, height:160, background:'linear-gradient(to top, #020817 0%, transparent 100%)' }}/>

        <div className="container" style={{ position:'relative', zIndex:1, padding:'80px 24px' }}>
          {/* LEFT content only — no right column */}
          <div style={{ maxWidth:640, animation:'fadeInLeft 0.8s ease forwards' }}>
            <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(59,130,246,0.12)', border:'1px solid rgba(59,130,246,0.35)', borderRadius:20, padding:'8px 18px', marginBottom:28 }}>
              <span style={{ width:8, height:8, borderRadius:'50%', background:'#3b82f6', display:'inline-block', animation:'pulse 2s infinite' }}/>
              <span style={{ color:'#60a5fa', fontSize:12, fontWeight:700, letterSpacing:'0.07em' }}>PREMIUM QUALITY. VERIFIED RESULTS.</span>
            </div>

            <h1 style={{ fontSize:'clamp(38px,5.5vw,68px)', fontWeight:900, lineHeight:1.06, color:'#fff', marginBottom:22, letterSpacing:'-0.03em' }}>
              Research Peptides<br/>
              Built on <span style={{ color:'#3b82f6' }}>Purity,</span><br/>
              <span style={{ color:'#3b82f6' }}>Testing &amp; Transparency</span>
            </h1>

            <p style={{ color:'#94a3b8', fontSize:'clamp(15px,2vw,18px)', lineHeight:1.9, marginBottom:40, maxWidth:500 }}>
              Carefully sourced research compounds backed by transparent quality control, batch testing, and reliable documentation.
            </p>

            <div style={{ display:'flex', gap:14, marginBottom:48, flexWrap:'wrap' }}>
              <Link to="/shop"><button className="btn-primary" style={{ padding:'15px 34px', fontSize:15 }}>Shop Products <IconArrowRight size={17}/></button></Link>
              <Link to="/quality"><button className="btn-outline" style={{ padding:'15px 34px', fontSize:15 }}>Quality Standards</button></Link>
            </div>

            <div style={{ display:'flex', gap:20, flexWrap:'wrap' }}>
              {['Lab Tested','Research Use Only','COA Available','Carefully Sourced'].map(b => (
                <div key={b} style={{ display:'flex', alignItems:'center', gap:6, color:'#64748b', fontSize:13 }}>
                  <span style={{ width:5, height:5, borderRadius:'50%', background:'#3b82f6', display:'inline-block' }}/>
                  {b}
                </div>
              ))}
            </div>

            {/* disclaimer */}
            <div style={{ marginTop:40, padding:'10px 18px', background:'rgba(30,58,95,0.25)', borderRadius:10, border:'1px solid rgba(30,58,95,0.45)', display:'inline-flex', alignItems:'center', gap:8 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <span style={{ color:'#64748b', fontSize:12 }}>For Research Use Only. Not for human consumption.</span>
            </div>
          </div>
        </div>
      </section>

            {/* ====== STATS ====== */}
      <section ref={statsRef} style={{ background:'rgba(13,21,38,0.85)', borderTop:'1px solid rgba(30,58,95,0.4)', borderBottom:'1px solid rgba(30,58,95,0.4)', padding:'28px 0' }}>
        <div className="container">
          <div className="grid-4" style={{ gap:0 }}>
            {stats.map((s,i) => (
              <div key={i} style={{
                textAlign:'center', padding:'16px 10px',
                borderRight: i < 3 ? '1px solid rgba(30,58,95,0.4)' : 'none',
                animation: statsInView ? `fadeInUp 0.6s ease ${i*0.1}s forwards` : 'none',
                opacity: statsInView ? undefined : 0,
              }}>
                <p style={{ color:'#3b82f6', fontWeight:800, fontSize:'clamp(26px,4vw,38px)', letterSpacing:'-0.02em' }}>{s.value}</p>
                <p style={{ color:'#64748b', fontSize:13, marginTop:4 }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== FEATURED PRODUCTS ====== */}
      <section ref={productsRef} style={{ padding:'80px 0', background:'#020817' }}>
        <div className="container">
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:40, flexWrap:'wrap', gap:12,
            animation: productsInView ? 'fadeInUp 0.7s ease forwards' : 'none',
            opacity: productsInView ? undefined : 0,
          }}>
            <div>
              <p style={{ color:'#3b82f6', fontSize:12, fontWeight:700, letterSpacing:'0.1em', marginBottom:8 }}>FEATURED PRODUCTS</p>
              <h2 style={{ color:'#fff', fontWeight:800, fontSize:'clamp(26px,4vw,38px)', letterSpacing:'-0.02em' }}>Popular Peptides</h2>
            </div>
            <Link to="/shop" style={{ display:'flex', alignItems:'center', gap:6, color:'#60a5fa', fontSize:14, fontWeight:600, textDecoration:'none' }}>
              View All Products <IconArrowRight size={16}/>
            </Link>
          </div>

          {loading ? (
            <div className="grid-3">
              {[...Array(6)].map((_,i) => (
                <div key={i} style={{ height:360, background:'rgba(13,21,38,0.8)', borderRadius:16, border:'1px solid rgba(30,58,95,0.4)' }}/>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid-3">
              {products.map((p,i) => (
                <div key={p._id} style={{ animation: productsInView ? `fadeInUp 0.6s ease ${i*0.08}s forwards` : 'none', opacity: productsInView ? undefined : 0 }}>
                  <ProductCard product={p}/>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign:'center', padding:'80px 20px', color:'#475569' }}>
              <p style={{ fontSize:18, marginBottom:8 }}>Products coming soon</p>
              <p style={{ fontSize:14 }}>Admin can add products from the dashboard</p>
            </div>
          )}
        </div>
      </section>

      {/* ====== FEATURES ====== */}
      <section ref={featRef} style={{ padding:'80px 0', background:'rgba(13,21,38,0.55)' }}>
        <div className="container">
          <div style={{ textAlign:'center', marginBottom:56, animation: featInView ? 'fadeInUp 0.7s ease forwards' : 'none', opacity: featInView ? undefined : 0 }}>
            <p style={{ color:'#3b82f6', fontSize:12, fontWeight:700, letterSpacing:'0.1em', marginBottom:12 }}>WHY CHOOSE PR PEPTIDES</p>
            <h2 style={{ color:'#fff', fontWeight:800, fontSize:'clamp(28px,4vw,42px)', letterSpacing:'-0.02em', marginBottom:14 }}>Quality You Can Trust</h2>
            <p style={{ color:'#64748b', fontSize:'clamp(14px,2vw,17px)', maxWidth:580, margin:'0 auto' }}>Every compound we offer meets the highest standards in the research peptide industry.</p>
          </div>
          <div className="grid-2">
            {features.map((f,i) => (
              <div key={i} className="glass-card" style={{
                padding:'28px 32px', display:'flex', gap:20, alignItems:'flex-start',
                animation: featInView ? `fadeInUp 0.6s ease ${i*0.1}s forwards` : 'none',
                opacity: featInView ? undefined : 0,
              }}>
                <div style={{ width:56, height:56, borderRadius:14, background:'rgba(59,130,246,0.1)', border:'1px solid rgba(59,130,246,0.2)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  {f.icon}
                </div>
                <div>
                  <h3 style={{ color:'#fff', fontWeight:700, fontSize:'clamp(15px,2vw,18px)', marginBottom:8 }}>{f.title}</h3>
                  <p style={{ color:'#64748b', fontSize:14, lineHeight:1.75 }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== TRUST STRIP ====== */}
      <section style={{ padding:'48px 0', background:'#020817', borderTop:'1px solid rgba(30,58,95,0.3)' }}>
        <div className="container">
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:20 }}>
            {[
              { icon:<IconFlask    size={28} color="#3b82f6"/>, t:'Lab Tested',           s:'Third-Party Verified' },
              { icon:<IconShield   size={28} color="#3b82f6"/>, t:'99%+ Purity',          s:'Quality Standard' },
              { icon:<IconFileCheck size={28} color="#3b82f6"/>, t:'COA Available',        s:'Batch Transparency' },
              { icon:<IconGlobe   size={28} color="#3b82f6"/>, t:'Transparent Sourcing', s:'Premium Materials' },
              { icon:<IconMicroscope size={28} color="#3b82f6"/>, t:'Research Only',       s:'Not for Human Use' },
            ].map((x,i) => (
              <div key={i} style={{ textAlign:'center', padding:'20px 12px' }}>
                <div style={{ width:52, height:52, borderRadius:14, background:'rgba(59,130,246,0.08)', border:'1px solid rgba(59,130,246,0.15)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 12px' }}>
                  {x.icon}
                </div>
                <p style={{ color:'#e2e8f0', fontWeight:700, fontSize:14 }}>{x.t}</p>
                <p style={{ color:'#475569', fontSize:12, marginTop:3 }}>{x.s}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== CTA ====== */}
      <section ref={ctaRef} style={{ padding:'80px 0', background:'rgba(13,21,38,0.5)' }}>
        <div className="container">
          <div style={{
            background:'rgba(13,21,38,0.9)', border:'1px solid rgba(30,58,95,0.6)',
            borderRadius:24, padding:'clamp(36px,6vw,64px)', textAlign:'center',
            position:'relative', overflow:'hidden',
            animation: ctaInView ? 'scaleIn 0.7s ease forwards' : 'none',
            opacity: ctaInView ? undefined : 0,
          }}>
            <div style={{ position:'absolute', inset:0, background:'radial-gradient(circle at center,rgba(59,130,246,0.08) 0%,transparent 70%)' }}/>
            <p style={{ color:'#3b82f6', fontSize:12, fontWeight:700, letterSpacing:'0.1em', marginBottom:14, position:'relative' }}>START YOUR RESEARCH</p>
            <h2 style={{ color:'#fff', fontWeight:800, fontSize:'clamp(24px,4vw,42px)', letterSpacing:'-0.02em', marginBottom:14, position:'relative' }}>
              Ready to Explore Our<br/>Research Compounds?
            </h2>
            <p style={{ color:'#64748b', fontSize:'clamp(14px,2vw,17px)', marginBottom:32, position:'relative' }}>
              Browse our complete catalog of lab-tested, COA-backed research peptides.
            </p>
            <Link to="/shop" style={{ position:'relative' }}>
              <button className="btn-primary" style={{ padding:'15px 40px', fontSize:16 }}>
                Browse All Products <IconArrowRight size={18}/>
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;