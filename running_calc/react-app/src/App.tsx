import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { AppBar, Toolbar, Tabs, Tab, Box } from "@mui/material";
import "./App.css";
import MarathonBlock from "./pages/MarathonBlock";
import Calculators from "./pages/Calculators";
import About from "./pages/About";

export const dropDownStyle = { minWidth:"150px", maxWidth:"100%" };
export const textAreaStyle = { minWidth:"200px", maxWidth:"100%" };

const App = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Router>
      {/* Navigation Bar */}
      <AppBar position="fixed">
        <Toolbar>
          <Tabs
            value={value}
            onChange={handleChange}
            textColor="inherit"
            indicatorColor="secondary"
            aria-label="navigation tabs"
          >
            <Tab label="Marathon Block" component={Link} to="/marathonblock" />
            <Tab label="Calculators" component={Link} to="/calculators" />
            <Tab label="About" component={Link} to="/about" />
          </Tabs>
        </Toolbar>
      </AppBar>

      {/* Content Section */}
      <Box sx={{ paddingTop: 8, padding: 2 }}>
        <Routes>
          <Route path="/" element={<Calculators />} />
          <Route path="/marathonblock" element={<MarathonBlock />} />
          <Route path="/calculators" element={<Calculators />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Box>
    </Router>
  );
};

export default App;
