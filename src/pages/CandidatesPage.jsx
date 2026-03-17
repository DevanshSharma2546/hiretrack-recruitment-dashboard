import { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';

const STAGES = ['applied', 'screen', 'tech', 'offer', 'hired', 'rejected'];
const STAGE_BADGE = {
  applied: 'blue', screen: 'amber', tech: 'purple',
  offer: 'green', hired: 'green', rejected: 'red'
};

function CandidateModal({ candidate, onClose, onUpdate }) {
  const [timeline, setTimeline] = useState([]);
  const [stage, setStage] = useState(candidate.stage);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/candidates/${candidate.id}/timeline`)
      .then(r => r.json())
      .then(setTimeline)
      .catch(() => {});
  }, [candidate.id]);

  const updateStage = async () => {
    if (stage === candidate.stage && !notes) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/candidates/${candidate.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage, notes }),
      });
      const updated = await res.json();
      onUpdate(updated);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 640 }}>
        <div className="modal-header">
          <div>
            <h2>{candidate.name}</h2>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>{candidate.email}</div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="detail-grid">
            <div className="detail-item">
              <div className="detail-label">Applied for</div>
              <div className="detail-value">{candidate.job?.title || 'Unknown'}</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">Phone</div>
              <div className="detail-value">{candidate.phone || '—'}</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">Experience</div>
              <div className="detail-value">{candidate.experience ? `${candidate.experience} years` : '—'}</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">Applied on</div>
              <div className="detail-value">{candidate.createdAt ? format(new Date(candidate.createdAt), 'MMM d, yyyy') : '—'}</div>
            </div>
          </div>

          <div className="divider" />

          <div>
            <div className="form-label" style={{ marginBottom: 10 }}>Update Stage</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
              {STAGES.map(s => (
                <button
                  key={s}
                  className={`stage-pill ${stage === s ? 'active' : ''}`}
                  onClick={() => setStage(s)}
                  style={{ fontSize: 12, padding: '5px 12px' }}
                >
                  {s}
                </button>
              ))}
            </div>
            <textarea
              className="input"
              placeholder="Add notes about this stage change..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              style={{ minHeight: 70 }}
            />
          </div>

          {timeline.length > 0 && (
            <div>
              <div className="form-label" style={{ marginBottom: 12 }}>Timeline</div>
              <div className="timeline">
                {[...timeline].reverse().map((t, i) => (
                  <div key={i} className="timeline-item">
                    <div className="timeline-dot" />
                    <div className="timeline-content">
                      <div className="timeline-stage">{t.stage}</div>
                      <div className="timeline-date">{format(new Date(t.timestamp), 'MMM d, yyyy · h:mm a')}</div>
                      {t.notes && <div className="timeline-notes">{t.notes}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Close</button>
          <button className="btn btn-primary" onClick={updateStage} disabled={saving}>
            {saving ? 'Saving...' : 'Update Candidate'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, total: 0, totalPages: 1 });
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const load = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, pageSize: 20 });
      if (search) params.set('search', search);
      if (stageFilter) params.set('stage', stageFilter);
      const res = await fetch(`/api/candidates?${params}`);
      const data = await res.json();
      setCandidates(data.candidates || []);
      setPagination(data.pagination || { page: 1, total: 0, totalPages: 1 });
    } finally {
      setLoading(false);
    }
  }, [search, stageFilter]);

  useEffect(() => { load(1); }, [load]);

  const handleUpdate = (updated) => {
    setCandidates(prev => prev.map(c => c.id === updated.id ? updated : c));
    setSelected(updated);
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1>Candidates</h1>
          <p>{pagination.total} total applicants</p>
        </div>
      </div>

      <div className="filters-bar">
        <div className="search-wrap" style={{ flex: 1, minWidth: 220 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input className="input" placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="input" style={{ width: 160 }} value={stageFilter} onChange={e => setStageFilter(e.target.value)}>
          <option value="">All Stages</option>
          {STAGES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="loader"><div className="spinner" /></div>
      ) : candidates.length === 0 ? (
        <div className="empty-state">
          <div style={{ fontSize: 48, marginBottom: 16 }}>👥</div>
          <h3>No candidates found</h3>
          <p>Try adjusting your search filters</p>
        </div>
      ) : (
        <>
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Candidate</th>
                    <th>Position</th>
                    <th>Stage</th>
                    <th>Experience</th>
                    <th>Applied</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {candidates.map(c => (
                    <tr key={c.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--accent-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: 'var(--accent)', flexShrink: 0 }}>
                            {c.name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: 14 }}>{c.name}</div>
                            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{c.email}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>{c.job?.title || '—'}</td>
                      <td><span className={`badge badge-${STAGE_BADGE[c.stage]}`}>{c.stage}</span></td>
                      <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>{c.experience ? `${c.experience}y` : '—'}</td>
                      <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>{c.createdAt ? format(new Date(c.createdAt), 'MMM d, yy') : '—'}</td>
                      <td>
                        <button className="btn btn-ghost btn-sm" onClick={() => setSelected(c)}>View →</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="pagination">
            <div className="pagination-info">
              {pagination.total} candidates · Page {pagination.page} of {pagination.totalPages}
            </div>
            <div className="pagination-btns">
              <button className="page-btn" disabled={pagination.page === 1} onClick={() => load(pagination.page - 1)}>‹</button>
              {Array.from({ length: Math.min(pagination.totalPages, 7) }, (_, i) => {
                const p = i + 1;
                return <button key={p} className={`page-btn ${p === pagination.page ? 'active' : ''}`} onClick={() => load(p)}>{p}</button>;
              })}
              {pagination.totalPages > 7 && <span style={{ color: 'var(--text-dim)', padding: '0 4px' }}>...</span>}
              <button className="page-btn" disabled={pagination.page === pagination.totalPages} onClick={() => load(pagination.page + 1)}>›</button>
            </div>
          </div>
        </>
      )}

      {selected && <CandidateModal candidate={selected} onClose={() => setSelected(null)} onUpdate={handleUpdate} />}
    </div>
  );
}
