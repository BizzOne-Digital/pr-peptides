import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import useSSENotifications from '../../hooks/useSSENotifications';
import API from '../../utils/api';
import { IconHome, IconPackage, IconUsers, IconBell, IconSend, IconLogout, IconTrendUp, IconDollar, IconX } from '../../components/common/Icons';

const navItems = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: <IconHome size={18} /> },
  { to: '/admin/products', label: 'Products', icon: <IconPackage size={18} /> },
  { to: '/admin/orders', label: 'Orders', icon: <IconTrendUp size={18} /> },
  { to: '/admin/subscribers', label: 'Subscribers', icon: <IconUsers size={18} /> },
  { to: '/admin/notifications', label: 'Notifications', icon: <IconBell size={18} /> },
];

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [showNotifPanel, setShowNotifPanel] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const bellRef = useRef(null);

  useSSENotifications();

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await API.get('/notifications');
      setNotifications(res.data.notifications);
      setUnreadCount(res.data.notifications.filter(n => !n.isRead).length);
    } catch {}
  };

  const markAllRead = async () => {
    try {
      await API.put('/notifications/mark-all-read');
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch {}
  };

  const handleLogout = () => { logout(); navigate('/admin/login'); };

  const notifColors = { order: '#3b82f6', product: '#10b981', info: '#60a5fa', success: '#34d399', warning: '#fbbf24', error: '#f87171' };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#020817' }}>
      {/* Sidebar */}
      <aside style={{ width: '240px', background: '#0a0e1a', borderRight: '1px solid rgba(30,58,95,0.6)', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, bottom: 0, left: 0, zIndex: 50 }}>
        {/* Logo */}
        <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(30,58,95,0.4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: 34, height: 34, borderRadius: '10px', background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18"/></svg>
            </div>
            <div>
              <p style={{ color: '#fff', fontWeight: 800, fontSize: '16px' }}>PR Peptides</p>
              <p style={{ color: '#3b82f6', fontSize: '9px', fontWeight: 600, letterSpacing: '0.1em' }}>ADMIN PANEL</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {navItems.map(item => (
            <Link key={item.to} to={item.to} className={`admin-nav-item ${location.pathname === item.to ? 'active' : ''}`}>
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>

        {/* User */}
        <div style={{ padding: '16px 12px', borderTop: '1px solid rgba(30,58,95,0.4)' }}>
          <div style={{ padding: '12px', borderRadius: '10px', background: 'rgba(30,58,95,0.3)', marginBottom: '8px' }}>
            <p style={{ color: '#fff', fontSize: '13px', fontWeight: 600 }}>{user?.name}</p>
            <p style={{ color: '#475569', fontSize: '11px' }}>{user?.email}</p>
          </div>
          <button onClick={handleLogout} className="admin-nav-item" style={{ width: '100%', background: 'none', border: 'none' }}>
            <IconLogout size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div style={{ marginLeft: '240px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Top bar */}
        <header style={{ height: '64px', background: 'rgba(10,14,26,0.9)', borderBottom: '1px solid rgba(30,58,95,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '0 24px', position: 'sticky', top: 0, zIndex: 40, backdropFilter: 'blur(10px)' }}>
          <div style={{ position: 'relative' }}>
            <button ref={bellRef} onClick={() => setShowNotifPanel(!showNotifPanel)} style={{ background: 'rgba(30,58,95,0.3)', border: '1px solid rgba(30,58,95,0.6)', color: '#94a3b8', cursor: 'pointer', width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <IconBell size={20} color={unreadCount > 0 ? '#3b82f6' : '#94a3b8'} />
              {unreadCount > 0 && (
                <span style={{ position: 'absolute', top: '-4px', right: '-4px', background: '#ef4444', color: '#fff', fontSize: '10px', fontWeight: 700, width: '18px', height: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Notification dropdown */}
            {showNotifPanel && (
              <div style={{ position: 'absolute', right: 0, top: '50px', width: '360px', background: '#0d1526', border: '1px solid rgba(30,58,95,0.7)', borderRadius: '16px', boxShadow: '0 20px 60px rgba(0,0,0,0.6)', zIndex: 100, overflow: 'hidden' }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(30,58,95,0.4)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ color: '#fff', fontWeight: 700, fontSize: '15px' }}>Notifications</h4>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    {unreadCount > 0 && <button onClick={markAllRead} style={{ background: 'none', border: 'none', color: '#60a5fa', fontSize: '12px', cursor: 'pointer', fontWeight: 600 }}>Mark all read</button>}
                    <button onClick={() => setShowNotifPanel(false)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', display: 'flex' }}><IconX size={16} /></button>
                  </div>
                </div>
                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  {notifications.length === 0 ? (
                    <div style={{ padding: '40px', textAlign: 'center', color: '#475569', fontSize: '14px' }}>No notifications</div>
                  ) : notifications.slice(0, 15).map(n => (
                    <div key={n._id} style={{ padding: '14px 20px', borderBottom: '1px solid rgba(30,58,95,0.3)', background: n.isRead ? 'transparent' : 'rgba(59,130,246,0.04)', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: notifColors[n.type] || '#3b82f6', marginTop: '6px', flexShrink: 0 }}></div>
                      <div>
                        <p style={{ color: '#e2e8f0', fontSize: '13px', fontWeight: n.isRead ? 400 : 600, marginBottom: '2px' }}>{n.title}</p>
                        <p style={{ color: '#64748b', fontSize: '12px' }}>{n.message}</p>
                        <p style={{ color: '#334155', fontSize: '11px', marginTop: '4px' }}>{new Date(n.createdAt).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ padding: '12px 20px', borderTop: '1px solid rgba(30,58,95,0.4)' }}>
                  <Link to="/admin/notifications" onClick={() => setShowNotifPanel(false)} style={{ color: '#60a5fa', fontSize: '13px', textDecoration: 'none', fontWeight: 600 }}>View all notifications →</Link>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
