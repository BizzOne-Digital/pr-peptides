import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../utils/api';
import { useCart } from '../../context/CartContext';
import { IconFlask, IconShield, IconFileCheck, IconMicroscope, IconArrowRight, IconCart } from '../../components/common/Icons';
import toast from 'react-hot-toast';

const ProductDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    API.get(`/products/${slug}`)
      .then(res => setProduct(res.data.product))
      .catch(() => navigate('/shop'))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#020817', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: '#475569' }}>Loading...</div>
    </div>
  );

  if (!product) return null;

  const handleAddToCart = () => {
    addToCart(product, qty);
    toast.success(`${product.name} added to cart!`, { style: { background: '#0d1526', color: '#fff', border: '1px solid #3b82f6' } });
  };

  const badges = [
    { show: product.labTested, icon: <IconFlask size={20} color="#34d399" />, label: 'Lab Tested', sub: 'Third-party verified', color: '#34d399' },
    { show: product.coaAvailable, icon: <IconFileCheck size={20} color="#60a5fa" />, label: 'COA Available', sub: 'Batch transparency', color: '#60a5fa' },
    { show: true, icon: <IconShield size={20} color="#a78bfa" />, label: product.purity + ' Purity', sub: 'Quality standard', color: '#a78bfa' },
    { show: product.researchUseOnly, icon: <IconMicroscope size={20} color="#fbbf24" />, label: 'Research Use Only', sub: 'Not for human use', color: '#fbbf24' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#020817', padding: '60px 24px 80px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '40px', color: '#475569', fontSize: '13px' }}>
          <span onClick={() => navigate('/')} style={{ cursor: 'pointer', color: '#64748b' }}>Home</span>
          <span>›</span>
          <span onClick={() => navigate('/shop')} style={{ cursor: 'pointer', color: '#64748b' }}>Shop</span>
          <span>›</span>
          <span style={{ color: '#e2e8f0' }}>{product.name}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'start' }}>
          {/* Left - Image */}
          <div>
            <div style={{ background: 'linear-gradient(135deg, #0a1628, #0d1f3c)', border: '1px solid rgba(30,58,95,0.6)', borderRadius: '20px', height: '420px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
              {product.images?.[0] ? (
                <img src={product.images[0]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '20px' }} />
              ) : (
                <div style={{ textAlign: 'center' }}>
                  <div style={{ width: '100px', height: '160px', background: 'rgba(30,58,95,0.5)', border: '1px solid rgba(59,130,246,0.4)', borderRadius: '18px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', boxShadow: '0 0 40px rgba(59,130,246,0.2)' }}>
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.5">
                      <path d="M10 2v6.292a1 1 0 01-.172.557L3.6 17.6A2 2 0 005.244 21h13.512A2 2 0 0020.4 17.6l-6.228-8.751A1 1 0 0114 8.293V2"/>
                      <path d="M8.5 2h7"/><path d="M7 16h10"/>
                    </svg>
                    <p style={{ color: '#60a5fa', fontWeight: 800, fontSize: '14px', marginTop: '8px' }}>Brain²</p>
                    <p style={{ color: '#475569', fontSize: '9px', letterSpacing: '0.1em' }}>RESEARCH PEPTIDES</p>
                  </div>
                </div>
              )}
              <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', width: '140px', height: '16px', background: 'rgba(59,130,246,0.3)', borderRadius: '50%', filter: 'blur(12px)' }}></div>
            </div>

            {/* Extra images */}
            {product.images?.length > 1 && (
              <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                {product.images.slice(1).map((img, i) => (
                  <div key={i} style={{ width: '72px', height: '72px', borderRadius: '12px', border: '1px solid rgba(30,58,95,0.5)', overflow: 'hidden' }}>
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right - Info */}
          <div>
            {product.featured && (
              <span style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', color: '#fff', fontSize: '11px', fontWeight: 700, padding: '4px 12px', borderRadius: '20px', letterSpacing: '0.05em', display: 'inline-block', marginBottom: '14px' }}>FEATURED</span>
            )}
            <h1 style={{ color: '#fff', fontWeight: 800, fontSize: '40px', letterSpacing: '-0.02em', marginBottom: '8px', lineHeight: 1.1 }}>{product.name}</h1>
            {product.dosage && <p style={{ color: '#60a5fa', fontSize: '16px', fontWeight: 600, marginBottom: '20px' }}>{product.dosage}</p>}

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '24px' }}>
              <span style={{ color: '#3b82f6', fontWeight: 800, fontSize: '36px' }}>${product.price}</span>
              {product.comparePrice && <span style={{ color: '#475569', fontSize: '18px', textDecoration: 'line-through' }}>${product.comparePrice}</span>}
            </div>

            <p style={{ color: '#94a3b8', fontSize: '15px', lineHeight: 1.8, marginBottom: '28px' }}>{product.description}</p>

            {/* Badges grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '28px' }}>
              {badges.filter(b => b.show).map((b, i) => (
                <div key={i} style={{ background: `${b.color}08`, border: `1px solid ${b.color}25`, borderRadius: '12px', padding: '12px 14px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                  {b.icon}
                  <div>
                    <p style={{ color: '#e2e8f0', fontWeight: 600, fontSize: '13px' }}>{b.label}</p>
                    <p style={{ color: '#64748b', fontSize: '11px' }}>{b.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Qty + Cart */}
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0', border: '1px solid rgba(30,58,95,0.8)', borderRadius: '10px', overflow: 'hidden' }}>
                <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ width: '42px', height: '48px', background: 'rgba(30,58,95,0.4)', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                <span style={{ width: '50px', textAlign: 'center', color: '#fff', fontWeight: 700, fontSize: '16px' }}>{qty}</span>
                <button onClick={() => setQty(q => q + 1)} style={{ width: '42px', height: '48px', background: 'rgba(30,58,95,0.4)', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
              </div>
              <button onClick={handleAddToCart} disabled={!product.inStock} className="btn-primary" style={{ flex: 1, justifyContent: 'center', padding: '14px', fontSize: '15px' }}>
                <IconCart size={18} />
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </button>
            </div>

            <div style={{ padding: '14px', background: 'rgba(59,130,246,0.04)', borderRadius: '10px', border: '1px solid rgba(59,130,246,0.1)' }}>
              <p style={{ color: '#475569', fontSize: '12px', lineHeight: 1.7 }}>
                ⚠️ <strong style={{ color: '#64748b' }}>For Research Use Only</strong> — Not for human consumption. This product is sold solely for research purposes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
