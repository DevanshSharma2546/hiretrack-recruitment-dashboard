import { useState, useEffect } from 'react';
import { format } from 'date-fns';

const STAGES = ['applied', 'screen', 'tech', 'offer', 'hired', 'rejected'];
const STAGE_COLORS = {
  applied: '#3b82f6', screen: '#f59e0b', tech: '#8b5cf6',
  offer: '#22d3a0', hired: '#10b981', rejected: '#ef4444'
};

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [recentCandidates, setRecentCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [jobsRes, candidatesRes] = await Promise.all([
          fetch('/api/jobs?pageSize=100'),
          fetch('/api/candidates?pageSize=100'),
        ]);
        const jobsData = await jobsRes.json();
        const candidatesData = await candidatesRes.json();

        const jobs = jobsData.jobs || [];
        const candidates = candidatesData.candidates || [];

        const stageCounts = STAGES.reduce((acc, s) => {
          acc[s] = candidates.filter(c => c.stage === s).length;
          return acc;
        }, {});

        setStats({
          totalJobs: jobs.length,
          activeJobs: jobs.filter(j => j.status === 'active').length,
          totalCandidates: candidatesData.pagination?.total || candidates.length,
          hired: stageCounts.hired,
          stageCounts,
        });
        setRecentCandidates(candidates.slice(0, 8));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="loader"><div className="spinner" /></div>;

  const maxStageCount = Math.max(...Object.values(stats?.stageCounts || {}), 1);

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Overview of your hiring pipeline</p>
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          {format(new Date(), 'EEEE, MMMM d yyyy')}
        </div>
      </div>

      <div className="stats-grid">
        {[
          { label: 'Active Jobs', value: stats.activeJobs, icon: '💼', color: 'var(--accent-dim)', textColor: 'var(--accent)' },
          { label: 'Total Candidates', value: stats.totalCandidates, icon: '👥', color: 'var(--blue-dim)', textColor: 'var(--blue)' },
          { label: 'Hired', value: stats.hired, icon: '✅', color: 'var(--green-dim)', textColor: 'var(--green)' },
          { label: 'In Review', value: (stats.stageCounts.screen || 0) + (stats.stageCounts.tech || 0), icon: '⏳', color: 'var(--amber-dim)', textColor: 'var(--amber)' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className="stat-icon" style={{ background: s.color }}>
              <span style={{ fontSize: 22 }}>{s.icon}</span>
            </div>
            <div>
              <div className="stat-value" style={{ color: s.textColor }}>{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
        <div className="card">
          <h3 style={{ fontSize: 16, marginBottom: 20 }}>Pipeline by Stage</h3>
          <div className="chart-bar-wrap">
            {STAGES.map(stage => (
              <div key={stage} className="chart-bar-row">
                <div className="chart-bar-label" style={{ textTransform: 'capitalize' }}>{stage}</div>
                <div className="chart-bar-track">
                  <div
                    className="chart-bar-fill"
                    style={{
                      width: `${(stats.stageCounts[stage] / maxStageCount) * 100}%`,
                      background: STAGE_COLORS[stage]
                    }}
                  />
                </div>
                <div className="chart-bar-value">{stats.stageCounts[stage]}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 style={{ fontSize: 16, marginBottom: 16 }}>Recent Candidates</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {recentCandidates.slice(0, 6).map(c => (
              <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--accent-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: 'var(--accent)', flexShrink: 0 }}>
                  {c.name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.job?.title || 'N/A'}</div>
                </div>
                <span className={`badge badge-${STAGE_BADGE[c.stage]}`} style={{ flexShrink: 0 }}>{c.stage}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <h3 style={{ fontSize: 16, marginBottom: 16 }}>Hiring Funnel</h3>
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', height: 80 }}>
          {STAGES.map(stage => {
            const count = stats.stageCounts[stage] || 0;
            const height = Math.max((count / maxStageCount) * 80, 4);
            return (
              <div key={stage} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div style={{ fontSize: 11, color: 'var(--text-dim)', fontWeight: 600 }}>{count}</div>
                <div style={{ width: '100%', height, background: STAGE_COLORS[stage], borderRadius: '4px 4px 0 0', opacity: 0.8, transition: 'height 0.6s ease' }} />
                <div style={{ fontSize: 10, color: 'var(--text-dim)', textTransform: 'capitalize', textAlign: 'center' }}>{stage}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const STAGE_BADGE = {
  applied: 'blue', screen: 'amber', tech: 'purple',
  offer: 'green', hired: 'green', rejected: 'red'
};
