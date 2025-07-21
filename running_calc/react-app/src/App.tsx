import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { AppBar, Toolbar, Tabs, Tab, Box, CssBaseline } from "@mui/material";
import "./App.css";
import MarathonBlock from "./pages/MarathonBlock";
import Calculators from "./pages/Calculators";
import About from "./pages/About";
import Header from "./Components/Header";

export const dropDownStyle = { minWidth:"150px" };
export const textAreaStyle = { minWidth:"200px"};

const App = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Router>
      <CssBaseline />
      {/* Navigation Bar */}
      <Header />
      {/* Content Section */}
      <Box sx={{ paddingTop: 8, padding: 4 }}>
        <Routes>
          <Route path="/" element={<Calculators />} />
          <Route path="/calculators" element={<Calculators />} />
          <Route path="/marathonblock" element={<MarathonBlock />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Box>
    </Router>
  );
};

export default App;
