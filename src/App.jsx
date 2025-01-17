import React from 'react';
import { HashRouter , Routes, Route } from 'react-router-dom';
import Homepage from './components/Homepage/Homepage';
import Sidebar from './components/sidebar/Sidebar';
import Main from './components/main/Main';
import ImageGenerator from './components/GenerateImage/ImageGenerator';

const App = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/app" element={<><Sidebar /><Main /></>} />
        <Route path = "/generate" element = {<ImageGenerator/>} />
         <Route path="/login" element={<div>Login Page</div>} /> {/* Replace with your actual Login component */}
        <Route path="/signup" element={<div>Sign Up Page</div>} /> {/* Replace with your actual Sign-Up component */}
      </Routes>
    </HashRouter>
  );
};

export default App;
