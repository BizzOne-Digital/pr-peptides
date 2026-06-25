import React, { useState } from 'react';
import { IconEmail, IconPhone, IconMapPin } from '../../components/common/Icons';

const ContactPage = () => {
  const [form, setForm]   = useState({ name:'', email:'', subject:'', message:'' });
  const [sent, setSent]   = useState(false);
  const set = (k,v) => setForm(p => ({ ...p, [k]:v }));

  return (
    <div style={{ minHeight:'100vh', background:'#020817', padding:'80px 0' }}>
      <div className="container">
        <div style={{ textAlign:'center', marginBottom:56 }}>
          <p style={{ color:'#3b82f6', fontSize:12, fontWeight:700, letterSpacing:'0.1em', marginBottom:12 }}>GET IN TOUCH</p>
          <h1 style={{ color:'#fff', fontWeight:800, fontSize:'clamp(30px,5vw,52px)', letterSpacing:'-0.02em', marginBottom:14 }}>Contact Us</h1>
          <p style={{ color:'#64748b', fontSize:'clamp(14px,2vw,17px)' }}>Have questions about our research compounds? We're here to help.</p>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:36 }}>
          {/* Info */}
          <div>
            {[
              { icon:<IconEmail  size={22} color="#3b82f6"/>, label:'Email',          value:'benitz@hotmail.com' },
              { icon:<IconPhone  size={22} color="#3b82f6"/>, label:'Phone',          value:'+383 44 108 882' },
              { icon:<IconMapPin size={22} color="#3b82f6"/>, label:'Contact Person', value:'Arber Murseli' },
            ].map((x,i) => (
              <div key={i} className="glass-card" style={{ padding:22, marginBottom:14, display:'flex', alignItems:'center', gap:16 }}>
                <div style={{ width:46, height:46, borderRadius:12, background:'rgba(59,130,246,0.1)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{x.icon}</div>
                <div>
                  <p style={{ color:'#64748b', fontSize:11, fontWeight:700, marginBottom:3 }}>{x.label}</p>
                  <p style={{ color:'#e2e8f0', fontSize:14, fontWeight:500 }}>{x.value}</p>
                </div>
              </div>
            ))}
            <div className="glass-card" style={{ padding:22, marginTop:20 }}>
              <p style={{ color:'#94a3b8', fontSize:13, lineHeight:1.75 }}>
                ⚠️ <strong style={{ color:'#fff' }}>Research Use Only</strong><br/><br/>
                All products sold by PR Peptides are intended strictly for research purposes. Not for human consumption or therapeutic use.
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="glass-card" style={{ padding:36 }}>
            {sent ? (
              <div style={{ textAlign:'center', padding:'40px 0', animation:'scaleIn 0.5s ease forwards' }}>
                <div style={{ width:64, height:64, borderRadius:'50%', background:'rgba(16,185,129,0.15)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}>
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <h3 style={{ color:'#fff', fontWeight:700, fontSize:22, marginBottom:8 }}>Message Sent!</h3>
                <p style={{ color:'#64748b' }}>We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={e=>{ e.preventDefault(); setSent(true); }}>
                <h3 style={{ color:'#fff', fontWeight:700, fontSize:19, marginBottom:22 }}>Send a Message</h3>
                {[['name','Your Name','text'],['email','Email Address','email'],['subject','Subject','text']].map(([k,l,t]) => (
                  <div key={k} style={{ marginBottom:15 }}>
                    <label style={{ color:'#94a3b8', fontSize:12, fontWeight:600, display:'block', marginBottom:7 }}>{l}</label>
                    <input type={t} required value={form[k]} onChange={e=>set(k,e.target.value)} className="input-dark"/>
                  </div>
                ))}
                <div style={{ marginBottom:22 }}>
                  <label style={{ color:'#94a3b8', fontSize:12, fontWeight:600, display:'block', marginBottom:7 }}>Message</label>
                  <textarea required value={form.message} onChange={e=>set('message',e.target.value)} rows={5} className="input-dark" style={{ resize:'vertical' }}/>
                </div>
                <button type="submit" className="btn-primary" style={{ width:'100%', justifyContent:'center', padding:14 }}>Send Message</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
