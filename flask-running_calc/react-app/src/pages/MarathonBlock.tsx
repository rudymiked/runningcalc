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
import { generatePaces, generateTableData, type IPaceData, type ITrainingPlan } from "../utils/generateBlockData"; // Import the utility function
import { staticData, type IStaticData } from "../utils/staticData";
import { decimalPaceToString } from "../utils/utils";

const dropDownStyle = { minWidth:"200px", maxWidth:"100%" };

const MarathonBlock = () => {
  const [tableData, setTableData] = useState<ITrainingPlan[]>([]);
  const [weeks, setWeeks] = useState<number>(16);
  const [marathonTime, setMarathonTime] = useState<string>("2:00");
  const [daysPerWeek, setDaysPerWeek] = useState<number>(3);
  const [averageMileage, setAverageMileage] = useState<number>(25);
  const [maximumMileage, setMaximumMileage] = useState<number>(40);
  const [paces, setPaces] = useState<IPaceData>();
  const [totalMiles, setTotalMiles] = useState<number>(0);
  const [calculatedAverageMileage, setCalculatedAverageMileage] = useState<number>(0);

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

  const handleGeneratePlan = () => {
    setPaces(generatePaces(marathonTime));

    setTotalMiles(averageMileage * weeks);

    const generatedTableData = generateTableData(averageMileage, maximumMileage, weeks, daysPerWeek)
    setTableData(generatedTableData.tableData);
    setCalculatedAverageMileage(parseFloat(generatedTableData.calculatedAverage.toFixed(0)));
  };

  return (
    <Box sx={{ padding: 3 }}>
      {/* Page Title */}
      <Typography variant="h4" gutterBottom>
        Marathon Block Generator
      </Typography>

      <Grid container spacing={5}>
        <Grid>
          <Stack spacing={5} paddingBottom={3}>
            {/* Form Section */}
            <Box>
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
                  <FormControl style={dropDownStyle} margin="normal" variant="outlined">
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
                </Box>
              </Stack>

              <Stack>
                <Box>
                  <FormControl style={dropDownStyle} margin="normal" variant="outlined">
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
                </Box>
              </Stack>

              <Stack>
                <Box>
                  <FormControl style={dropDownStyle} margin="normal" variant="outlined">
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
                </Box>
              </Stack>

              <Stack>
                <Box>              
                  <FormControl style={dropDownStyle} margin="normal" variant="outlined">
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
                </Box>
              </Stack>

              <Stack>
                <Box>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ marginTop: 2 }}
                    onClick={handleGeneratePlan}
                  >
                    Generate Plan
                </Button>
                </Box>
              </Stack>
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
                        <b>{paceType}</b>: {decimalPaceToString(paceValue)}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <Typography>No paces generated yet.</Typography>
                )}
              </Box>
          </Stack>
        </Grid>

        {/* Table Section */}
        <Grid>
          <Box sx={{ height: "100%", boxSizing: "border-box" }}>
            <Typography variant="h6" gutterBottom>
              Training Plan:
            </Typography>
            {tableData.length > 0 ? (
              <TableContainer component={Paper} sx={{ maxWidth: "100%", overflowX: "auto" }}>
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
                      <TableCell>Total (Avg)</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {/* New Row for Paces */}
                    <TableRow sx={{ borderBottom: "3px solid black" }}>
                      <TableCell>Pace (min/mile)</TableCell>
                      <TableCell>{paces?.Recovery ? `${decimalPaceToString(paces.Recovery)}` : "N/A"}</TableCell>
                      <TableCell>{paces?.Mile ? `${decimalPaceToString(paces.Mile)}` : "N/A"}</TableCell>
                      <TableCell>{paces?.Easy ? `${decimalPaceToString(paces.Easy)}` : "N/A"}</TableCell>
                      <TableCell>{paces?.Marathon ? `${decimalPaceToString(paces.Marathon)}` : "N/A"}</TableCell>
                      <TableCell>{paces?.Easy ? `${decimalPaceToString(paces.Easy)}` : "N/A"}</TableCell>
                      <TableCell>{paces?.Easy ? `${decimalPaceToString(paces.Easy)}` : "N/A"}</TableCell>
                      <TableCell>{paces?.Easy ? `${decimalPaceToString(paces.Easy)}` : "N/A"}</TableCell>
                      <TableCell>{totalMiles} ({calculatedAverageMileage})</TableCell>
                    </TableRow>
                    {/* Training Plan Rows */}
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
            ) : (
              <Typography>No training plan generated yet.</Typography>
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MarathonBlock;
