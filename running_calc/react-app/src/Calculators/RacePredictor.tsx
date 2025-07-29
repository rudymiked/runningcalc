import { useState } from "react";
import { Box, Typography, Button, Grid, Stack, Checkbox, FormControlLabel, MenuItem, Select } from "@mui/material";
import { predictAllRaces, type IRacePredictions } from "../utils/predictAllRaces";
import React from "react";

// --- RacePrediction Component ---
export const RacePrediction = () => {
  const [halfMarathonTime, setHalfMarathonTime] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [fiveKTime, setFiveKTime] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [tenKTime, setTenKTime] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [useHalfMarathon, setUseHalfMarathon] = useState<boolean>(false);
  const [useFiveK, setUseFiveK] = useState<boolean>(false);
  const [useTenK, setUseTenK] = useState<boolean>(false);
  const [predictedTimes, setPredictedTimes] = useState<IRacePredictions | null>(null);

  const formatTime = (time: { hours: number; minutes: number; seconds: number }): string =>
    `${time.hours}:${time.minutes.toString().padStart(2, "0")}:${time.seconds.toString().padStart(2, "0")}`;

  React.useEffect(() => {
    handlePredictAll();
  }, [halfMarathonTime, fiveKTime, tenKTime, useHalfMarathon, useFiveK, useTenK]);

  const handlePredictAll = () => {
    setPredictedTimes(
      predictAllRaces(
        useHalfMarathon ? formatTime(halfMarathonTime) : "",
        useFiveK ? formatTime(fiveKTime) : "",
        useTenK ? formatTime(tenKTime) : ""
      )
    );
  };

  const generateOptions = (max: number) =>
    Array.from({ length: max + 1 }, (_, i) => (
      <MenuItem key={i} value={i}>
        {i}
      </MenuItem>
    ));

  const handleSetHalfMarathonTime = (field: keyof typeof halfMarathonTime, value: number) => {
    setHalfMarathonTime((prev) => {
      const updated = { ...prev, [field]: value };
      if (Object.values(updated).some((v) => v > 0)) setUseHalfMarathon(true);
      return updated;
    });
  };

  const handleSetUseHalfMarathon = (checked: boolean) => {
    setUseHalfMarathon(checked);
  };

  const handleSetTenKTime = (field: keyof typeof halfMarathonTime, value: number) => {
    setTenKTime((prev) => {
      const updated = { ...prev, [field]: value };
      if (Object.values(updated).some((v) => v > 0)) setUseTenK(true);
      return updated;
    });
  };

  const handleSetUseTenK = (checked: boolean) => {
    setUseTenK(checked);
  };

  const handleSetFiveKTime = (field: keyof typeof halfMarathonTime, value: number) => {
    setFiveKTime((prev) => {
      const updated = { ...prev, [field]: value };
      if (Object.values(updated).some((v) => v > 0)) setUseFiveK(true);
      return updated;
    });
  };

  const handleSetUseFiveK = (checked: boolean) => {
    setUseFiveK(checked);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Race Time Prediction
      </Typography>
      <Typography>
        Use your race times to predict your marathon time. If you select multiple races, an average will be calculated based on the selected times.
      </Typography>
      <br />
        <Grid>
        <Stack paddingBottom={3}>
          {/* Half Marathon Time */}
          <Stack>
            <Typography>Half Marathon Time</Typography>
            <Grid container spacing={1}>
              <Stack>
                <Select
                  fullWidth
                  value={halfMarathonTime.hours}
                  onChange={(e) => handleSetHalfMarathonTime("hours", Number(e.target.value))}
                >
                  {generateOptions(3)}
                </Select>
                <Typography variant="caption">Hours</Typography>
              </Stack>
              <Stack>
                <Select
                  fullWidth
                  value={halfMarathonTime.minutes}
                  onChange={(e) => handleSetHalfMarathonTime("minutes", Number(e.target.value))}
                >
                  {generateOptions(59)}
                </Select>
                <Typography variant="caption">Minutes</Typography>
              </Stack>
              <Stack>
                <Select
                  fullWidth
                  value={halfMarathonTime.seconds}
                  onChange={(e) => handleSetHalfMarathonTime("seconds", Number(e.target.value))}
                >
                  {generateOptions(59)}
                </Select>
                <Typography variant="caption">Seconds</Typography>
              </Stack>
            </Grid>
            <FormControlLabel
              control={
                <Checkbox
                  checked={useHalfMarathon}
                  onChange={(e) => handleSetUseHalfMarathon(e.target.checked)}
                />
              }
              label="Use Half Marathon"
            />
          </Stack>

          {/* 10K Time */}
          <Stack>
            <Typography>10K Time</Typography>
            <Grid container spacing={1}>
              <Stack>
                <Select
                  fullWidth
                  value={tenKTime.hours}
                  onChange={(e) => handleSetTenKTime("hours", Number(e.target.value))}
                >
                  {generateOptions(2)}
                </Select>
                <Typography variant="caption">Hours</Typography>
              </Stack>
              <Stack>
                <Select
                  fullWidth
                  value={tenKTime.minutes}
                  onChange={(e) => handleSetTenKTime("minutes", Number(e.target.value))}
                >
                  {generateOptions(59)}
                </Select>
                <Typography variant="caption">Minutes</Typography>
              </Stack>
              <Stack>
                <Select
                  fullWidth
                  value={tenKTime.seconds}
                  onChange={(e) => handleSetTenKTime("seconds", Number(e.target.value))}
                >
                  {generateOptions(59)}
                </Select>
                <Typography variant="caption">Seconds</Typography>
              </Stack>
            </Grid>
            <FormControlLabel
              control={
                <Checkbox
                  checked={useTenK}
                  onChange={(e) => handleSetUseTenK(e.target.checked)}
                />
              }
              label="Use 10K"
            />
          </Stack>

          {/* 5K Time */}
          <Stack>
            <Typography>5K Time</Typography>
            <Grid container spacing={1}>
              <Stack>
                <Select
                  fullWidth
                  value={fiveKTime.hours}
                  onChange={(e) => handleSetFiveKTime("hours", Number(e.target.value))}
                >
                  {generateOptions(1)}
                </Select>
                <Typography variant="caption">Hours</Typography>
              </Stack>
              <Stack>
                <Select
                  fullWidth
                  value={fiveKTime.minutes}
                  onChange={(e) => handleSetFiveKTime("minutes", Number(e.target.value))}
                >
                  {generateOptions(40)}
                </Select>
                <Typography variant="caption">Minutes</Typography>
              </Stack>
              <Stack>
                <Select
                  fullWidth
                  value={fiveKTime.seconds}
                  onChange={(e) => handleSetFiveKTime("seconds", Number(e.target.value))}
                >
                  {generateOptions(59)}
                </Select>
                <Typography variant="caption">Seconds</Typography>
              </Stack>
            </Grid>
            <FormControlLabel
              control={
                <Checkbox
                  checked={useFiveK}
                  onChange={(e) => handleSetUseFiveK(e.target.checked)}
                />
              }
              label="Use 5K"
            />
          </Stack>

          {/* Predict Button
          <Stack>
            <Button
              variant="contained"
              color="primary"
              onClick={handlePredictAll}
            >
              Predict Race Times
            </Button>
          </Stack> */}
        </Stack>
          {/* Predicted Race Times */}
          {/* {predictedTimes && ( */}
            <Stack style={{ textAlign: "justify" }}>
              <Typography variant="h6">
                <b>Marathon</b>: {predictedTimes && (<> {predictedTimes?.marathon.time} ({predictedTimes?.marathon.pace}) </>)}
              </Typography>
              <Typography variant="h6">
                <b>Half Marathon</b>: {predictedTimes && (<> {predictedTimes?.half.time} ({predictedTimes?.half.pace}) </>)}
              </Typography>
              <Typography variant="h6">
                <b>10K</b>: {predictedTimes && (<> {predictedTimes?.tenK.time} ({predictedTimes?.tenK.pace}) </>)}
              </Typography>
              <Typography variant="h6">
                <b>5K</b>: {predictedTimes && (<> {predictedTimes?.fiveK.time} ({predictedTimes?.fiveK.pace}) </>)}
              </Typography>
            </Stack>
          {/* )} */}
      </Grid>
    </Box>
  );
};