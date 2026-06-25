import React, { useState, useEffect } from 'react';
import API from '../../utils/api';
import toast from 'react-hot-toast';
import { IconPlus, IconEdit, IconTrash, IconX, IconUpload, IconCheck } from '../../components/common/Icons';

const emptyForm = {
  name: '', description: '', shortDescription: '',
  price: '', comparePrice: '', dosage: '', category: 'peptide',
  purity: '99%+', stockQuantity: '',
  inStock: true, labTested: true, coaAvailable: true,
  researchUseOnly: true, featured: false,
};

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing,  setEditing]  = useState(null);
  const [form,     setForm]     = useState(emptyForm);
  const [images,   setImages]   = useState([]);
  const [previews, setPreviews] = useState([]);
  const [saving,   setSaving]   = useState(false);

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    try {
      const res = await API.get('/products/admin/all');
      setProducts(res.data.products);
    } catch {} finally { setLoading(false); }
  };

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setImages([]);
    setPreviews([]);
    setShowModal(true);
  };

  const openEdit = (p) => {
    setEditing(p);
    setForm({
      name:            p.name,
      description:     p.description,
      shortDescription: p.shortDescription || '',
      price:           p.price,
      comparePrice:    p.comparePrice || '',
      dosage:          p.dosage || '',
      category:        p.category,
      purity:          p.purity,
      stockQuantity:   p.stockQuantity,
      inStock:         p.inStock,
      labTested:       p.labTested,
      coaAvailable:    p.coaAvailable,
      researchUseOnly: p.researchUseOnly,
      featured:        p.featured,
    });
    setImages([]);
    setPreviews(p.images || []);
    setShowModal(true);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 5);
    setImages(files);
    setPreviews(files.map(f => URL.createObjectURL(f)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();

      // Only append non-empty values + handle types correctly
      Object.entries(form).forEach(([k, v]) => {
        if (v === '' || v === null || v === undefined) return; // skip empty
        fd.append(k, v);
      });

      // Append image files
      images.forEach(img => fd.append('images', img));

      if (editing) {
        await API.put(`/products/${editing._id}`, fd);
        toast.success('Product updated!', { style: { background: '#0d1526', color: '#fff', border: '1px solid #10b981' } });
      } else {
        await API.post('/products', fd);
        toast.success('Product added!', { style: { background: '#0d1526', color: '#fff', border: '1px solid #10b981' } });
      }
      setShowModal(false);
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving product');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    try {
      await API.delete(`/products/${id}`);
      toast.success('Product deleted');
      fetchProducts();
    } catch { toast.error('Delete failed'); }
  };

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:28 }}>
        <div>
          <h1 style={{ color:'#fff', fontWeight:800, fontSize:28, marginBottom:4 }}>Products</h1>
          <p style={{ color:'#475569', fontSize:14 }}>{products.length} total products</p>
        </div>
        <button onClick={openAdd} className="btn-primary">
          <IconPlus size={18}/> Add Product
        </button>
      </div>

      <div className="glass-card" style={{ overflow:'hidden' }}>
        <div style={{ overflowX:'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Flags</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} style={{ textAlign:'center', padding:40, color:'#475569' }}>Loading...</td></tr>
              ) : products.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign:'center', padding:40, color:'#475569' }}>No products yet</td></tr>
              ) : products.map(p => (
                <tr key={p._id}>
                  <td>
                    <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                      <div style={{ width:42, height:42, borderRadius:10, background:'rgba(30,58,95,0.5)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, overflow:'hidden' }}>
                        {p.images?.[0]
                          ? <img src={p.images[0]} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
                          : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.5"><path d="M10 2v6.292a1 1 0 01-.172.557L3.6 17.6A2 2 0 005.244 21h13.512A2 2 0 0020.4 17.6l-6.228-8.751A1 1 0 0114 8.293V2"/></svg>
                        }
                      </div>
                      <div>
                        <p style={{ color:'#e2e8f0', fontWeight:600, fontSize:14 }}>{p.name}</p>
                        <p style={{ color:'#475569', fontSize:12 }}>{p.dosage}</p>
                      </div>
                    </div>
                  </td>
                  <td><span className="badge badge-blue">{p.category}</span></td>
                  <td style={{ color:'#3b82f6', fontWeight:700 }}>${p.price}</td>
                  <td style={{ color: p.inStock ? '#34d399' : '#f87171' }}>
                    {p.inStock ? `${p.stockQuantity} in stock` : 'Out of stock'}
                  </td>
                  <td>
                    <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                      {p.featured   && <span className="badge badge-blue">Featured</span>}
                      {p.labTested  && <span className="badge badge-green">Lab Tested</span>}
                    </div>
                  </td>
                  <td>
                    <div style={{ display:'flex', gap:8 }}>
                      <button onClick={() => openEdit(p)} style={{ background:'rgba(59,130,246,0.1)', border:'1px solid rgba(59,130,246,0.3)', color:'#60a5fa', cursor:'pointer', width:32, height:32, borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center' }}>
                        <IconEdit size={15}/>
                      </button>
                      <button onClick={() => handleDelete(p._id, p.name)} style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.3)', color:'#f87171', cursor:'pointer', width:32, height:32, borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center' }}>
                        <IconTrash size={15}/>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===== MODAL ===== */}
      {showModal && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.85)', zIndex:300, display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}
          onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div style={{ background:'#0d1526', border:'1px solid rgba(30,58,95,0.7)', borderRadius:20, width:'100%', maxWidth:680, maxHeight:'90vh', overflowY:'auto', padding:32 }}>

            {/* Header */}
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:28 }}>
              <h2 style={{ color:'#fff', fontWeight:800, fontSize:22 }}>
                {editing ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button onClick={() => setShowModal(false)} style={{ background:'rgba(30,58,95,0.5)', border:'none', color:'#94a3b8', cursor:'pointer', width:32, height:32, borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center' }}>
                <IconX size={18}/>
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>

                {/* Name */}
                <div style={{ gridColumn:'1 / -1' }}>
                  <label style={{ color:'#94a3b8', fontSize:12, fontWeight:600, display:'block', marginBottom:6 }}>Product Name *</label>
                  <input required value={form.name} onChange={e => set('name', e.target.value)} className="input-dark" placeholder="e.g. BPC-157"/>
                </div>

                {/* Short desc */}
                <div style={{ gridColumn:'1 / -1' }}>
                  <label style={{ color:'#94a3b8', fontSize:12, fontWeight:600, display:'block', marginBottom:6 }}>Short Description</label>
                  <input value={form.shortDescription} onChange={e => set('shortDescription', e.target.value)} className="input-dark" placeholder="Brief one-liner"/>
                </div>

                {/* Description */}
                <div style={{ gridColumn:'1 / -1' }}>
                  <label style={{ color:'#94a3b8', fontSize:12, fontWeight:600, display:'block', marginBottom:6 }}>Description *</label>
                  <textarea required value={form.description} onChange={e => set('description', e.target.value)} rows={3} className="input-dark" style={{ resize:'vertical' }}/>
                </div>

                {/* Price */}
                <div>
                  <label style={{ color:'#94a3b8', fontSize:12, fontWeight:600, display:'block', marginBottom:6 }}>Price ($) *</label>
                  <input type="number" min="0" step="0.01" required value={form.price} onChange={e => set('price', e.target.value)} className="input-dark" placeholder="79.99"/>
                </div>

                {/* Compare Price */}
                <div>
                  <label style={{ color:'#94a3b8', fontSize:12, fontWeight:600, display:'block', marginBottom:6 }}>Compare Price ($)</label>
                  <input type="number" min="0" step="0.01" value={form.comparePrice} onChange={e => set('comparePrice', e.target.value)} className="input-dark" placeholder="99.99 (optional)"/>
                </div>

                {/* Dosage */}
                <div>
                  <label style={{ color:'#94a3b8', fontSize:12, fontWeight:600, display:'block', marginBottom:6 }}>Dosage</label>
                  <input value={form.dosage} onChange={e => set('dosage', e.target.value)} className="input-dark" placeholder="e.g. 10 mg"/>
                </div>

                {/* Stock */}
                <div>
                  <label style={{ color:'#94a3b8', fontSize:12, fontWeight:600, display:'block', marginBottom:6 }}>Stock Quantity</label>
                  <input type="number" min="0" value={form.stockQuantity} onChange={e => set('stockQuantity', e.target.value)} className="input-dark" placeholder="50"/>
                </div>

                {/* Purity */}
                <div>
                  <label style={{ color:'#94a3b8', fontSize:12, fontWeight:600, display:'block', marginBottom:6 }}>Purity</label>
                  <input value={form.purity} onChange={e => set('purity', e.target.value)} className="input-dark" placeholder="99%+"/>
                </div>

                {/* Category */}
                <div>
                  <label style={{ color:'#94a3b8', fontSize:12, fontWeight:600, display:'block', marginBottom:6 }}>Category</label>
                  <select value={form.category} onChange={e => set('category', e.target.value)} className="input-dark">
                    <option value="peptide">Peptide</option>
                    <option value="research-compound">Research Compound</option>
                    <option value="accessory">Accessory</option>
                  </select>
                </div>

                {/* Checkboxes */}
                <div style={{ gridColumn:'1 / -1', display:'flex', flexWrap:'wrap', gap:16 }}>
                  {[['inStock','In Stock'],['featured','Featured'],['labTested','Lab Tested'],['coaAvailable','COA Available'],['researchUseOnly','Research Use Only']].map(([k, l]) => (
                    <label key={k} style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer' }}>
                      <div onClick={() => set(k, !form[k])} style={{ width:20, height:20, borderRadius:6, border:`1px solid ${form[k] ? '#3b82f6' : 'rgba(30,58,95,0.8)'}`, background: form[k] ? 'rgba(59,130,246,0.2)' : 'transparent', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', transition:'all 0.2s' }}>
                        {form[k] && <IconCheck size={13} color="#3b82f6"/>}
                      </div>
                      <span style={{ color:'#94a3b8', fontSize:13 }}>{l}</span>
                    </label>
                  ))}
                </div>

                {/* Image upload */}
                <div style={{ gridColumn:'1 / -1' }}>
                  <label style={{ color:'#94a3b8', fontSize:12, fontWeight:600, display:'block', marginBottom:8 }}>
                    Product Images (max 5) {editing && images.length === 0 && <span style={{ color:'#475569', fontWeight:400 }}>— leave empty to keep existing</span>}
                  </label>

                  {/* Existing / preview images */}
                  {previews.length > 0 && (
                    <div style={{ display:'flex', gap:10, marginBottom:12, flexWrap:'wrap' }}>
                      {previews.map((src, i) => (
                        <div key={i} style={{ width:72, height:72, borderRadius:10, overflow:'hidden', border:'1px solid rgba(59,130,246,0.3)' }}>
                          <img src={src} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
                        </div>
                      ))}
                    </div>
                  )}

                  <label style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:8, padding:20, border:'2px dashed rgba(59,130,246,0.3)', borderRadius:12, cursor:'pointer', background:'rgba(59,130,246,0.03)' }}>
                    <IconUpload size={22} color="#3b82f6"/>
                    <span style={{ color:'#64748b', fontSize:13 }}>
                      {images.length > 0 ? `${images.length} file(s) selected` : 'Click to upload images'}
                    </span>
                    <input type="file" multiple accept="image/jpeg,image/jpg,image/png,image/webp" style={{ display:'none' }} onChange={handleImageChange}/>
                  </label>
                </div>
              </div>

              <div style={{ display:'flex', gap:12, marginTop:28, justifyContent:'flex-end' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn-outline">Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary">
                  {saving ? 'Saving...' : editing ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;