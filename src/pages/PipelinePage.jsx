import { useState, useEffect, useCallback } from 'react';

const STAGES = [
  { id: 'applied', label: 'Applied', color: '#3b82f6' },
  { id: 'screen', label: 'Screening', color: '#f59e0b' },
  { id: 'tech', label: 'Technical', color: '#8b5cf6' },
  { id: 'offer', label: 'Offer', color: '#22d3a0' },
  { id: 'hired', label: 'Hired', color: '#10b981' },
  { id: 'rejected', label: 'Rejected', color: '#ef4444' },
];

export default function PipelinePage() {
  const [byStage, setByStage] = useState({});
  const [loading, setLoading] = useState(true);
  const [moving, setMoving] = useState(null);
  const [jobFilter, setJobFilter] = useState('');
  const [jobs, setJobs] = useState([]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ pageSize: 200 });
      if (jobFilter) params.set('jobId', jobFilter);
      const [candRes, jobRes] = await Promise.all([
        fetch(`/api/candidates?${params}`),
        fetch('/api/jobs?pageSize=50&status=active'),
      ]);
      const candData = await candRes.json();
      const jobData = await jobRes.json();
      setJobs(jobData.jobs || []);

      const grouped = {};
      STAGES.forEach(s => { grouped[s.id] = []; });
      (candData.candidates || []).forEach(c => {
        if (grouped[c.stage]) grouped[c.stage].push(c);
      });
      setByStage(grouped);
    } finally {
      setLoading(false);
    }
  }, [jobFilter]);

  useEffect(() => { load(); }, [load]);

  const moveCandidate = async (candidate, newStage) => {
    if (candidate.stage === newStage) return;
    setMoving(candidate.id);
    try {
      const res = await fetch(`/api/candidates/${candidate.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage: newStage }),
      });
      const updated = await res.json();
      setByStage(prev => {
        const next = { ...prev };
        next[candidate.stage] = next[candidate.stage].filter(c => c.id !== candidate.id);
        next[newStage] = [updated, ...(next[newStage] || [])];
        return next;
      });
    } finally {
      setMoving(null);
    }
  };

  return (
    <div className="page-content" style={{ maxWidth: '100%' }}>
      <div className="page-header">
        <div>
          <h1>Pipeline</h1>
          <p>Drag candidates across stages to update their status</p>
        </div>
        <select className="input" style={{ width: 220 }} value={jobFilter} onChange={e => setJobFilter(e.target.value)}>
          <option value="">All Positions</option>
          {jobs.map(j => <option key={j.id} value={j.id}>{j.title}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="loader"><div className="spinner" /></div>
      ) : (
        <div className="kanban-board">
          {STAGES.map(stage => {
            const cards = byStage[stage.id] || [];
            return (
              <div key={stage.id} className="kanban-col">
                <div className="kanban-col-header">
                  <div className="kanban-col-title" style={{ color: stage.color }}>{stage.label}</div>
                  <div className="kanban-col-count">{cards.length}</div>
                </div>
                <div
                  className="kanban-cards"
                  style={{ background: `${stage.color}08`, borderRadius: 'var(--radius)', padding: 8, minHeight: 120, border: `1px solid ${stage.color}20` }}
                  onDragOver={e => e.preventDefault()}
                  onDrop={e => {
                    const data = JSON.parse(e.dataTransfer.getData('text/plain'));
                    moveCandidate(data, stage.id);
                  }}
                >
                  {cards.map(c => (
                    <div
                      key={c.id}
                      className="kanban-card"
                      draggable
                      onDragStart={e => e.dataTransfer.setData('text/plain', JSON.stringify(c))}
                      style={{
                        opacity: moving === c.id ? 0.5 : 1,
                        borderLeft: `3px solid ${stage.color}`,
                        cursor: 'grab',
                      }}
                    >
                      <div className="kanban-card-name">{c.name}</div>
                      <div className="kanban-card-email">{c.email}</div>
                      <div className="kanban-card-job">{c.job?.title || 'N/A'}</div>
                      <div style={{ marginTop: 8, display: 'flex', gap: 4 }}>
                        {STAGES.filter(s => s.id !== stage.id).slice(0, 3).map(s => (
                          <button
                            key={s.id}
                            onClick={() => moveCandidate(c, s.id)}
                            style={{
                              fontSize: 10,
                              padding: '2px 6px',
                              background: `${s.color}15`,
                              color: s.color,
                              border: `1px solid ${s.color}30`,
                              borderRadius: 4,
                              cursor: 'pointer',
                              fontFamily: 'var(--font-body)',
                            }}
                          >
                            → {s.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                  {cards.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '24px 8px', color: 'var(--text-dim)', fontSize: 12 }}>
                      Drop here
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
