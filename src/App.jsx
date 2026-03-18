import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import JobsPage from './pages/JobsPage';
import CandidatesPage from './pages/CandidatesPage';
import PipelinePage from './pages/PipelinePage';
import AssessmentsPage from './pages/AssessmentsPage';
import Sidebar from './components/layout/Sidebar';

const PAGE_TITLES = {
  dashboard: 'Dashboard',
  jobs: 'Jobs',
  candidates: 'Candidates',
  pipeline: 'Pipeline',
  assessments: 'Assessments',
};

function AppInner() {
  const { user, loading } = useAuth();
  const [page, setPage] = useState('dashboard');

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div className="spinner" />
      </div>
    );
  }

  if (!user) return <LoginPage />;

  const renderPage = () => {
    switch (page) {
      case 'dashboard': return <DashboardPage />;
      case 'jobs': return <JobsPage />;
      case 'candidates': return <CandidatesPage />;
      case 'pipeline': return <PipelinePage />;
      case 'assessments': return <AssessmentsPage />;
      default: return <DashboardPage />;
    }
  };

  return (
    <div className="app-layout">
      <Sidebar activePage={page} onNavigate={setPage} />
      <div className="main-content">
        <header className="topbar">
          <div className="topbar-title">{PAGE_TITLES[page]}</div>
          <div className="topbar-actions">
            <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
              {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            </span>
          </div>
        </header>
        {renderPage()}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}