import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import DailyInput from './pages/DailyInput';
import Statistics from './pages/Statistics';
import TeamManagement from './pages/TeamManagement';
import SettingsPage from './pages/Settings';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="daily-input" element={<DailyInput />} />
          <Route path="statistics" element={<Statistics />} />
          <Route path="team-management" element={<TeamManagement />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
