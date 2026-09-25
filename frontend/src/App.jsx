import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import { AuthProvider } from './context/AuthContext';
import AppLayout from './components/AppLayout';
import ProtectedRoute from './components/ProtectedRoute';
import PublicOnlyRoute from './components/PublicOnlyRoute';
import LoginPage from './pages/LoginPage';
import CandidateRegisterPage from './pages/CandidateRegisterPage';
import EmployerRegisterPage from './pages/EmployerRegisterPage';
import JobListPage from './pages/JobListPage';
import JobDetailPage from './pages/JobDetailPage';
import PostJobPage from './pages/PostJobPage';
import MyJobPostingsPage from './pages/MyJobPostingsPage';
import MyApplicationsPage from './pages/MyApplicationsPage';
import EditProfilePage from './pages/EditProfilePage';
import NotificationsPage from './pages/NotificationsPage';
import HomePage from './pages/HomePage';
import SettingsPage from './pages/SettingsPage';
import HelpSupportPage from './pages/HelpSupportPage';
import { ThemeProvider } from './context/ThemeContext';
import SavedJobsPage from './pages/SavedJobsPage';


function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/browse-jobs" element={<JobListPage />} /> 
              <Route path="/jobs/:jobId" element={<JobDetailPage />} />

              <Route path="/login" element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>} />
              <Route path="/register/candidate" element={<PublicOnlyRoute><CandidateRegisterPage /></PublicOnlyRoute>} />
              <Route path="/register/employer" element={<PublicOnlyRoute><EmployerRegisterPage /></PublicOnlyRoute>} />

              <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><EditProfilePage /></ProtectedRoute>} />
              <Route path="/my-applications" element={<ProtectedRoute requiredRole="candidate"><MyApplicationsPage /></ProtectedRoute>} />
              <Route path="/saved-jobs" element={<ProtectedRoute requiredRole="candidate"><SavedJobsPage /></ProtectedRoute>} />
              <Route path="/my-jobs" element={<ProtectedRoute requiredRole="employer"><MyJobPostingsPage /></ProtectedRoute>} />
              <Route path="/post-job" element={<ProtectedRoute requiredRole="employer"><PostJobPage /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
              <Route path="/help" element={<ProtectedRoute><HelpSupportPage /></ProtectedRoute>} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;