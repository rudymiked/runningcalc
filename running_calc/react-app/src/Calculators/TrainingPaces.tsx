import { useState } from "react";
import { Box, Typography, Button, Stack, FormControl, InputLabel, MenuItem, Select, Grid } from "@mui/material";
import { dropDownStyle } from "../styles";
import { staticData, type IStaticData } from "../utils/staticData";
import React from "react";
import { generatePaces, type IPaceData } from "../utils/generatePaces";
import { PaceList } from "../Components/PaceList";

// --- TraingingPace Component ---
export const TrainingPaces = () => {
  const [marathonTime, setMarathonTime] = useState<string>("2:00");
  const [paces, setPaces] = useState<IPaceData>();
  const [data, setData] = useState<IStaticData>(staticData);

  React.useEffect(() => {
    setData(staticData);
  }, []);

  const handleGeneratePaces = (e: React.ChangeEvent<Omit<HTMLInputElement, "value"> & {
    value: string;
}> | (Event & {
    target: {
        value: string;
        name: string;
    };
})) => {
    setMarathonTime(e.target.value)
    setPaces(generatePaces(marathonTime));
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Training Pace Generator
      </Typography>
      <Typography variant="body1" gutterBottom>
        Calculate your training paces based on your marathon time.
      </Typography>
      <Grid container spacing={4}>
        <Grid>
          <Stack>
            <Box>
              <FormControl style={dropDownStyle} margin="normal" variant="outlined">
                <InputLabel id="marathon-time-label">Marathon Time</InputLabel>
                <Select
                  labelId="marathon-time-label"
                  value={marathonTime}
                  onChange={(e) => handleGeneratePaces(e)}
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
      </Grid>
        <Grid>
          <Stack>
            {/* Paces Section */}
            <Box>
                <PaceList paces={paces} />
            </Box>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};