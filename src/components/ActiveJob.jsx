import { useState, useEffect } from 'react';
import { useBufferWatch } from '../hooks/useBufferWatch';
import { useOfflineSync } from '../hooks/useOfflineSync';
import NitrogenCalculator from './NitrogenCalculator';
import BufferZoneAlert from './BufferZoneAlert';

export default function ActiveJob({ property, techName, onComplete }) {
  const [nitrogenRate, setNitrogenRate] = useState(null);
  const [nitrogenValid, setNitrogenValid] = useState(false);
  const [jobData, setJobData] = useState({
    productName: '',
    epaRegNumber: '',
    lbsApplied: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const { distance, alertLevel, isViolating } = useBufferWatch(property.id);
  const { queueLog } = useOfflineSync();

  const handleSubmit = async () => {
    if (!nitrogenValid || isViolating) return;

    setSubmitting(true);

    const pos = await new Promise((resolve) =>
      navigator.geolocation.getCurrentPosition(resolve)
    );

    const payload = {
      lat: pos.coords.latitude,
      lon: pos.coords.longitude,
      propertyId: property.id,
      techName,
      jobData: {
        ...jobData,
        nitrogenRate,
        gpsTimestamp: new Date().toISOString()
      }
    };

    if (navigator.onLine) {
      const res = await fetch(
        `${process.env.REACT_APP_SUPABASE_URL}/functions/v1/fgc-weather-handshake`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }
      );

      if (res.status === 403) {
        alert('Weather conditions unsafe. Job blocked.');
        setSubmitting(false);
        return;
      }
    } else {
      queueLog(payload);
      alert('Offline mode: Job queued for sync');
    }

    setSubmitting(false);
    onComplete();
  };

  return (
    <div className="active-job">
      <BufferZoneAlert alertLevel={alertLevel} distance={distance} />
      <div className={`header ${alertLevel === 'warning' ? 'yellow' : ''}`}>
        <h2>Active Job: {property.name}</h2>
        <p>Buffer distance: {distance?.toFixed(1)} ft</p>
      </div>
      <NitrogenCalculator
        propertySqFt={property.total_sq_ft}
        onValidation={(valid, rate) => {
          setNitrogenValid(valid);
          setNitrogenRate(rate);
        }}
      />
      <div className="job-details">
        <input
          type="text"
          placeholder="Product Name"
          value={jobData.productName}
          onChange={(e) => setJobData({ ...jobData, productName: e.target.value })}
        />
        <input
          type="text"
          placeholder="EPA Registration Number"
          value={jobData.epaRegNumber}
          onChange={(e) => setJobData({ ...jobData, epaRegNumber: e.target.value })}
        />
        <input
          type="number"
          placeholder="Lbs Applied"
          value={jobData.lbsApplied}
          onChange={(e) => setJobData({ ...jobData, lbsApplied: e.target.value })}
        />
      </div>
      <button
        onClick={handleSubmit}
        disabled={!nitrogenValid || isViolating || submitting}
        className="submit-btn"
      >
        {submitting ? 'Submitting...' : 'Complete Job'}
      </button>
    </div>
  );
}
