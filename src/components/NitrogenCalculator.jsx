import { useState } from 'react';

export default function NitrogenCalculator({ propertySqFt, onValidation }) {
  const [lbsProduct, setLbsProduct] = useState('');
  const [nitrogenPercent, setNitrogenPercent] = useState('');
  const [error, setError] = useState(null);
  const [warning, setWarning] = useState(null);

  const calculateRate = () => {
    const lbs = parseFloat(lbsProduct);
    const nPct = parseFloat(nitrogenPercent);
    const sqFt = parseFloat(propertySqFt);

    const rate = (lbs * (nPct / 100)) / (sqFt / 1000);
    const MAX_RATE = 0.7;
    const WARNING_THRESHOLD = 0.65;

    if (rate > MAX_RATE) {
      setError(`HARD BLOCK: ${rate.toFixed(3)} lbs/1000 sq ft exceeds legal max 0.7. Adjust spreader settings.`);
      setWarning(null);
      onValidation(false, null);
      return;
    }

    if (rate >= WARNING_THRESHOLD) {
      setWarning(`WARNING: ${rate.toFixed(3)} lbs/1000 sq ft approaching legal limit (0.7).`);
    } else {
      setWarning(null);
    }

    setError(null);
    onValidation(true, rate);
  };

  return (
    <div className="nitrogen-calc">
      <h3>Nitrogen Calculator</h3>
      <input
        type="number"
        placeholder="Lbs of product applied"
        value={lbsProduct}
        onChange={(e) => setLbsProduct(e.target.value)}
      />
      <input
        type="number"
        placeholder="N% on bag (e.g., 15)"
        value={nitrogenPercent}
        onChange={(e) => setNitrogenPercent(e.target.value)}
      />
      <button onClick={calculateRate}>Calculate Rate</button>
      {error && <div className="error-block">{error}</div>}
      {warning && <div className="warning">{warning}</div>}
    </div>
  );
}
