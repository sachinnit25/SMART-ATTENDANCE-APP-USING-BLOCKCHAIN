import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import { NotificationProvider } from './context/NotificationContext';

function App() {
  return (
    <NotificationProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard/*" element={<Dashboard />} />
        </Routes>
      </HashRouter>
    </NotificationProvider>
  );
}

export default App;
