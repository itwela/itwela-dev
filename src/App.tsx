import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';  // Use BrowserRouter as Router
import Homepage from './Homepage';
import Projects from './Projects';
import Resume from './Resume';
import Contact from './Contact';
import Navbar from './Navbar';
import DarkMode from './darkmode';


function App() {
  return (
    <Router>
        <DarkMode />
        {/* Wrap your components with the BrowserRouter */}
        <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="Projects" element={<Projects />} />
            <Route path="Resume" element={<Resume />} />
            <Route path="Contact" element={<Contact />} />
        </Routes>
        <Navbar />
    </Router>
  );
}

export default App;
