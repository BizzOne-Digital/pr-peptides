import React, { useState, useEffect } from 'react';
import API from '../../utils/api';
import toast from 'react-hot-toast';
import { IconX } from '../../components/common/Icons';

const statusColors = { pending: '#fbbf24', confirmed: '#34d399', processing: '#60a5fa', shipped: '#a78bfa', delivered: '#10b981', cancelled: '#f87171' };
const statuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [selected, setSelected] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => { fetchOrders(); }, [filter]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/orders${filter ? `?status=${filter}` : ''}`);
      setOrders(res.data.orders);
    } catch {} finally { setLoading(false); }
  };

  const updateStatus = async (id, status) => {
    setUpdatingId(id);
    try {
      await API.put(`/orders/${id}/status`, { status });
      toast.success('Order status updated', { style: { background: '#0d1526', color: '#fff' } });
      fetchOrders();
      if (selected?._id === id) setSelected(prev => ({ ...prev, status }));
    } catch { toast.error('Update failed'); } finally { setUpdatingId(null); }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <h1 style={{ color: '#fff', fontWeight: 800, fontSize: '28px', marginBottom: '4px' }}>Orders</h1>
          <p style={{ color: '#475569', fontSize: '14px' }}>{orders.length} orders</p>
        </div>
        <select value={filter} onChange={e => setFilter(e.target.value)} className="input-dark" style={{ width: '180px' }}>
          <option value="">All Status</option>
          {statuses.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
      </div>

      <div className="glass-card" style={{ overflow: 'hidden' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Order #</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? <tr><td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: '#475569' }}>Loading...</td></tr>
              : orders.length === 0 ? <tr><td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: '#475569' }}>No orders found</td></tr>
              : orders.map(o => (
                <tr key={o._id} style={{ cursor: 'pointer' }}>
                  <td style={{ color: '#60a5fa', fontWeight: 700 }} onClick={() => setSelected(o)}>{o.orderNumber}</td>
                  <td onClick={() => setSelected(o)}>
                    <p style={{ color: '#e2e8f0', fontSize: '14px' }}>{o.customer.name}</p>
                    <p style={{ color: '#475569', fontSize: '12px' }}>{o.customer.email}</p>
                  </td>
                  <td style={{ color: '#94a3b8' }}>{o.items.length} item(s)</td>
                  <td style={{ color: '#3b82f6', fontWeight: 700 }}>${o.total.toFixed(2)}</td>
                  <td>
                    <select value={o.status} onChange={e => updateStatus(o._id, e.target.value)} disabled={updatingId === o._id} style={{ background: `${statusColors[o.status]}15`, color: statusColors[o.status], border: `1px solid ${statusColors[o.status]}40`, borderRadius: '8px', padding: '4px 10px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', outline: 'none' }}>
                      {statuses.map(s => <option key={s} value={s} style={{ background: '#0d1526', color: '#fff' }}>{s}</option>)}
                    </select>
                  </td>
                  <td style={{ color: '#64748b' }}>{new Date(o.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button onClick={() => setSelected(o)} style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', color: '#60a5fa', cursor: 'pointer', padding: '4px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 600 }}>
                      Details
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Order Detail Modal */}
      {selected && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }} onClick={e => e.target === e.currentTarget && setSelected(null)}>
          <div style={{ background: '#0d1526', border: '1px solid rgba(30,58,95,0.7)', borderRadius: '20px', width: '100%', maxWidth: '580px', maxHeight: '85vh', overflowY: 'auto', padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <h2 style={{ color: '#fff', fontWeight: 800, fontSize: '22px' }}>Order {selected.orderNumber}</h2>
                <span style={{ background: `${statusColors[selected.status]}20`, color: statusColors[selected.status], padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 700 }}>{selected.status?.toUpperCase()}</span>
              </div>
              <button onClick={() => setSelected(null)} style={{ background: 'rgba(30,58,95,0.5)', border: 'none', color: '#94a3b8', cursor: 'pointer', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IconX size={18} /></button>
            </div>

            <div style={{ background: 'rgba(30,58,95,0.2)', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
              <h4 style={{ color: '#94a3b8', fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', marginBottom: '12px' }}>CUSTOMER</h4>
              <p style={{ color: '#fff', fontWeight: 600 }}>{selected.customer.name}</p>
              <p style={{ color: '#64748b', fontSize: '13px' }}>{selected.customer.email}</p>
              {selected.customer.phone && <p style={{ color: '#64748b', fontSize: '13px' }}>{selected.customer.phone}</p>}
              {selected.shippingAddress?.city && (
                <p style={{ color: '#64748b', fontSize: '13px', marginTop: '8px' }}>
                  {[selected.shippingAddress.street, selected.shippingAddress.city, selected.shippingAddress.state, selected.shippingAddress.country].filter(Boolean).join(', ')}
                </p>
              )}
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ color: '#94a3b8', fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', marginBottom: '12px' }}>ORDER ITEMS</h4>
              {selected.items.map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid rgba(30,58,95,0.3)' }}>
                  <div>
                    <p style={{ color: '#e2e8f0', fontWeight: 600, fontSize: '14px' }}>{item.name}</p>
                    <p style={{ color: '#64748b', fontSize: '12px' }}>{item.dosage} × {item.quantity}</p>
                  </div>
                  <span style={{ color: '#3b82f6', fontWeight: 700 }}>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0 0' }}>
                <span style={{ color: '#fff', fontWeight: 700, fontSize: '16px' }}>Total</span>
                <span style={{ color: '#3b82f6', fontWeight: 800, fontSize: '20px' }}>${selected.total.toFixed(2)}</span>
              </div>
            </div>

            {selected.notes && (
              <div style={{ background: 'rgba(30,58,95,0.2)', borderRadius: '10px', padding: '14px', marginBottom: '20px' }}>
                <p style={{ color: '#94a3b8', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>NOTES</p>
                <p style={{ color: '#e2e8f0', fontSize: '13px' }}>{selected.notes}</p>
              </div>
            )}

            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button onClick={() => setSelected(null)} className="btn-outline">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
