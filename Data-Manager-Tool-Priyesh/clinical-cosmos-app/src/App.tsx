import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
// Placeholder pages - will be implemented one by one
import Dashboard from './pages/Dashboard';
import StudyManagement from './pages/StudyManagement';
import DataIntegration from './pages/DataIntegration';
import TrialDataManagement from './pages/TrialDataManagement';
import DataManagerAI from './pages/DataManagerAI';
import CentralMonitorAI from './pages/CentralMonitorAI';
import SignalDetection from './pages/SignalDetection';
import Tasks from './pages/Tasks';
import RiskProfiles from './pages/RiskProfiles';
import Analytics from './pages/Analytics';
import Notifications from './pages/Notifications';
import Admin from './pages/Admin';



// Temporary placeholder for missing pages
const Placeholder = ({ title }: { title: string }) => (
  <div className="p-8">
    <h1 className="text-2xl font-bold mb-4">{title}</h1>
    <p>This page is under construction.</p>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/study-management" element={<StudyManagement />} />
          <Route path="/data-integration" element={<DataIntegration />} />
          <Route path="/trial-data-management" element={<TrialDataManagement />} />
          <Route path="/data-manager-ai" element={<DataManagerAI />} />
          <Route path="/central-monitor-ai" element={<CentralMonitorAI />} />
          <Route path="/signal-detection" element={<SignalDetection />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/risk-profiles" element={<RiskProfiles />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/ai-agents" element={<Placeholder title="AI Agents" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
