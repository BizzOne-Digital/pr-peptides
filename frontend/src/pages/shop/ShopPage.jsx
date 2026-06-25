import React, { useState, useEffect } from 'react';
import API from '../../utils/api';
import ProductCard from '../../components/common/ProductCard';
import { IconSearch } from '../../components/common/Icons';

const ShopPage = () => {
  const [products,    setProducts]    = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [search,      setSearch]      = useState('');
  const [category,    setCategory]    = useState('');
  const [page,        setPage]        = useState(1);
  const [totalPages,  setTotalPages]  = useState(1);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const p = new URLSearchParams({ page, limit: 9 });
      if (search)   p.append('search',   search);
      if (category) p.append('category', category);
      const res = await API.get(`/products?${p}`);
      setProducts(res.data.products);
      setTotalPages(res.data.pages);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, [page, category]);
  useEffect(() => {
    const t = setTimeout(fetchProducts, 400);
    return () => clearTimeout(t);
  }, [search]);

  return (
    <div style={{ minHeight:'100vh', background:'#020817', paddingTop:60, paddingBottom:80 }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign:'center', marginBottom:48 }}>
          <p style={{ color:'#3b82f6', fontSize:12, fontWeight:700, letterSpacing:'0.1em', marginBottom:12 }}>OUR CATALOG</p>
          <h1 style={{ color:'#fff', fontWeight:800, fontSize:'clamp(32px,5vw,52px)', letterSpacing:'-0.02em', marginBottom:14 }}>Research Peptides</h1>
          <p style={{ color:'#64748b', fontSize:'clamp(14px,2vw,17px)' }}>Lab-tested compounds for research purposes only</p>
        </div>

        {/* Filters */}
        <div style={{ display:'flex', gap:12, marginBottom:40, flexWrap:'wrap' }}>
          <div style={{ flex:1, minWidth:200, position:'relative' }}>
            <div style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)' }}>
              <IconSearch size={17} color="#475569"/>
            </div>
            <input type="text" placeholder="Search peptides..." value={search} onChange={e=>setSearch(e.target.value)} className="input-dark" style={{ paddingLeft:44 }}/>
          </div>
          <select value={category} onChange={e=>setCategory(e.target.value)} className="input-dark" style={{ width:'auto', minWidth:160 }}>
            <option value="">All Categories</option>
            <option value="peptide">Peptides</option>
            <option value="research-compound">Research Compounds</option>
            <option value="accessory">Accessories</option>
          </select>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid-3">
            {[...Array(9)].map((_,i) => (
              <div key={i} style={{ height:380, background:'rgba(13,21,38,0.8)', borderRadius:16, border:'1px solid rgba(30,58,95,0.4)' }}/>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign:'center', padding:'80px 20px', color:'#475569' }}>
            <p style={{ fontSize:18 }}>No products found</p>
          </div>
        ) : (
          <div className="grid-3">
            {products.map(p => <ProductCard key={p._id} product={p}/>)}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display:'flex', justifyContent:'center', gap:8, marginTop:48, flexWrap:'wrap' }}>
            {[...Array(totalPages)].map((_,i) => (
              <button key={i} onClick={() => setPage(i+1)} style={{ width:40, height:40, borderRadius:10, border:'1px solid', borderColor: page===i+1 ? '#3b82f6' : 'rgba(30,58,95,0.6)', background: page===i+1 ? 'rgba(59,130,246,0.2)' : 'transparent', color: page===i+1 ? '#3b82f6' : '#64748b', cursor:'pointer', fontWeight:600 }}>
                {i+1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopPage;
