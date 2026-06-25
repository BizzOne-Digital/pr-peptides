import { useEffect, useRef, useCallback } from 'react';
import toast from 'react-hot-toast';

const SSE_URL = process.env.REACT_APP_API_URL
  ? `${process.env.REACT_APP_API_URL}/api/sse/notifications`
  : '/api/sse/notifications';

const useSSENotifications = () => {
  const esRef = useRef(null);

  const connect = useCallback(() => {
    if (esRef.current) esRef.current.close();
    const es = new EventSource(SSE_URL);
    esRef.current = es;

    es.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        if (data.type === 'connected') return;

        if (data.type === 'new_order') {
          toast.custom(() => (
            <div style={{ background:'#0d1526', border:'1px solid #3b82f6', borderRadius:12, padding:16, color:'#fff', minWidth:300 }}>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <svg width="20" height="20" fill="none" stroke="#3b82f6" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                </svg>
                <div>
                  <p style={{ fontWeight:600, marginBottom:2 }}>New Order!</p>
                  <p style={{ fontSize:13, color:'#94a3b8' }}>{data.message}</p>
                </div>
              </div>
            </div>
          ), { duration:5000 });
        } else if (data.type === 'notification') {
          toast.custom(() => (
            <div style={{ background:'#0d1526', border:'1px solid #3b82f6', borderRadius:12, padding:16, color:'#fff', minWidth:300 }}>
              <p style={{ fontWeight:600, marginBottom:4 }}>{data.title}</p>
              <p style={{ fontSize:13, color:'#94a3b8' }}>{data.message}</p>
            </div>
          ), { duration:6000 });
        } else if (data.type === 'product_added') {
          toast.success(data.message, { style:{ background:'#0d1526', color:'#fff', border:'1px solid #10b981' } });
        }
      } catch {}
    };

    es.onerror = () => { es.close(); setTimeout(connect, 5000); };
  }, []);

  useEffect(() => {
    connect();
    return () => { if (esRef.current) esRef.current.close(); };
  }, [connect]);
};

export default useSSENotifications;