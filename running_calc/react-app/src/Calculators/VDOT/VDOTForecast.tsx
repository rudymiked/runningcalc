import React from 'react';

interface VDOTForecastProps {
  currentVDOT: number;
  weeksRemaining: number;
  expectedGainPerMonth?: number;
}

const VDOTForecast: React.FC<VDOTForecastProps> = ({
  currentVDOT,
  weeksRemaining,
  expectedGainPerMonth = 0.5
}) => {
  const months = weeksRemaining / 4;
  const projectedVDOT = parseFloat((currentVDOT + months * expectedGainPerMonth).toFixed(1));

  return (
    <div>
      <h5>Projected VDOT at Race Day</h5>
      <p>📆 Weeks Remaining: {weeksRemaining}</p>
      <p>📈 Current VDOT: {currentVDOT}</p>
      <p>🔮 Expected VDOT: {projectedVDOT}</p>
    </div>
  );
};

export default VDOTForecast;