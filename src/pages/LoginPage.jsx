import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (e, em, pw) => {
    e.preventDefault();
    setEmail(em);
    setPassword(pw);
  };

  return (
    <div className="login-page">
      <div className="login-bg-glow" />
      <div className="login-card">
        <div className="login-logo">
          <div className="login-logo-icon">⚡</div>
          <div className="login-logo-text">Talent<span>Flow</span></div>
        </div>
        <h1 className="login-title">Welcome back</h1>
        <p className="login-subtitle">Sign in to your hiring dashboard</p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="input"
              placeholder="admin@talentflow.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="input"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          {error && (
            <div style={{ padding: '10px 14px', background: 'var(--red-dim)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 'var(--radius-sm)', fontSize: 13, color: 'var(--red)' }}>
              {error}
            </div>
          )}
          <button type="submit" className="btn btn-primary btn-lg w-full" disabled={loading} style={{ marginTop: 4, justifyContent: 'center' }}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div className="login-hint">
          <p>Demo accounts (click to fill):</p>
          <code>
            <a href="#" onClick={e => fillDemo(e, 'admin@talentflow.com', 'admin123')} style={{ color: 'var(--accent)', textDecoration: 'none' }}>admin@talentflow.com / admin123</a>{'\n'}
            <a href="#" onClick={e => fillDemo(e, 'hr@talentflow.com', 'hr123')} style={{ color: 'var(--accent)', textDecoration: 'none' }}>hr@talentflow.com / hr123</a>{'\n'}
            <a href="#" onClick={e => fillDemo(e, 'demo@talentflow.com', 'demo123')} style={{ color: 'var(--accent)', textDecoration: 'none' }}>demo@talentflow.com / demo123</a>
          </code>
        </div>
      </div>
    </div>
  );
}
