import { useAuth } from '../../context/AuthContext';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: '▦' },
  { id: 'jobs', label: 'Jobs', icon: '💼' },
  { id: 'candidates', label: 'Candidates', icon: '👥' },
  { id: 'pipeline', label: 'Pipeline', icon: '⬡' },
  { id: 'assessments', label: 'Assessments', icon: '📋' },
];

export default function Sidebar({ activePage, onNavigate }) {
  const { user, logout } = useAuth();
  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">⚡</div>
        <div className="sidebar-logo-text">Hire<span>Track</span></div>
      </div>

      <nav className="sidebar-nav">
        <span className="nav-section-label">Main</span>
        {navItems.map(item => (
          <button
            key={item.id}
            className={`nav-item ${activePage === item.id ? 'active' : ''}`}
            onClick={() => onNavigate(item.id)}
          >
            <span style={{ fontSize: 16 }}>{item.icon}</span>
            {item.label}
          </button>
        ))}

        <span className="nav-section-label">Account</span>
        <button className="nav-item" onClick={logout}>
          <span style={{ fontSize: 16 }}>🚪</span>
          Sign out
        </button>
      </nav>

      <div className="sidebar-footer">
        <div className="user-card">
          <div className="user-avatar">{initials}</div>
          <div>
            <div className="user-name">{user?.name}</div>
            <div className="user-role">{user?.role}</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
