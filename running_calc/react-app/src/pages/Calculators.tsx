import { Box, Tabs, Tab } from "@mui/material";
import { RacePrediction } from "../Calculators/RacePredictor";
import { TrainingPaces } from "../Calculators/TrainingPaces";
import { useState, type SyntheticEvent } from "react";
import RaceTimeByPace from "../Calculators/RaceTimeByPace";
import PaceByRaceTime from "../Calculators/PaceByRaceTime";
import VDOTDashboard, { type IVDOTDashboardProps } from "../Calculators/VDOT/VDOTDashboard";

// --- Main Calculators Page ---
export const Calculators = () => {
  const [tab, setTab] = useState(0);

  function handleTabChange(event: SyntheticEvent<Element, Event>, value: number): void {
    setTab(value);
  }

  const vdotEntries = [
  { date: '2025-04-15', raceType: '5K', result: '18:30', vdot: 55 },
  { date: '2025-07-10', raceType: '10K', result: '38:30', vdot: 56 }
];

  const weeksUntilRace = 18;

  const vdotDashboardProps: IVDOTDashboardProps = {
    vdotEntries: vdotEntries,
    weeksRemaining: weeksUntilRace
  };

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
          '&::-webkit-scrollbar': { display: 'none' },
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',

        }}
      >
        <Tabs
          value={tab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="scrollable tabs"
        >
          <Tab label="Race Time Prediction" />
          <Tab label="Training Paces" />
          <Tab label="Race Time By Pace" />
          <Tab label="Pace By Race Time" />
          {/* <Tab label="VDOT Dashboard" /> */}
        </Tabs>
      </Box>

      {/* Stable Layout Section */}
      <Box sx={{ width: '100%', marginTop: 0 }}>
        <Box sx={{ display: tab === 0 ? 'block' : 'none' }}>
          <RacePrediction />
        </Box>
        <Box sx={{ display: tab === 1 ? 'block' : 'none' }}>
          <TrainingPaces />
        </Box>
        <Box sx={{ display: tab === 2 ? 'block' : 'none' }}>
          <RaceTimeByPace />
        </Box>
        <Box sx={{ display: tab === 3 ? 'block' : 'none' }}>
          <PaceByRaceTime />
        </Box>
        <Box sx={{ display: tab === 4 ? 'block' : 'none' }}>
          <VDOTDashboard {...vdotDashboardProps}  />
        </Box>
      </Box>
    </Box>
  );
};

export default Calculators;