import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './components/Homepage/Homepage';
import Sidebar from './components/sidebar/Sidebar';
import Main from './components/main/Main';
import ImageGenerator from './components/GenerateImage/ImageGenerator';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/app" element={<><Sidebar /><Main /></>} />
        <Route path = "/generate" element = {<ImageGenerator/>} />
         <Route path="/login" element={<div>Login Page</div>} /> {/* Replace with your actual Login component */}
        <Route path="/signup" element={<div>Sign Up Page</div>} /> {/* Replace with your actual Sign-Up component */}
      </Routes>
    </Router>
  );
};

export default App;
