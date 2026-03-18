export default function BufferZoneAlert({ alertLevel, distance }) {
  if (!alertLevel) return null;

  if (alertLevel === 'danger') {
    return (
      <div className="buffer-overlay danger">
        <h1>STOP: WATER BUFFER BREACH</h1>
        <p>You are {distance?.toFixed(1)} feet from protected water.</p>
        <p>Application is DISABLED. Move away immediately.</p>
      </div>
    );
  }

  return (
    <div className="buffer-warning">
      <p>WARNING: {distance?.toFixed(1)} feet from buffer zone</p>
    </div>
  );
}
