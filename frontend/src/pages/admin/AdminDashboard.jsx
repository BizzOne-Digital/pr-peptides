import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../../utils/api';
import { IconDollar, IconPackage, IconTrendUp, IconUsers } from '../../components/common/Icons';

const StatCard = ({ icon, label, value, color, sub }) => (
  <div className="glass-card" style={{ padding: '24px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div>
        <p style={{ color: '#64748b', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>{label}</p>
        <p style={{ color: '#fff', fontWeight: 800, fontSize: '28px', letterSpacing: '-0.02em' }}>{value}</p>
        {sub && <p style={{ color: '#475569', fontSize: '12px', marginTop: '6px' }}>{sub}</p>}
      </div>
      <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {React.cloneElement(icon, { color })}
      </div>
    </div>
  </div>
);

const statusColor = { pending: '#fbbf24', confirmed: '#34d399', processing: '#60a5fa', shipped: '#a78bfa', delivered: '#10b981', cancelled: '#f87171' };

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/orders/stats/dashboard')
      .then(res => { setStats(res.data.stats); setRecentOrders(res.data.recentOrders); })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ color: '#fff', fontWeight: 800, fontSize: '28px', marginBottom: '4px' }}>Dashboard</h1>
        <p style={{ color: '#475569', fontSize: '14px' }}>Welcome back! Here's what's happening with PR Peptides.</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
        <StatCard icon={<IconDollar size={22} />} label="Total Revenue" value={loading ? '—' : `$${(stats?.totalRevenue || 0).toFixed(2)}`} color="#3b82f6" sub="All time" />
        <StatCard icon={<IconTrendUp size={22} />} label="Total Orders" value={loading ? '—' : stats?.totalOrders || 0} color="#10b981" />
        <StatCard icon={<IconPackage size={22} />} label="Pending Orders" value={loading ? '—' : stats?.pendingOrders || 0} color="#f59e0b" sub="Needs attention" />
        <StatCard icon={<IconUsers size={22} />} label="Active Products" value={loading ? '—' : stats?.totalProducts || 0} color="#a78bfa" />
      </div>

      {/* Recent Orders */}
      <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(30,58,95,0.4)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ color: '#fff', fontWeight: 700, fontSize: '16px' }}>Recent Orders</h3>
          <Link to="/admin/orders" style={{ color: '#60a5fa', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}>View all →</Link>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Order #</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', color: '#475569', padding: '40px' }}>No orders yet</td></tr>
              ) : recentOrders.map(order => (
                <tr key={order._id}>
                  <td style={{ color: '#60a5fa', fontWeight: 600 }}>{order.orderNumber}</td>
                  <td style={{ color: '#e2e8f0' }}>{order.customer.name}</td>
                  <td style={{ color: '#3b82f6', fontWeight: 700 }}>${order.total.toFixed(2)}</td>
                  <td>
                    <span style={{ background: `${statusColor[order.status] || '#64748b'}20`, color: statusColor[order.status] || '#64748b', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 700, border: `1px solid ${statusColor[order.status] || '#64748b'}40` }}>
                      {order.status.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ color: '#64748b' }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick actions */}
      <div style={{ marginTop: '24px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        {[{ label: 'Add New Product', to: '/admin/products', color: '#3b82f6', desc: 'Add peptides to the store' },
          { label: 'Send Notification', to: '/admin/notifications', color: '#10b981', desc: 'Notify subscribers' },
          { label: 'View Subscribers', to: '/admin/subscribers', color: '#a78bfa', desc: 'Manage email list' }].map(a => (
          <Link key={a.to} to={a.to} style={{ textDecoration: 'none' }}>
            <div className="glass-card" style={{ padding: '20px', cursor: 'pointer' }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: a.color, marginBottom: '12px' }}></div>
              <p style={{ color: '#fff', fontWeight: 700, fontSize: '14px', marginBottom: '4px' }}>{a.label}</p>
              <p style={{ color: '#475569', fontSize: '12px' }}>{a.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
