import React from 'react';
import { Typography } from '@mui/material';

interface IVDOTRacePredictorProps {
  vdot: number;
}

const predictRaceTime = (vdot: number, raceType: string): string => {
  const referenceTable: Record<string, number> = {
    '5K': 5.0,
    '10K': 10.0,
    'Half': 21.0975,
    'Marathon': 42.195,
  };

  const basePace = 600 / vdot; // crude pace estimate: seconds/mile
  const distance = referenceTable[raceType];
  const timeSec = basePace * distance * 1609 / 60;

  const hours = Math.floor(timeSec / 60);
  const minutes = Math.round(timeSec % 60);

  return `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
};

const VDOTRacePredictor: React.FC<IVDOTRacePredictorProps> = ({ vdot }) => {
  return (
    <div>
      <Typography variant="h6">📊 Predicted Race Times</Typography>
      <ul>
        <li>5K: {predictRaceTime(vdot, '5K')}</li>
        <li>10K: {predictRaceTime(vdot, '10K')}</li>
        <li>Half Marathon: {predictRaceTime(vdot, 'Half')}</li>
        <li>Marathon: {predictRaceTime(vdot, 'Marathon')}</li>
      </ul>
    </div>
  );
};

export default VDOTRacePredictor;