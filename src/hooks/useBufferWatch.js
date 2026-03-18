import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../utils/supabaseClient';

export function useBufferWatch(propertyId) {
  const [distance, setDistance] = useState(null);
  const [alertLevel, setAlertLevel] = useState(null); // null, 'warning', 'danger'
  const [isViolating, setIsViolating] = useState(false);

  const checkDistance = useCallback(async () => {
    if (!propertyId || !navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;

      const { data, error } = await supabase.rpc('distance_to_buffer', {
        prop_id: propertyId,
        user_lat: latitude,
        user_lon: longitude
      });

      if (error) {
        console.error('Buffer check error:', error);
        return;
      }

      const dist = data;
      setDistance(dist);

      if (dist < 10) {
        setAlertLevel('danger');
        setIsViolating(true);
        navigator.vibrate(500);
      } else if (dist < 15) {
        setAlertLevel('warning');
        setIsViolating(false);
        navigator.vibrate(200);
      } else {
        setAlertLevel(null);
        setIsViolating(false);
      }
    });
  }, [propertyId]);

  useEffect(() => {
    checkDistance();
    const interval = setInterval(checkDistance, 3000);
    return () => clearInterval(interval);
  }, [checkDistance]);

  return { distance, alertLevel, isViolating, checkDistance };
}
