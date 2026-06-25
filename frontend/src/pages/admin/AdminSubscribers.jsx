import React, { useState, useEffect } from 'react';
import API from '../../utils/api';
import toast from 'react-hot-toast';
import { IconUsers, IconTrash, IconEmail } from '../../components/common/Icons';

const AdminSubscribers = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchSubscribers(); }, []);

  const fetchSubscribers = async () => {
    try {
      const res = await API.get('/subscribers');
      setSubscribers(res.data.subscribers);
    } catch {} finally { setLoading(false); }
  };

  const handleUnsubscribe = async (id, email) => {
    if (!window.confirm(`Remove ${email} from list?`)) return;
    try {
      await API.delete(`/subscribers/${id}`);
      toast.success('Subscriber removed', { style: { background: '#0d1526', color: '#fff' } });
      setSubscribers(prev => prev.filter(s => s._id !== id));
    } catch { toast.error('Failed to remove'); }
  };

  const active = subscribers.filter(s => s.isActive).length;

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ color: '#fff', fontWeight: 800, fontSize: '28px', marginBottom: '4px' }}>Subscribers</h1>
        <p style={{ color: '#475569', fontSize: '14px' }}>{active} active subscribers in your email list</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '28px' }}>
        {[
          { label: 'Total Subscribers', value: subscribers.length, color: '#3b82f6' },
          { label: 'Active', value: active, color: '#10b981' },
          { label: 'Inactive', value: subscribers.length - active, color: '#f87171' },
        ].map((s, i) => (
          <div key={i} className="glass-card" style={{ padding: '20px' }}>
            <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '6px' }}>{s.label}</p>
            <p style={{ color: s.color, fontWeight: 800, fontSize: '28px' }}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="glass-card" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '18px 24px', borderBottom: '1px solid rgba(30,58,95,0.4)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <IconEmail size={18} color="#3b82f6" />
          <h3 style={{ color: '#fff', fontWeight: 700, fontSize: '15px' }}>Email List</h3>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Source</th>
              <th>Status</th>
              <th>Joined</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: '#475569' }}>Loading...</td></tr>
            ) : subscribers.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: '#475569' }}>
                <IconUsers size={36} color="#1e3a5f" />
                <p style={{ marginTop: '12px' }}>No subscribers yet</p>
              </td></tr>
            ) : subscribers.map(sub => (
              <tr key={sub._id}>
                <td style={{ color: '#e2e8f0', fontWeight: 500 }}>{sub.email}</td>
                <td><span className="badge badge-blue">{sub.source}</span></td>
                <td>
                  <span style={{ background: sub.isActive ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: sub.isActive ? '#34d399' : '#f87171', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 700 }}>
                    {sub.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td style={{ color: '#64748b' }}>{new Date(sub.createdAt).toLocaleDateString()}</td>
                <td>
                  {sub.isActive && (
                    <button onClick={() => handleUnsubscribe(sub._id, sub.email)} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', cursor: 'pointer', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <IconTrash size={15} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminSubscribers;
