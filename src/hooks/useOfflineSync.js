import { useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';

export function useOfflineSync() {
  const queueLog = (logData) => {
    const pending = JSON.parse(localStorage.getItem('fgc_pending') || '[]');
    pending.push({ ...logData, queuedAt: new Date().toISOString() });
    localStorage.setItem('fgc_pending', JSON.stringify(pending));
  };

  const flushQueue = async () => {
    const pending = JSON.parse(localStorage.getItem('fgc_pending') || '[]');
    if (pending.length === 0) return;

    const { error } = await supabase.from('compliance_logs').insert(pending);
    if (!error) {
      localStorage.removeItem('fgc_pending');
      return true;
    }
    return false;
  };

  useEffect(() => {
    const handleOnline = () => flushQueue();
    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, []);

  return { queueLog, flushQueue };
}
