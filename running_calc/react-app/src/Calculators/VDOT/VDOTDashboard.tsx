import React from 'react';
import { Grid, Typography, Card, CardContent, Box } from '@mui/material';
import VDOTChart from './VDOTChart';
import RacePredictor from './VDOTRacePredictor';
import VDOTForecast from './VDOTForecast';
import PaceTable from './PaceTable';
import RaceEntryForm from './RaceEntryForm';

export interface VDOTEntry {
  date: string;
  raceType: string;
  result: string;
  vdot: number;
  notes?: string;
}

export interface IVDOTDashboardProps {
  vdotEntries: VDOTEntry[];
  weeksRemaining: number;
}

const VDOTDashboard: React.FC<IVDOTDashboardProps> = (props: IVDOTDashboardProps) => {
  const { vdotEntries, weeksRemaining } = props;
  const currentVDOT = vdotEntries.at(-1)?.vdot ?? 50;

  return (
    <>
      <Grid container spacing={3}>
        <Box sx={{ width: '100%', textAlign: 'center', marginBottom: 2 }}>
          <Typography variant="h4">VDOT - Race Performance Dashboard</Typography>
        </Box>

        <Box sx={{ width: '100%', textAlign: 'center', marginBottom: 2 }}>
          <Card><CardContent><VDOTChart data={vdotEntries} /></CardContent></Card>
        </Box>

        <Box sx={{ width: '100%', textAlign: 'center', marginBottom: 2 }}>
          <Card><CardContent><RacePredictor vdot={currentVDOT} /></CardContent></Card>
        </Box>

        <Box sx={{ width: '100%', textAlign: 'center', marginBottom: 2 }}>
          <Card><CardContent><VDOTForecast currentVDOT={currentVDOT} weeksRemaining={weeksRemaining} /></CardContent></Card>
        </Box>

        <Box sx={{ width: '100%', textAlign: 'center', marginBottom: 2 }}>
          <Card><CardContent><PaceTable vdot={currentVDOT} /></CardContent></Card>
        </Box>

        <Box sx={{ width: '100%', textAlign: 'center', marginBottom: 2 }}>
          <Card><CardContent><RaceEntryForm /></CardContent></Card>
        </Box>
      </Grid>
    </>
  );
};

export default VDOTDashboard;