import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const AdminLogin = () => {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [loading,  setLoading]  = useState(false);
  const { login }  = useAuth();
  const navigate   = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      navigate('/admin/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight:'100vh', background:'#020817', display:'flex', alignItems:'center', justifyContent:'center', padding:24 }} className="grid-bg">
      <div style={{ width:'100%', maxWidth:420, animation:'fadeInUp 0.7s ease forwards' }}>

        {/* Logo */}
        <div style={{ textAlign:'center', marginBottom:36 }}>
          <div style={{ width:58, height:58, borderRadius:16, background:'linear-gradient(135deg,#3b82f6,#1d4ed8)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px', boxShadow:'0 0 30px rgba(59,130,246,0.4)' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M10 2v6.292a1 1 0 01-.172.557L3.6 17.6A2 2 0 005.244 21h13.512A2 2 0 0020.4 17.6l-6.228-8.751A1 1 0 0114 8.293V2"/>
              <path d="M8.5 2h7"/><path d="M7 16h10"/>
            </svg>
          </div>
          <h1 style={{ color:'#fff', fontWeight:800, fontSize:26, letterSpacing:'-0.02em' }}>PR Peptides Admin</h1>
          <p style={{ color:'#475569', fontSize:14, marginTop:6 }}>Research Grade Management Portal</p>
        </div>

        <div className="glass-card" style={{ padding:36 }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom:18 }}>
              <label style={{ color:'#94a3b8', fontSize:12, fontWeight:700, display:'block', marginBottom:8, letterSpacing:'0.04em' }}>EMAIL ADDRESS</label>
              <input type="email" required value={email} onChange={e=>setEmail(e.target.value)} className="input-dark" placeholder="admin@prpeptides.com"/>
            </div>
            <div style={{ marginBottom:28 }}>
              <label style={{ color:'#94a3b8', fontSize:12, fontWeight:700, display:'block', marginBottom:8, letterSpacing:'0.04em' }}>PASSWORD</label>
              <input type="password" required value={password} onChange={e=>setPassword(e.target.value)} className="input-dark" placeholder="••••••••"/>
            </div>
            <button type="submit" disabled={loading} className="btn-primary" style={{ width:'100%', justifyContent:'center', padding:14, opacity:loading?0.7:1, fontSize:15 }}>
              {loading ? 'Signing In...' : 'Sign In to Admin Panel'}
            </button>
          </form>
        </div>

        <p style={{ textAlign:'center', color:'#334155', fontSize:12, marginTop:18 }}>PR Peptides — Admin Portal · For Authorized Personnel Only</p>
      </div>
    </div>
  );
};

export default AdminLogin;
