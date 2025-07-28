import React from 'react';
import { Typography, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

interface PaceTableProps {
  vdot: number;
}

const getPaces = (vdot: number) => ({
  Easy: (600 / (vdot - 5)).toFixed(1),
  Threshold: (600 / vdot).toFixed(1),
  Marathon: (600 / (vdot * 0.96)).toFixed(1),
  Interval: (600 / (vdot * 1.05)).toFixed(1),
  Repetition: (600 / (vdot * 1.1)).toFixed(1),
});

const PaceTable: React.FC<PaceTableProps> = ({ vdot }) => {
  const paces = getPaces(vdot);

  return (
    <div>
      <Typography variant="h6">🎯 Training Paces (min/mile)</Typography>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Workout Type</TableCell>
            <TableCell>Pace</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.entries(paces).map(([type, pace]) => (
            <TableRow key={type}>
              <TableCell>{type}</TableCell>
              <TableCell>{pace}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PaceTable;