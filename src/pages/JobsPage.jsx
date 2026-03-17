import { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';

function JobModal({ job, onClose, onSave }) {
  const [form, setForm] = useState({
    title: job?.title || '',
    slug: job?.slug || '',
    description: job?.description || '',
    status: job?.status || 'active',
    tags: job?.tags?.join(', ') || '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const set = (k, v) => {
    setForm(f => {
      const next = { ...f, [k]: v };
      if (k === 'title' && !job) {
        next.slug = v.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      }
      return next;
    });
  };

  const handleSave = async () => {
    if (!form.title.trim()) return setError('Title is required');
    setSaving(true);
    setError('');
    try {
      const payload = {
        ...form,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      };
      const url = job ? `/api/jobs/${job.id}` : '/api/jobs';
      const method = job ? 'PATCH' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      onSave(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2>{job ? 'Edit Job' : 'Create Job'}</h2>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          {error && <div style={{ padding: '10px 14px', background: 'var(--red-dim)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 'var(--radius-sm)', fontSize: 13, color: 'var(--red)' }}>{error}</div>}
          <div className="form-group">
            <label className="form-label">Job Title *</label>
            <input className="input" value={form.title} onChange={e => set('title', e.target.value)} placeholder="Senior React Developer" />
          </div>
          <div className="form-group">
            <label className="form-label">Slug</label>
            <input className="input" value={form.slug} onChange={e => set('slug', e.target.value)} placeholder="senior-react-developer" />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="input" value={form.description} onChange={e => set('description', e.target.value)} placeholder="Job description..." />
          </div>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Status</label>
              <select className="input" value={form.status} onChange={e => set('status', e.target.value)}>
                <option value="active">Active</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Tags (comma-separated)</label>
              <input className="input" value={form.tags} onChange={e => set('tags', e.target.value)} placeholder="React, TypeScript, Node.js" />
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : job ? 'Save Changes' : 'Create Job'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, total: 0, totalPages: 1 });
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editJob, setEditJob] = useState(null);

  const load = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, pageSize: 12 });
      if (search) params.set('search', search);
      if (statusFilter) params.set('status', statusFilter);
      const res = await fetch(`/api/jobs?${params}`);
      const data = await res.json();
      setJobs(data.jobs || []);
      setPagination(data.pagination || { page: 1, total: 0, totalPages: 1 });
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => { load(1); }, [load]);

  const openCreate = () => { setEditJob(null); setShowModal(true); };
  const openEdit = (job) => { setEditJob(job); setShowModal(true); };

  const handleSave = (savedJob) => {
    setShowModal(false);
    load(pagination.page);
  };

  const toggleStatus = async (job) => {
    const newStatus = job.status === 'active' ? 'archived' : 'active';
    await fetch(`/api/jobs/${job.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    load(pagination.page);
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1>Jobs</h1>
          <p>{pagination.total} total positions</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>
          + New Job
        </button>
      </div>

      <div className="filters-bar">
        <div className="search-wrap" style={{ flex: 1, minWidth: 220 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input className="input" placeholder="Search jobs..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="input" style={{ width: 140 }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {loading ? (
        <div className="loader"><div className="spinner" /></div>
      ) : jobs.length === 0 ? (
        <div className="empty-state">
          <div style={{ fontSize: 48, marginBottom: 16 }}>💼</div>
          <h3>No jobs found</h3>
          <p>Create your first job posting to get started</p>
        </div>
      ) : (
        <>
          <div className="jobs-grid">
            {jobs.map(job => (
              <div key={job.id} className="job-card">
                <div className="job-card-header">
                  <div className="job-card-title">{job.title}</div>
                  <span className={`badge ${job.status === 'active' ? 'badge-green' : 'badge-gray'}`}>
                    {job.status}
                  </span>
                </div>
                <div className="job-card-meta">
                  <span>/{job.slug}</span>
                  {job.createdAt && <span>{format(new Date(job.createdAt), 'MMM d, yyyy')}</span>}
                </div>
                {job.description && (
                  <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                    {job.description}
                  </p>
                )}
                <div className="job-card-tags">
                  {(job.tags || []).map(tag => <span key={tag} className="tag">{tag}</span>)}
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                  <button className="btn btn-secondary btn-sm" onClick={() => openEdit(job)}>Edit</button>
                  <button className="btn btn-ghost btn-sm" onClick={() => toggleStatus(job)}>
                    {job.status === 'active' ? 'Archive' : 'Activate'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="pagination">
            <div className="pagination-info">
              Showing {((pagination.page - 1) * 12) + 1}–{Math.min(pagination.page * 12, pagination.total)} of {pagination.total}
            </div>
            <div className="pagination-btns">
              <button className="page-btn" disabled={pagination.page === 1} onClick={() => load(pagination.page - 1)}>‹</button>
              {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => {
                const p = i + 1;
                return <button key={p} className={`page-btn ${p === pagination.page ? 'active' : ''}`} onClick={() => load(p)}>{p}</button>;
              })}
              <button className="page-btn" disabled={pagination.page === pagination.totalPages} onClick={() => load(pagination.page + 1)}>›</button>
            </div>
          </div>
        </>
      )}

      {showModal && <JobModal job={editJob} onClose={() => setShowModal(false)} onSave={handleSave} />}
    </div>
  );
}
