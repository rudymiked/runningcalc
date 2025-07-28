import { Box, Typography, Stack, Select, MenuItem, List } from "@mui/material";
import { useState } from "react";

const RaceTimeByPace: React.FC = () => {
  const [paceTime, setPaceTime] = useState({ hours: 0, minutes: 8, seconds: 0 });

  const raceDistances = {
    Mile: 1,
    "5K": 3.1069,
    "10K": 6.2137,
    "Half Marathon": 13.1094,
    Marathon: 26.2188,
  };

  const generateOptions = (limit: number) => {
    return Array.from({ length: limit + 1 }, (_, i) => (
        <MenuItem key={i} value={i}>{i}</MenuItem>
    ));
    };

  const calculateRaceTime = (distance: number): string => {
    const { hours, minutes, seconds } = paceTime;
    const totalSecondsPerMile = hours * 3600 + minutes * 60 + seconds;
    const totalSeconds = totalSecondsPerMile * distance;

    const raceHours = Math.floor(totalSeconds / 3600);
    const remaining = totalSeconds % 3600;
    const raceMinutes = Math.floor(remaining / 60);
    const raceSeconds = Math.round(remaining % 60);

    const hour = raceHours > 0 ? `${raceHours}:` : "";
    const minute = raceMinutes > 0 ? `${raceMinutes}:` : "";
    const second = raceSeconds > 0 ? raceSeconds < 10 ? `0${raceSeconds}` : `${raceSeconds}` : "00";

    return `${hour}${minute}${second}`.trim() || "0";
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Race Time by Pace
      </Typography>
      <Typography variant="body1" gutterBottom>
        Choose your pace per mile:
      </Typography>

      <Stack direction="row" spacing={2} mb={3}>
        <Stack>
          <Select
            fullWidth
            value={paceTime.hours}
            onChange={(e) => setPaceTime({ ...paceTime, hours: Number(e.target.value) })}
          >
            {generateOptions(1)}
          </Select>
          <Typography variant="caption">Hours</Typography>
        </Stack>
        <Stack>
          <Select
            fullWidth
            value={paceTime.minutes}
            onChange={(e) => setPaceTime({ ...paceTime, minutes: Number(e.target.value) })}
          >
            {generateOptions(59)}
          </Select>
          <Typography variant="caption">Minutes</Typography>
        </Stack>
        <Stack>
          <Select
            fullWidth
            value={paceTime.seconds}
            onChange={(e) => setPaceTime({ ...paceTime, seconds: Number(e.target.value) })}
          >
            {generateOptions(59)}
          </Select>
          <Typography variant="caption">Seconds</Typography>
        </Stack>
      </Stack>

      <List>
        {Object.entries(raceDistances).map(([race, dist]) => (
            <Stack style={{ textAlign: "justify" }}>
                <Typography variant="h6"><b>{race}</b>: {calculateRaceTime(dist)}</Typography>
            </Stack>
        ))}
      </List>
    </Box>
  );
};

export default RaceTimeByPace;