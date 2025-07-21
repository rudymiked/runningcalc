import { Box, Stack, Tab, Tabs } from "@mui/material";
import { RacePrediction } from "../Calculators/RacePredictor";
import { PaceGenerator } from "../Calculators/PaceGenerator";
import { type SyntheticEvent, useState } from "react";


// --- Main Calculators Page ---
export const Calculators = () => {
  const [tab, setTab] = useState(0);

  function handleTabChange(event: SyntheticEvent<Element, Event>, value: any): void {
    setTab(value);
  }

  return (
    <Box sx={{ padding: 0 }}>
      <Stack>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tab} onChange={handleTabChange} aria-label="calculator tabs">
        <Tab label="Race Time Prediction" />
        <Tab label="Pace Generator" />
        </Tabs>
      </Box>
      {tab === 0 && (
        <Box sx={{ mt: 2 }}>
        <RacePrediction />
        </Box>
      )}
      {tab === 1 && (
        <Box sx={{ mt: 2 }}>
        <PaceGenerator />
        </Box>
      )}
      </Stack>
    </Box>
  );
};

export default Calculators;