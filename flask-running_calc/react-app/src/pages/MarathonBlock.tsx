import React, { useState } from "react";
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  Stack,
} from "@mui/material";

interface ITrainingPlan {
  week: string;
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  sunday: string;
  total_miles?: number;
}

interface IApiData {
  marathon_times: string[];
  days_per_week: number[];
  average_mileage: number[];
  maximum_mileage: number[];
  weeks: number[];
}

const MarathonBlock = () => {
  const [tableData, setTableData] = useState<ITrainingPlan[]>([]);
  const [weeks, setWeeks] = useState<number>(16);
  const [marathonTime, setMarathonTime] = useState<string>("2:00");
  const [daysPerWeek, setDaysPerWeek] = useState<number>(3);
  const [averageMileage, setAverageMileage] = useState<number>(25);
  const [maximumMileage, setMaximumMileage] = useState<number>(40);
  const [paces, setPaces] = useState<Record<string, number>>({}); // State for paces

  const [data, setData] = useState<IApiData>({
    marathon_times: [],
    days_per_week: [],
    average_mileage: [],
    maximum_mileage: [],
    weeks: [],
  });

  React.useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/data`)
      .then((response) => response.json())
      .then((data) => setData(data));
  }, []);

  const handleGeneratePaces = () => {
    fetch(`${import.meta.env.VITE_API_URL}/api/paces`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ marathon_time: marathonTime }),
    })
      .then((response) => response.json())
      .then((data) => setPaces(data.paces))
      .catch((error) => console.error("Error fetching paces:", error));
  };

  const handleGenerateTable = () => {
    const data = Array.from({ length: weeks }, (_, i) => ({
      week: `Week ${i + 1}`,
      monday: "Rest",
      tuesday: "Run",
      wednesday: "Cross-train",
      thursday: "Run",
      friday: "Rest",
      saturday: "Long Run",
      sunday: "Recovery Run",
    }));
    setTableData(data);
  };

  return (
    <Box sx={{ padding: 3 }}>
      {/* Page Title */}
      <Typography variant="h4" gutterBottom>
        Marathon Block Generator
      </Typography>

      <Grid container spacing={2}>
        <Grid size={4}>
          <Stack spacing={2}>
              {/* Form Section */}  
              <Box>
                <FormControl fullWidth margin="normal" variant="outlined">
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

                <FormControl fullWidth margin="normal" variant="outlined">
                  <InputLabel id="days-per-week-label">Days Per Week</InputLabel>
                  <Select
                    labelId="days-per-week-label"
                    value={daysPerWeek}
                    onChange={(e) => setDaysPerWeek(Number(e.target.value))}
                    label="Days Per Week"
                  >
                    {data.days_per_week.map((day) => (
                      <MenuItem key={day} value={day}>
                        {day}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth margin="normal" variant="outlined">
                  <InputLabel id="average-mileage-label">Average Mileage</InputLabel>
                  <Select
                    labelId="average-mileage-label"
                    value={averageMileage}
                    onChange={(e) => setAverageMileage(Number(e.target.value))}
                    label="Average Mileage"
                  >
                    {data.average_mileage.map((mileage) => (
                      <MenuItem key={mileage} value={mileage}>
                        {mileage} miles
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth margin="normal" variant="outlined">
                  <InputLabel id="maximum-mileage-label">Maximum Mileage</InputLabel>
                  <Select
                    labelId="maximum-mileage-label"
                    value={maximumMileage}
                    onChange={(e) => setMaximumMileage(Number(e.target.value))}
                    label="Maximum Mileage"
                  >
                    {data.maximum_mileage.map((mileage) => (
                      <MenuItem key={mileage} value={mileage}>
                        {mileage} miles
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth margin="normal" variant="outlined">
                  <InputLabel id="weeks-label">Number of Weeks</InputLabel>
                  <Select
                    labelId="weeks-label"
                    value={weeks}
                    onChange={(e) => setWeeks(Number(e.target.value))}
                    label="Number of Weeks"
                  >
                    {data.weeks.map((week) => (
                      <MenuItem key={week} value={week}>
                        {week} weeks
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ marginTop: 2 }}
                  onClick={() => {
                    handleGenerateTable();
                    handleGeneratePaces();
                  }}
                >
                  Generate Plan
                </Button>
            </Box>
            <Box>
              {/* Paces Section */}
              {Object.entries(paces).length > 0 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Paces:
                  </Typography>
                  <ul>
                    {Object.entries(paces).map(([paceType, paceValue]) => (
                        <li key={paceType} style={{ listStyleType: "none", textAlign: "left" }}>
                        {paceType}: {Math.floor(paceValue)}m {Math.round((paceValue % 1) * 60)}s per mile
                        </li>
                    ))}
                  </ul>
                </Box>
              )}
            </Box>
          </Stack>
        </Grid>
        <Grid size={8}>
          <Box sx={{ height: '100%', boxSizing: 'border-box' }}>
                        {/* Table Section */}
                        {(
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Week #</TableCell>
                      <TableCell>Monday</TableCell>
                      <TableCell>Tuesday</TableCell>
                      <TableCell>Wednesday</TableCell>
                      <TableCell>Thursday</TableCell>
                      <TableCell>Friday</TableCell>
                      <TableCell>Saturday</TableCell>
                      <TableCell>Sunday</TableCell>
                      <TableCell>Total Miles</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {tableData.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell>{row.week}</TableCell>
                        <TableCell>{row.monday}</TableCell>
                        <TableCell>{row.tuesday}</TableCell>
                        <TableCell>{row.wednesday}</TableCell>
                        <TableCell>{row.thursday}</TableCell>
                        <TableCell>{row.friday}</TableCell>
                        <TableCell>{row.saturday}</TableCell>
                        <TableCell>{row.sunday}</TableCell>
                        <TableCell>{row.total_miles}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MarathonBlock;
