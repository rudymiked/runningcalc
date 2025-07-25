import { useState } from "react";
import { Box, Typography, Button, Grid, Stack, Checkbox, FormControlLabel, MenuItem, Select } from "@mui/material";
import { predictAllRaces, type IRacePredictions } from "../utils/predictAllRaces";

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

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Race Time Prediction
      </Typography>
      <br />
      <Grid container spacing={4}>
        <Grid>
        <Stack spacing={5} paddingBottom={3}>
          {/* Half Marathon Time */}
          <Stack>
            <Typography>Half Marathon Time</Typography>
            <Grid container spacing={1}>
              <Stack>
                <Select
                  fullWidth
                  value={halfMarathonTime.hours}
                  onChange={(e) => setHalfMarathonTime({ ...halfMarathonTime, hours: Number(e.target.value) })}
                >
                  {generateOptions(3)}
                </Select>
                <Typography variant="caption">Hours</Typography>
              </Stack>
              <Stack>
                <Select
                  fullWidth
                  value={halfMarathonTime.minutes}
                  onChange={(e) => setHalfMarathonTime({ ...halfMarathonTime, minutes: Number(e.target.value) })}
                >
                  {generateOptions(59)}
                </Select>
                <Typography variant="caption">Minutes</Typography>
              </Stack>
              <Stack>
                <Select
                  fullWidth
                  value={halfMarathonTime.seconds}
                  onChange={(e) => setHalfMarathonTime({ ...halfMarathonTime, seconds: Number(e.target.value) })}
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
                  onChange={(e) => setUseHalfMarathon(e.target.checked)}
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
                  onChange={(e) => setTenKTime({ ...tenKTime, hours: Number(e.target.value) })}
                >
                  {generateOptions(2)}
                </Select>
                <Typography variant="caption">Hours</Typography>
              </Stack>
              <Stack>
                <Select
                  fullWidth
                  value={tenKTime.minutes}
                  onChange={(e) => setTenKTime({ ...tenKTime, minutes: Number(e.target.value) })}
                >
                  {generateOptions(59)}
                </Select>
                <Typography variant="caption">Minutes</Typography>
              </Stack>
              <Stack>
                <Select
                  fullWidth
                  value={tenKTime.seconds}
                  onChange={(e) => setTenKTime({ ...tenKTime, seconds: Number(e.target.value) })}
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
                  onChange={(e) => setUseTenK(e.target.checked)}
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
                  onChange={(e) => setFiveKTime({ ...fiveKTime, hours: Number(e.target.value) })}
                >
                  {generateOptions(1)}
                </Select>
                <Typography variant="caption">Hours</Typography>
              </Stack>
              <Stack>
                <Select
                  fullWidth
                  value={fiveKTime.minutes}
                  onChange={(e) => setFiveKTime({ ...fiveKTime, minutes: Number(e.target.value) })}
                >
                  {generateOptions(40)}
                </Select>
                <Typography variant="caption">Minutes</Typography>
              </Stack>
              <Stack>
                <Select
                  fullWidth
                  value={fiveKTime.seconds}
                  onChange={(e) => setFiveKTime({ ...fiveKTime, seconds: Number(e.target.value) })}
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
                  onChange={(e) => setUseFiveK(e.target.checked)}
                />
              }
              label="Use 5K"
            />
          </Stack>

          {/* Predict Button */}
          <Stack>
            <Button
              variant="contained"
              color="primary"
              onClick={handlePredictAll}
            >
              Predict Race Times
            </Button>
          </Stack>
          <Typography variant="caption" style={{ maxWidth: "200px" }}>
            Use your race times above to predict your marathon time. If you select multiple races, an average will be calculated based on the selected times.
          </Typography>
        </Stack>
        </Grid>
        <Grid>
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
      </Grid>
    </Box>
  );
};