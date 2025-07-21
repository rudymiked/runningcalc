import { Box, Tabs, Tab } from "@mui/material";
import { RacePrediction } from "../Calculators/RacePredictor";
import { PaceGenerator } from "../Calculators/PaceGenerator";
import { useState, type SyntheticEvent } from "react";

// --- Main Calculators Page ---
export const Calculators = () => {
  const [tab, setTab] = useState(0);

  function handleTabChange(event: SyntheticEvent<Element, Event>, value: number): void {
    setTab(value);
  }

  return (
    <Box sx={{ px: 2, pt: 10, position: 'relative' }}>
      {/* Tab Bar (place this fixed under your Header if needed) */}
      <Box
        sx={{
          position: 'fixed',
          top: 70, // height of your fixed Header
          left: 0,
          width: '100%',
          backgroundColor: 'white',
          zIndex: 1000,
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Tabs value={tab} onChange={handleTabChange} centered>
          <Tab label="Race Time Prediction" />
          <Tab label="Pace Generator" />
        </Tabs>
      </Box>

      {/* Stable Layout Section */}
      <Box sx={{ width: '100%', marginTop: 0 }}>
        <Box sx={{ display: tab === 0 ? 'block' : 'none' }}>
          <RacePrediction />
        </Box>
        <Box sx={{ display: tab === 1 ? 'block' : 'none' }}>
          <PaceGenerator />
        </Box>
      </Box>
    </Box>
  );
};

export default Calculators;