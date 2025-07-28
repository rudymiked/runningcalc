import React, { useState } from 'react';
import { TextField, Button, Typography, Stack } from '@mui/material';

const RaceEntryForm: React.FC = () => {
  const [raceType, setRaceType] = useState('');
  const [result, setResult] = useState('');
  const [vdot, setVDOT] = useState<number | null>(null);

  const calculateVDOT = (time: string): number => {
    const [min, sec] = time.split(':').map(Number);
    const totalMinutes = min + sec / 60;
    return Math.round((600 / totalMinutes) * 10) / 10;
  };

  const handleSubmit = () => {
    const newVDOT = calculateVDOT(result);
    setVDOT(newVDOT);
    // Could also send to backend here
  };

  return (
    <div>
      <Typography variant="h6">📝 Log a New Race</Typography>
      <Stack spacing={2}>
        <TextField
          label="Race Type (e.g. 5K)"
          value={raceType}
          onChange={(e) => setRaceType(e.target.value)}
        />
        <TextField
          label="Time (mm:ss)"
          value={result}
          onChange={(e) => setResult(e.target.value)}
        />
        <Button variant="contained" onClick={handleSubmit}>Calculate VDOT</Button>
        {vdot && <Typography>Calculated VDOT: {vdot}</Typography>}
      </Stack>
    </div>
  );
};

export default RaceEntryForm;