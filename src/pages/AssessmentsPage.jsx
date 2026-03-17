import { useState, useEffect, useCallback } from 'react';

const QUESTION_TYPES = ['single-choice', 'multi-choice', 'short-text', 'long-text', 'numeric'];

function AssessmentBuilder({ jobId, jobTitle, existing, onSave, onClose }) {
  const [title, setTitle] = useState(existing?.title || `Assessment - ${jobTitle}`);
  const [sections, setSections] = useState(existing?.sections || []);
  const [saving, setSaving] = useState(false);

  const addSection = () => {
    setSections(prev => [...prev, {
      id: `sec_${Date.now()}`,
      title: 'New Section',
      questions: []
    }]);
  };

  const addQuestion = (sectionId) => {
    setSections(prev => prev.map(s => s.id === sectionId ? {
      ...s,
      questions: [...s.questions, {
        id: `q_${Date.now()}`,
        type: 'short-text',
        question: '',
        required: true,
        options: []
      }]
    } : s));
  };

  const updateSection = (sectionId, key, val) => {
    setSections(prev => prev.map(s => s.id === sectionId ? { ...s, [key]: val } : s));
  };

  const updateQuestion = (sectionId, qId, key, val) => {
    setSections(prev => prev.map(s => s.id === sectionId ? {
      ...s,
      questions: s.questions.map(q => q.id === qId ? { ...q, [key]: val } : q)
    } : s));
  };

  const removeQuestion = (sectionId, qId) => {
    setSections(prev => prev.map(s => s.id === sectionId ? {
      ...s, questions: s.questions.filter(q => q.id !== qId)
    } : s));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/assessments/${jobId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, sections, isActive: true }),
      });
      const data = await res.json();
      onSave(data);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 700, maxHeight: '92vh' }}>
        <div className="modal-header">
          <h2>Assessment Builder</h2>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body" style={{ gap: 20 }}>
          <div className="form-group">
            <label className="form-label">Assessment Title</label>
            <input className="input" value={title} onChange={e => setTitle(e.target.value)} />
          </div>

          {sections.map((section, si) => (
            <div key={section.id} className="card" style={{ background: 'var(--bg-3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <input
                  className="input"
                  value={section.title}
                  onChange={e => updateSection(section.id, 'title', e.target.value)}
                  style={{ fontWeight: 600 }}
                />
                <button className="btn btn-danger btn-sm" onClick={() => setSections(prev => prev.filter(s => s.id !== section.id))}>Remove</button>
              </div>

              {section.questions.map((q, qi) => (
                <div key={q.id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: 14, marginBottom: 10 }}>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                    <input
                      className="input"
                      placeholder="Question text..."
                      value={q.question}
                      onChange={e => updateQuestion(section.id, q.id, 'question', e.target.value)}
                      style={{ flex: 1 }}
                    />
                    <select
                      className="input"
                      value={q.type}
                      onChange={e => updateQuestion(section.id, q.id, 'type', e.target.value)}
                      style={{ width: 150 }}
                    >
                      {QUESTION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <button className="btn btn-danger btn-sm" onClick={() => removeQuestion(section.id, q.id)}>✕</button>
                  </div>
                  {(q.type === 'single-choice' || q.type === 'multi-choice') && (
                    <div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>Options (one per line):</div>
                      <textarea
                        className="input"
                        style={{ minHeight: 70, fontSize: 12 }}
                        value={(q.options || []).join('\n')}
                        onChange={e => updateQuestion(section.id, q.id, 'options', e.target.value.split('\n').filter(Boolean))}
                        placeholder="Option 1&#10;Option 2&#10;Option 3"
                      />
                    </div>
                  )}
                </div>
              ))}

              <button className="btn btn-secondary btn-sm" onClick={() => addQuestion(section.id)}>
                + Add Question
              </button>
            </div>
          ))}

          <button className="btn btn-secondary w-full" onClick={addSection} style={{ justifyContent: 'center' }}>
            + Add Section
          </button>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Assessment'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AssessmentsPage() {
  const [jobs, setJobs] = useState([]);
  const [assessments, setAssessments] = useState({});
  const [loading, setLoading] = useState(true);
  const [builderJob, setBuilderJob] = useState(null);

  useEffect(() => {
    const load = async () => {
      const res = await fetch('/api/jobs?pageSize=50&status=active');
      const data = await res.json();
      const activeJobs = data.jobs || [];
      setJobs(activeJobs);

      const assessmentMap = {};
      await Promise.all(
        activeJobs.slice(0, 10).map(async job => {
          try {
            const r = await fetch(`/api/assessments/${job.id}`);
            const a = await r.json();
            if (a) assessmentMap[job.id] = a;
          } catch {}
        })
      );
      setAssessments(assessmentMap);
      setLoading(false);
    };
    load();
  }, []);

  const handleSave = (saved) => {
    setAssessments(prev => ({ ...prev, [builderJob.id]: saved }));
    setBuilderJob(null);
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1>Assessments</h1>
          <p>Build and manage job assessments</p>
        </div>
      </div>

      {loading ? (
        <div className="loader"><div className="spinner" /></div>
      ) : (
        <div className="jobs-grid">
          {jobs.map(job => {
            const assessment = assessments[job.id];
            return (
              <div key={job.id} className="job-card">
                <div className="job-card-header">
                  <div className="job-card-title">{job.title}</div>
                  {assessment
                    ? <span className="badge badge-green">Active</span>
                    : <span className="badge badge-gray">No Assessment</span>
                  }
                </div>
                {assessment && (
                  <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                    {assessment.sections?.length || 0} sections ·{' '}
                    {assessment.sections?.reduce((t, s) => t + (s.questions?.length || 0), 0)} questions
                  </div>
                )}
                {assessment && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {assessment.sections?.map(s => (
                      <div key={s.id} style={{ fontSize: 12, color: 'var(--text-dim)', padding: '4px 8px', background: 'var(--bg-3)', borderRadius: 4 }}>
                        {s.title} ({s.questions?.length || 0} questions)
                      </div>
                    ))}
                  </div>
                )}
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => setBuilderJob(job)}
                >
                  {assessment ? 'Edit Assessment' : 'Create Assessment'}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {builderJob && (
        <AssessmentBuilder
          jobId={builderJob.id}
          jobTitle={builderJob.title}
          existing={assessments[builderJob.id]}
          onSave={handleSave}
          onClose={() => setBuilderJob(null)}
        />
      )}
    </div>
  );
}
