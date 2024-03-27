import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';  // Use BrowserRouter as Router
import Homepage from './Homepage';
import Projects from './Projects';
import Resume from './Resume';
import Contact from './Contact';
import Blog from './🔵blog';
import Navbar from './Navbar';
import DarkMode from './darkmode';
import Lenis from '@studio-freight/lenis'
import ScrollToTop from './scrolltotop';
import Slam from './slam';
import { Toaster, toast } from 'sonner';
import SingleBlogPost from './🔵BlogDynamic';
import AllLeetCodeProblems from './🔵blogAllLeetcodeP';

function App() {



  return (
    <Router>
      <Toaster position="bottom-left" toastOptions={{ duration: 3000 }} />
      <ScrollToTop>
          <Navbar />
          {/* Wrap your components with the BrowserRouter */}
          <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="Projects" element={<Projects />} />
              <Route path="Resume" element={<Resume />} />
              <Route path="Contact" element={<Contact />} />
              <Route path="Slam" element={<Slam />} />
              <Route path="Blog/*" element={<Blog />} />
              {/* Dynamic route for individual blog posts */}
              <Route path="Blog/:id" element={<SingleBlogPost />} />
              <Route path="Blog/allLeetCodeProblems" element={<AllLeetCodeProblems />} />
          </Routes>
        </ScrollToTop>
    </Router>
  );
}

export default App;
