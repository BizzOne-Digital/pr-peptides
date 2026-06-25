import React from 'react';
import { IconFlask, IconShield, IconFileCheck, IconMicroscope, IconDna, IconGlobe } from '../../components/common/Icons';

const steps = [
  { num:'01', title:'Raw Material Sourcing',    desc:'We source only from verified, premium suppliers with documented supply chains. Every ingredient is tracked from origin.' },
  { num:'02', title:'In-House Quality Check',   desc:'Before synthesis, all raw materials undergo our internal quality verification to confirm identity and purity.' },
  { num:'03', title:'Precision Synthesis',      desc:'Our compounds are synthesized under strict controlled conditions with validated protocols for maximum consistency.' },
  { num:'04', title:'Third-Party Lab Testing',  desc:'Every batch is tested by independent, accredited laboratories with no affiliation to PR Peptides.' },
  { num:'05', title:'COA Documentation',        desc:'Full Certificate of Analysis for every batch — available upon request or included with your order.' },
  { num:'06', title:'Secure Packaging',         desc:'Products are sealed, labeled, and shipped with proper handling to maintain compound integrity throughout delivery.' },
];

const standards = [
  { icon:<IconFlask     size={26} color="#3b82f6"/>, title:'99%+ Purity Standard',     desc:'Our internal benchmark exceeds industry standards. We reject any batch that falls below 99% purity.' },
  { icon:<IconFileCheck size={26} color="#3b82f6"/>, title:'Full Batch Transparency',  desc:'Each product includes batch number, test date, testing lab, and full analytical results.' },
  { icon:<IconShield    size={26} color="#3b82f6"/>, title:'Independent Verification', desc:'All testing is performed by third-party accredited labs with no conflict of interest.' },
  { icon:<IconDna       size={26} color="#3b82f6"/>, title:'Sequence Verified',        desc:'Mass spectrometry and HPLC analysis confirm the exact peptide sequence and molecular weight.' },
  { icon:<IconMicroscope size={26} color="#3b82f6"/>, title:'Sterility Tested',        desc:'Selected products undergo additional sterility and endotoxin testing for complete assurance.' },
  { icon:<IconGlobe     size={26} color="#3b82f6"/>, title:'Transparent Supply Chain', desc:'From raw material origin to final product, every step is documented and reviewable.' },
];

const QualityPage = () => (
  <div style={{ minHeight:'100vh', background:'#020817' }}>
    {/* Hero */}
    <section style={{ padding:'80px 0 60px', textAlign:'center', background:'linear-gradient(180deg,rgba(13,21,38,0.8) 0%,#020817 100%)', borderBottom:'1px solid rgba(30,58,95,0.3)' }}>
      <div className="container">
        <p style={{ color:'#3b82f6', fontSize:12, fontWeight:700, letterSpacing:'0.1em', marginBottom:14 }}>QUALITY STANDARDS</p>
        <h1 style={{ color:'#fff', fontWeight:800, fontSize:'clamp(32px,5vw,54px)', letterSpacing:'-0.03em', marginBottom:18, lineHeight:1.1 }}>Our Commitment to Purity</h1>
        <p style={{ color:'#64748b', fontSize:'clamp(15px,2vw,18px)', lineHeight:1.85, maxWidth:580, margin:'0 auto' }}>
          Every compound must pass a rigorous multi-stage quality process before reaching our catalog.
        </p>
      </div>
    </section>

    {/* Process */}
    <section style={{ padding:'80px 0' }}>
      <div className="container">
        <div style={{ textAlign:'center', marginBottom:52 }}>
          <p style={{ color:'#3b82f6', fontSize:12, fontWeight:700, letterSpacing:'0.1em', marginBottom:12 }}>THE PROCESS</p>
          <h2 style={{ color:'#fff', fontWeight:800, fontSize:'clamp(26px,4vw,40px)', letterSpacing:'-0.02em' }}>From Source to Your Lab</h2>
        </div>
        <div className="grid-3">
          {steps.map((s,i) => (
            <div key={i} className="glass-card" style={{ padding:28 }}>
              <p style={{ color:'#1e3a5f', fontWeight:800, fontSize:38, marginBottom:12, lineHeight:1 }}>{s.num}</p>
              <h3 style={{ color:'#fff', fontWeight:700, fontSize:16, marginBottom:10 }}>{s.title}</h3>
              <p style={{ color:'#64748b', fontSize:13, lineHeight:1.75 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Standards */}
    <section style={{ padding:'80px 0', background:'rgba(13,21,38,0.55)', borderTop:'1px solid rgba(30,58,95,0.3)', borderBottom:'1px solid rgba(30,58,95,0.3)' }}>
      <div className="container">
        <div style={{ textAlign:'center', marginBottom:52 }}>
          <p style={{ color:'#3b82f6', fontSize:12, fontWeight:700, letterSpacing:'0.1em', marginBottom:12 }}>WHAT WE TEST FOR</p>
          <h2 style={{ color:'#fff', fontWeight:800, fontSize:'clamp(26px,4vw,40px)', letterSpacing:'-0.02em' }}>Our Quality Benchmarks</h2>
        </div>
        <div className="grid-3">
          {standards.map((s,i) => (
            <div key={i} className="glass-card" style={{ padding:28 }}>
              <div style={{ width:50, height:50, borderRadius:13, background:'rgba(59,130,246,0.1)', border:'1px solid rgba(59,130,246,0.2)', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:16 }}>{s.icon}</div>
              <h3 style={{ color:'#fff', fontWeight:700, fontSize:15, marginBottom:8 }}>{s.title}</h3>
              <p style={{ color:'#64748b', fontSize:13, lineHeight:1.75 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Disclaimer */}
    <section style={{ padding:'60px 0' }}>
      <div className="container">
        <div style={{ maxWidth:680, margin:'0 auto', background:'rgba(59,130,246,0.05)', border:'1px solid rgba(59,130,246,0.15)', borderRadius:16, padding:'clamp(28px,4vw,44px)', textAlign:'center' }}>
          <p style={{ color:'#60a5fa', fontWeight:700, fontSize:13, marginBottom:12 }}>LEGAL DISCLAIMER</p>
          <p style={{ color:'#64748b', fontSize:14, lineHeight:1.85 }}>
            All products sold by PR Peptides are intended for research purposes only. They are not intended for human or animal consumption, therapeutic use, or diagnostic purposes.
          </p>
        </div>
      </div>
    </section>
  </div>
);

export default QualityPage;
