import React, { useState, useEffect } from 'react';
import API from '../../utils/api';
import toast from 'react-hot-toast';
import { IconBell, IconSend, IconTrash, IconX } from '../../components/common/Icons';

const typeColors = { info: '#60a5fa', success: '#34d399', warning: '#fbbf24', error: '#f87171', order: '#3b82f6', product: '#10b981' };

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({ title: '', message: '', type: 'info', targetAudience: 'all', sendEmail: false });

  useEffect(() => { fetchNotifications(); }, []);

  const fetchNotifications = async () => {
    try {
      const res = await API.get('/notifications');
      setNotifications(res.data.notifications);
    } catch {} finally { setLoading(false); }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await API.post('/notifications', form);
      toast.success('Notification sent via SSE' + (form.sendEmail ? ' and email!' : '!'), { style: { background: '#0d1526', color: '#fff', border: '1px solid #10b981' } });
      setForm({ title: '', message: '', type: 'info', targetAudience: 'all', sendEmail: false });
      setShowForm(false);
      fetchNotifications();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send');
    } finally { setSending(false); }
  };

  const deleteNotif = async (id) => {
    try {
      await API.delete(`/notifications/${id}`);
      setNotifications(prev => prev.filter(n => n._id !== id));
    } catch {}
  };

  const markAllRead = async () => {
    await API.put('/notifications/mark-all-read');
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    toast.success('All marked as read');
  };

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const unread = notifications.filter(n => !n.isRead).length;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <h1 style={{ color: '#fff', fontWeight: 800, fontSize: '28px', marginBottom: '4px' }}>Notifications</h1>
          <p style={{ color: '#475569', fontSize: '14px' }}>{unread} unread — send via SSE (real-time) + email</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          {unread > 0 && <button onClick={markAllRead} className="btn-outline" style={{ padding: '10px 20px', fontSize: '13px' }}>Mark all read</button>}
          <button onClick={() => setShowForm(true)} className="btn-primary">
            <IconSend size={18} /> Send Notification
          </button>
        </div>
      </div>

      {/* Send form */}
      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }} onClick={e => e.target === e.currentTarget && setShowForm(false)}>
          <div style={{ background: '#0d1526', border: '1px solid rgba(30,58,95,0.7)', borderRadius: '20px', width: '100%', maxWidth: '540px', padding: '36px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h2 style={{ color: '#fff', fontWeight: 800, fontSize: '22px' }}>Send Notification</h2>
              <button onClick={() => setShowForm(false)} style={{ background: 'rgba(30,58,95,0.5)', border: 'none', color: '#94a3b8', cursor: 'pointer', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IconX size={18} /></button>
            </div>

            <form onSubmit={handleSend}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ color: '#94a3b8', fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Title *</label>
                <input required value={form.title} onChange={e => set('title', e.target.value)} className="input-dark" placeholder="Notification title..." />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ color: '#94a3b8', fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Message *</label>
                <textarea required rows={4} value={form.message} onChange={e => set('message', e.target.value)} className="input-dark" style={{ resize: 'vertical' }} placeholder="Your message to subscribers..." />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <label style={{ color: '#94a3b8', fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Type</label>
                  <select value={form.type} onChange={e => set('type', e.target.value)} className="input-dark">
                    <option value="info">Info</option>
                    <option value="success">Success</option>
                    <option value="warning">Warning</option>
                    <option value="order">Order</option>
                    <option value="product">Product</option>
                  </select>
                </div>
                <div>
                  <label style={{ color: '#94a3b8', fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Audience</label>
                  <select value={form.targetAudience} onChange={e => set('targetAudience', e.target.value)} className="input-dark">
                    <option value="all">All</option>
                    <option value="subscribers">Subscribers</option>
                    <option value="admin">Admin Only</option>
                  </select>
                </div>
              </div>

              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '14px', background: 'rgba(59,130,246,0.05)', borderRadius: '10px', border: '1px solid rgba(59,130,246,0.15)', marginBottom: '24px' }}>
                <div onClick={() => set('sendEmail', !form.sendEmail)} style={{ width: '20px', height: '20px', borderRadius: '6px', border: `1px solid ${form.sendEmail ? '#3b82f6' : 'rgba(30,58,95,0.8)'}`, background: form.sendEmail ? 'rgba(59,130,246,0.2)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {form.sendEmail && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
                </div>
                <div>
                  <p style={{ color: '#e2e8f0', fontSize: '14px', fontWeight: 600 }}>Also send via email</p>
                  <p style={{ color: '#475569', fontSize: '12px' }}>Sends email to all active subscribers via SMTP</p>
                </div>
              </label>

              <div style={{ padding: '12px', background: 'rgba(59,130,246,0.05)', borderRadius: '10px', border: '1px solid rgba(59,130,246,0.1)', marginBottom: '20px' }}>
                <p style={{ color: '#60a5fa', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>SSE Real-Time Delivery</p>
                <p style={{ color: '#475569', fontSize: '12px' }}>This notification will be pushed instantly to all connected browsers via Server-Sent Events.</p>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowForm(false)} className="btn-outline">Cancel</button>
                <button type="submit" disabled={sending} className="btn-primary">
                  <IconSend size={16} />
                  {sending ? 'Sending...' : 'Send Now'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Notification list */}
      <div className="glass-card" style={{ overflow: 'hidden' }}>
        {loading ? <div style={{ padding: '40px', textAlign: 'center', color: '#475569' }}>Loading...</div>
          : notifications.length === 0 ? (
            <div style={{ padding: '60px', textAlign: 'center' }}>
              <IconBell size={48} color="#1e3a5f" />
              <p style={{ color: '#475569', marginTop: '16px' }}>No notifications yet. Send your first one!</p>
            </div>
          ) : notifications.map(n => (
            <div key={n._id} style={{ padding: '18px 24px', borderBottom: '1px solid rgba(30,58,95,0.3)', display: 'flex', gap: '14px', alignItems: 'flex-start', background: n.isRead ? 'transparent' : 'rgba(59,130,246,0.03)' }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: typeColors[n.type] || '#3b82f6', marginTop: '6px', flexShrink: 0 }}></div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <p style={{ color: '#e2e8f0', fontWeight: n.isRead ? 400 : 700, fontSize: '14px', marginBottom: '4px' }}>{n.title}</p>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginLeft: '12px', flexShrink: 0 }}>
                    {!n.isRead && <span className="badge badge-blue" style={{ fontSize: '10px' }}>UNREAD</span>}
                    {n.sentViaEmail && <span className="badge badge-green" style={{ fontSize: '10px' }}>EMAIL SENT</span>}
                    <span style={{ background: `${typeColors[n.type] || '#3b82f6'}20`, color: typeColors[n.type] || '#3b82f6', padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 600 }}>{n.type}</span>
                  </div>
                </div>
                <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '6px' }}>{n.message}</p>
                <p style={{ color: '#334155', fontSize: '11px' }}>{new Date(n.createdAt).toLocaleString()} · {n.targetAudience}</p>
              </div>
              <button onClick={() => deleteNotif(n._id)} style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', display: 'flex', padding: '4px', flexShrink: 0 }}>
                <IconTrash size={15} />
              </button>
            </div>
          ))}
      </div>
    </div>
  );
};

export default AdminNotifications;
