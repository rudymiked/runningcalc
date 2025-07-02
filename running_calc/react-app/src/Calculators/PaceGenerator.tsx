import { useState } from "react";
import { Box, Typography, Button, Stack, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { dropDownStyle } from "../App";
import { staticData, type IStaticData } from "../utils/staticData";
import React from "react";
import { generatePaces, type IPaceData } from "../utils/generateBlockData";
import { decimalPaceToString, removeLeadingZerosAndColons } from "../utils/utils";

// --- PaceGenerator Component ---
export const PaceGenerator = () => {
  const [marathonTime, setMarathonTime] = useState<string>("2:00");
  const [paces, setPaces] = useState<IPaceData>();
  const [data, setData] = useState<IStaticData>({
    marathon_times: [],
    days_per_week: [],
    average_mileage: [],
    maximum_mileage: [],
    weeks: [],
  });

  React.useEffect(() => {
    setData(staticData);
  }, []);

  const handleGeneratePaces = () => {
    setPaces(generatePaces(marathonTime));
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Pace Generator
      </Typography>
      <Stack>
        <Box>
          <FormControl style={dropDownStyle} margin="normal" variant="outlined">
            <InputLabel id="marathon-time-label">Marathon Time</InputLabel>
            <Select
              labelId="marathon-time-label"
              value={marathonTime}
              onChange={(e) => setMarathonTime(e.target.value)}
              label="Marathon Time"
            >
              {data.marathon_times.map((time) => (
                <MenuItem key={time} value={time}>
                  {time}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Stack>
      <Stack>
        <Box>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ marginTop: 2 }}
            onClick={handleGeneratePaces}
          >
            Generate Paces
          </Button>
        </Box>
      </Stack>
      <Stack>
        {/* Paces Section */}
        <Box>
          <Typography variant="h6" gutterBottom>
            Paces (min/mile):
          </Typography>
          {paces && Object.keys(paces).length > 0 ? (
            <ul>
              {Object.entries(paces).map(([paceType, paceValue]) => (
                <li key={paceType} style={{ listStyleType: "none", textAlign: "justify" }}>
                  <b>{paceType}</b>: {decimalPaceToString(paceValue.pace)} ({removeLeadingZerosAndColons(paceValue.time)})
                </li>
              ))}
            </ul>
          ) : (
            <Typography>No paces generated yet.</Typography>
          )}
        </Box>
      </Stack>
    </Box>
  );
};