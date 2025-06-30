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
}

const MarathonBlock = () => {
  const [tableData, setTableData] = useState<ITrainingPlan[]>([]);
  const [weeks, setWeeks] = useState<number>(16);
  const [marathonTime, setMarathonTime] = useState<string>("2:00");
  const [daysPerWeek, setDaysPerWeek] = useState<number>(3);
  const [averageMileage, setAverageMileage] = useState<number>(25);
  const [maximumMileage, setMaximumMileage] = useState<number>(40);

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

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 2fr" },
          gap: 3,
        }}
      >
        {/* Form Section */}
        <Box>
          <FormControl fullWidth margin="normal">
            <InputLabel id="marathon-time-label">Marathon Time</InputLabel>
            <Select
              labelId="marathon-time-label"
              value={marathonTime}
              onChange={(e) => setMarathonTime(e.target.value)}
            >
              {["2:00", "2:30", "3:00", "3:30", "4:00", "4:30", "5:00", "5:30", "6:00"].map((time) => (
                <MenuItem key={time} value={time}>
                  {time}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel id="days-per-week-label">Days Per Week</InputLabel>
            <Select
              labelId="days-per-week-label"
              value={daysPerWeek}
              onChange={(e) => setDaysPerWeek(Number(e.target.value))}
            >
              {[3, 4, 5, 6, 7].map((day) => (
                <MenuItem key={day} value={day}>
                  {day}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel id="average-mileage-label">Average Mileage</InputLabel>
            <Select
              labelId="average-mileage-label"
              value={averageMileage}
              onChange={(e) => setAverageMileage(Number(e.target.value))}
            >
              {[25, 30, 35, 40, 45, 50].map((mileage) => (
                <MenuItem key={mileage} value={mileage}>
                  {mileage} miles
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel id="maximum-mileage-label">Maximum Mileage</InputLabel>
            <Select
              labelId="maximum-mileage-label"
              value={maximumMileage}
              onChange={(e) => setMaximumMileage(Number(e.target.value))}
            >
              {[40, 50, 60, 70, 80, 90].map((mileage) => (
                <MenuItem key={mileage} value={mileage}>
                  {mileage} miles
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel id="weeks-label">Number of Weeks</InputLabel>
            <Select
              labelId="weeks-label"
              value={weeks}
              onChange={(e) => setWeeks(Number(e.target.value))}
            >
              {[16, 17, 18, 19, 20].map((week) => (
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
            onClick={handleGenerateTable}
          >
            Generate Plan
          </Button>
        </Box>

        {/* Table Section */}
        {tableData.length > 0 && (
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
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Box>
  );
};

export default MarathonBlock;
