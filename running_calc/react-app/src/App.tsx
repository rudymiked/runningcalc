import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Box, CssBaseline, Container } from "@mui/material";
import Header from "./Components/Header";
import Calculators from "./pages/Calculators";
import MarathonBlock from "./pages/MarathonBlock";
import About from "./pages/About";

const App = () => (
  <Router>
    <CssBaseline />

    <Header />

    {/* Full-width scroll area */}
    <Box
      sx={{
        position: "absolute",
        top: "64px",
        left: 0,
        //right: 0,
        bottom: 0,
        width: "100%",
        overflowY: "auto",
      }}
    >
      {/* Centers content, max width “md” */}
      <Container maxWidth="md" sx={{ pt: 4, pb: 4 }}>
        <Routes>
          <Route path="/" element={<Calculators />} />
          <Route path="/calculators" element={<Calculators />} />
          <Route path="/marathonblock" element={<MarathonBlock />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Container>
    </Box>
  </Router>
);

export default App;