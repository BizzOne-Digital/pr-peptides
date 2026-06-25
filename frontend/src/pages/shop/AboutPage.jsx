import React from 'react';
import { Link } from 'react-router-dom';
import { IconShield, IconFlask, IconDna, IconArrowRight } from '../../components/common/Icons';

const values = [
  { icon:<IconFlask  size={26} color="#3b82f6"/>, title:'Scientific Integrity',  desc:'No inflated claims, no unverified promises. Just accurate data and transparent sourcing.' },
  { icon:<IconShield size={26} color="#3b82f6"/>, title:'Quality Above All',     desc:'Every process, every batch, every product is held to our strict internal standards.' },
  { icon:<IconDna    size={26} color="#3b82f6"/>, title:'Researcher First',      desc:'Everything we do is designed with the researcher in mind — from product specs to documentation.' },
];

const AboutPage = () => (
  <div style={{ minHeight:'100vh', background:'#020817' }}>
    {/* Hero */}
    <section style={{ padding:'80px 0 60px', background:'rgba(13,21,38,0.6)', borderBottom:'1px solid rgba(30,58,95,0.3)' }}>
      <div className="container">
        <p style={{ color:'#3b82f6', fontSize:12, fontWeight:700, letterSpacing:'0.1em', marginBottom:16 }}>ABOUT US</p>
        <h1 style={{ color:'#fff', fontWeight:800, fontSize:'clamp(32px,5vw,56px)', letterSpacing:'-0.03em', marginBottom:22, lineHeight:1.08 }}>
          Built for Researchers.<br/>Backed by Transparency.
        </h1>
        <p style={{ color:'#64748b', fontSize:'clamp(15px,2vw,18px)', lineHeight:1.85, maxWidth:640 }}>
          PR Peptides was founded with one goal: provide research-grade compounds that researchers can actually trust. In a market full of vague claims, we chose complete transparency, rigorous testing, and honest documentation.
        </p>
      </div>
    </section>

    {/* Story */}
    <section style={{ padding:'80px 0' }}>
      <div className="container">
        <div className="hero-grid" style={{ gap:48 }}>
          <div>
            <p style={{ color:'#3b82f6', fontSize:12, fontWeight:700, letterSpacing:'0.1em', marginBottom:14 }}>OUR STORY</p>
            <h2 style={{ color:'#fff', fontWeight:800, fontSize:'clamp(26px,4vw,40px)', letterSpacing:'-0.02em', marginBottom:18, lineHeight:1.2 }}>Why We Started PR Peptides</h2>
            {['The research peptide market lacked one fundamental thing: trust. Researchers were buying compounds with no reliable documentation, inconsistent purity standards, and suppliers that disappeared overnight.',
              'We built PR Peptides to be the alternative — a supplier that operates like a scientific institution. Every product comes with real batch documentation, real third-party testing, and real accountability.'
             ].map((t,i) => <p key={i} style={{ color:'#64748b', fontSize:15, lineHeight:1.85, marginBottom:16 }}>{t}</p>)}
          </div>
          <div className="grid-2" style={{ gap:14 }}>
            {[['500+','Batches Tested'],['99%+','Purity Standard'],['1000+','Researchers Served'],['100%','Third-Party Verified']].map(([v,l],i) => (
              <div key={i} className="glass-card" style={{ padding:24, textAlign:'center' }}>
                <p style={{ color:'#3b82f6', fontWeight:800, fontSize:'clamp(24px,3vw,32px)', letterSpacing:'-0.02em' }}>{v}</p>
                <p style={{ color:'#64748b', fontSize:12, marginTop:4 }}>{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

    {/* Values */}
    <section style={{ padding:'80px 0', background:'rgba(13,21,38,0.55)', borderTop:'1px solid rgba(30,58,95,0.3)' }}>
      <div className="container">
        <div style={{ textAlign:'center', marginBottom:52 }}>
          <p style={{ color:'#3b82f6', fontSize:12, fontWeight:700, letterSpacing:'0.1em', marginBottom:12 }}>OUR VALUES</p>
          <h2 style={{ color:'#fff', fontWeight:800, fontSize:'clamp(26px,4vw,40px)', letterSpacing:'-0.02em' }}>What We Stand For</h2>
        </div>
        <div className="grid-3">
          {values.map((v,i) => (
            <div key={i} className="glass-card" style={{ padding:30 }}>
              <div style={{ width:52, height:52, borderRadius:14, background:'rgba(59,130,246,0.1)', border:'1px solid rgba(59,130,246,0.2)', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:18 }}>{v.icon}</div>
              <h3 style={{ color:'#fff', fontWeight:700, fontSize:17, marginBottom:8 }}>{v.title}</h3>
              <p style={{ color:'#64748b', fontSize:14, lineHeight:1.75 }}>{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* CTA */}
    <section style={{ padding:'80px 0' }}>
      <div className="container" style={{ textAlign:'center' }}>
        <h2 style={{ color:'#fff', fontWeight:800, fontSize:'clamp(24px,4vw,38px)', marginBottom:14 }}>Ready to Start Your Research?</h2>
        <p style={{ color:'#64748b', fontSize:16, marginBottom:32 }}>Browse our catalog of lab-tested, fully documented research peptides.</p>
        <Link to="/shop"><button className="btn-primary" style={{ padding:'14px 36px', fontSize:15 }}>View All Products <IconArrowRight size={17}/></button></Link>
      </div>
    </section>
  </div>
);

export default AboutPage;
