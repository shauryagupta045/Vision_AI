import React, { useContext, useEffect } from 'react';
import { Context } from './context/Context';
import Toast from './components/Toast';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Homepage from './components/Homepage/Homepage';
import Sidebar from './components/sidebar/Sidebar';
import Main from './components/main/Main';
import ImageGenerator from './components/GenerateImage/ImageGenerator';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

const App = () => {
  const { toast, clearToast } = useContext(Context);
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  useEffect(() => {
    if (toast?.message) {
      const timer = setTimeout(() => {
        clearToast();
      }, 3000); // Clear toast after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [toast, clearToast]);

  return (
    <HashRouter>
      {toast?.message && <Toast message={toast.message} type={toast.type} />}
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/app" element={<><Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} /><Main sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} /></>} />
        <Route path="/generate" element={<ImageGenerator />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
