import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { IconFlask, IconShield, IconFileCheck, IconCart } from './Icons';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product);
    toast.success(`${product.name} added to cart!`, { style:{ background:'#0d1526', color:'#fff', border:'1px solid #3b82f6' } });
  };

  return (
    <div className="product-card" onClick={() => navigate(`/product/${product.slug}`)} style={{ position:'relative' }}>
      {product.featured && (
        <div style={{ position:'absolute', top:12, left:12, zIndex:2, background:'linear-gradient(135deg,#3b82f6,#1d4ed8)', color:'#fff', fontSize:10, fontWeight:700, padding:'4px 10px', borderRadius:20, letterSpacing:'0.05em' }}>FEATURED</div>
      )}
      {!product.inStock && (
        <div style={{ position:'absolute', top:12, right:12, zIndex:2 }} className="badge badge-red">OUT OF STOCK</div>
      )}

      {/* Image */}
      <div style={{ position:'relative', height:200, background:'linear-gradient(135deg,#0a1628,#0d1f3c)', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden' }}>
        {product.images?.[0] ? (
          <img src={product.images[0]} alt={product.name} style={{ width:'100%', height:'100%', objectFit:'cover', transition:'transform 0.4s ease' }}
            onMouseEnter={e=>e.target.style.transform='scale(1.06)'}
            onMouseLeave={e=>e.target.style.transform='scale(1)'}
          />
        ) : (
          <div style={{ textAlign:'center' }}>
            <div style={{ width:76, height:116, background:'rgba(30,58,95,0.55)', border:'1px solid rgba(59,130,246,0.35)', borderRadius:14, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', margin:'0 auto 8px', backdropFilter:'blur(4px)' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.5">
                <path d="M10 2v6.292a1 1 0 01-.172.557L3.6 17.6A2 2 0 005.244 21h13.512A2 2 0 0020.4 17.6l-6.228-8.751A1 1 0 0114 8.293V2"/>
                <path d="M8.5 2h7"/><path d="M7 16h10"/>
              </svg>
            </div>
            <span style={{ color:'#60a5fa', fontSize:10, fontWeight:700, letterSpacing:'0.08em' }}>PR PEPTIDES</span>
          </div>
        )}
        <div style={{ position:'absolute', bottom:0, left:'50%', transform:'translateX(-50%)', width:110, height:16, background:'rgba(59,130,246,0.28)', borderRadius:'50%', filter:'blur(10px)' }}/>
      </div>

      {/* Content */}
      <div style={{ padding:'18px 18px 20px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:7 }}>
          <h3 style={{ color:'#fff', fontWeight:700, fontSize:16, flex:1, lineHeight:1.3 }}>{product.name}</h3>
          {product.dosage && <span className="badge badge-blue" style={{ marginLeft:8, flexShrink:0 }}>{product.dosage}</span>}
        </div>

        <p style={{ color:'#64748b', fontSize:13, lineHeight:1.65, marginBottom:14, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>
          {product.shortDescription || product.description}
        </p>

        {/* Trust badges */}
        <div style={{ display:'flex', gap:10, marginBottom:14, flexWrap:'wrap' }}>
          {product.labTested  && <span style={{ display:'flex', alignItems:'center', gap:4, color:'#34d399', fontSize:11, fontWeight:600 }}><IconFlask    size={12} color="#34d399"/>Lab Tested</span>}
          {product.coaAvailable && <span style={{ display:'flex', alignItems:'center', gap:4, color:'#60a5fa', fontSize:11, fontWeight:600 }}><IconFileCheck size={12} color="#60a5fa"/>COA</span>}
          <span style={{ display:'flex', alignItems:'center', gap:4, color:'#a78bfa', fontSize:11, fontWeight:600 }}><IconShield size={12} color="#a78bfa"/>{product.purity}</span>
        </div>

        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:10 }}>
          <div>
            <span style={{ color:'#3b82f6', fontWeight:800, fontSize:20 }}>${product.price}</span>
            {product.comparePrice && <span style={{ color:'#475569', fontSize:13, textDecoration:'line-through', marginLeft:6 }}>${product.comparePrice}</span>}
          </div>
          <button onClick={handleAddToCart} disabled={!product.inStock} className="btn-primary" style={{ padding:'8px 14px', fontSize:13, gap:6, flexShrink:0 }}>
            <IconCart size={14}/>Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
