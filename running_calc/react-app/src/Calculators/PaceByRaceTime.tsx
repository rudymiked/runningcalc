import { Box, Typography, Stack, Select, MenuItem } from "@mui/material";
import { useState } from "react";

const generateOptions = (limit: number) => {
  return Array.from({ length: limit + 1 }, (_, i) => (
    <MenuItem key={i} value={i}>{i}</MenuItem>
  ));
};

type RaceName = "Mile" | "5K" | "10K" | "Half Marathon" | "Marathon";

const PaceByRaceTime: React.FC = () => {
  const [race, setRace] = useState<RaceName>("5K");
  const [raceTime, setRaceTime] = useState({ hours: 0, minutes: 25, seconds: 0 });

  const raceDistances: Record<RaceName, number> = {
    "Mile": 1,
    "5K": 3.1069,
    "10K": 6.2137,
    "Half Marathon": 13.1094,
    "Marathon": 26.2188,
  };

  const calculatePace = (): string => {
    const { hours, minutes, seconds } = raceTime;
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
    const distance = raceDistances[race];
    const secondsPerMile = totalSeconds / distance;

    const paceMin = Math.floor(secondsPerMile / 60);
    const paceSec = Math.round(secondsPerMile % 60);

    const formattedSec = paceSec < 10 ? `0${paceSec}` : `${paceSec}`;
    return `${paceMin}:${formattedSec} per mile`;
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Pace by Race Time
      </Typography>
      <Typography variant="body1" gutterBottom>
        Select a race and input your finish time to calculate your average pace per mile.
      </Typography>

      <Stack direction="row" spacing={2} mt={2} mb={3}>
        <Stack>
          <Select
            fullWidth
            value={race}
            onChange={(e) => setRace(e.target.value)}
          >
            {Object.keys(raceDistances).map((r) => (
              <MenuItem key={r} value={r}>{r}</MenuItem>
            ))}
          </Select>
          <Typography variant="caption">Race</Typography>
        </Stack>
        <Stack>
          <Select
            fullWidth
            value={raceTime.hours}
            onChange={(e) => setRaceTime({ ...raceTime, hours: Number(e.target.value) })}
          >
            {generateOptions(5)}
          </Select>
          <Typography variant="caption">Hours</Typography>
        </Stack>
        <Stack>
          <Select
            fullWidth
            value={raceTime.minutes}
            onChange={(e) => setRaceTime({ ...raceTime, minutes: Number(e.target.value) })}
          >
            {generateOptions(59)}
          </Select>
          <Typography variant="caption">Minutes</Typography>
        </Stack>
        <Stack>
          <Select
            fullWidth
            value={raceTime.seconds}
            onChange={(e) => setRaceTime({ ...raceTime, seconds: Number(e.target.value) })}
          >
            {generateOptions(59)}
          </Select>
          <Typography variant="caption">Seconds</Typography>
        </Stack>
      </Stack>

      <Typography variant="h6" gutterBottom>
        <b>Pace</b>: {calculatePace()}
      </Typography>
    </Box>
  );
};

export default PaceByRaceTime;