@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

:root {
  --bg: #0a0a0f;
  --bg-2: #111118;
  --bg-3: #18181f;
  --bg-card: #1a1a24;
  --border: #2a2a38;
  --border-light: #333344;
  --text: #f0f0f8;
  --text-muted: #8888aa;
  --text-dim: #55556a;
  --accent: #7c5cfc;
  --accent-hover: #9070ff;
  --accent-dim: rgba(124, 92, 252, 0.15);
  --accent-glow: rgba(124, 92, 252, 0.3);
  --green: #22d3a0;
  --green-dim: rgba(34, 211, 160, 0.12);
  --amber: #f59e0b;
  --amber-dim: rgba(245, 158, 11, 0.12);
  --red: #ef4444;
  --red-dim: rgba(239, 68, 68, 0.12);
  --blue: #3b82f6;
  --blue-dim: rgba(59, 130, 246, 0.12);
  --radius: 12px;
  --radius-sm: 8px;
  --radius-lg: 16px;
  --shadow: 0 4px 24px rgba(0,0,0,0.4);
  --shadow-lg: 0 8px 48px rgba(0,0,0,0.6);
  --font-display: 'Syne', sans-serif;
  --font-body: 'DM Sans', sans-serif;
  --sidebar-width: 240px;
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { font-size: 16px; -webkit-font-smoothing: antialiased; }
body { font-family: var(--font-body); background: var(--bg); color: var(--text); line-height: 1.6; overflow-x: hidden; }

::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: var(--bg-2); }
::-webkit-scrollbar-thumb { background: var(--border-light); border-radius: 3px; }

h1, h2, h3, h4, h5 { font-family: var(--font-display); font-weight: 700; letter-spacing: -0.02em; }

.app-layout { display: flex; min-height: 100vh; }
.main-content { flex: 1; margin-left: var(--sidebar-width); min-height: 100vh; display: flex; flex-direction: column; }
.page-content { flex: 1; padding: 32px; max-width: 1400px; width: 100%; margin: 0 auto; }

.sidebar { width: var(--sidebar-width); background: var(--bg-2); border-right: 1px solid var(--border); position: fixed; top: 0; left: 0; height: 100vh; display: flex; flex-direction: column; z-index: 100; overflow-y: auto; }
.sidebar-logo { padding: 24px 20px; border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: 12px; }
.sidebar-logo-icon { width: 36px; height: 36px; background: var(--accent); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 18px; box-shadow: 0 0 20px var(--accent-glow); }
.sidebar-logo-text { font-family: var(--font-display); font-weight: 800; font-size: 18px; color: var(--text); }
.sidebar-logo-text span { color: var(--accent); }
.sidebar-nav { padding: 16px 12px; flex: 1; display: flex; flex-direction: column; gap: 4px; }
.nav-section-label { font-size: 10px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: var(--text-dim); padding: 8px 8px 4px; margin-top: 8px; }
.nav-item { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: var(--radius-sm); color: var(--text-muted); text-decoration: none; font-size: 14px; font-weight: 500; transition: all 0.15s ease; cursor: pointer; border: none; background: none; width: 100%; text-align: left; }
.nav-item:hover { background: var(--bg-3); color: var(--text); }
.nav-item.active { background: var(--accent-dim); color: var(--accent); }
.nav-item svg { flex-shrink: 0; }
.sidebar-footer { padding: 16px 12px; border-top: 1px solid var(--border); }
.user-card { display: flex; align-items: center; gap: 10px; padding: 10px; border-radius: var(--radius-sm); background: var(--bg-3); }
.user-avatar { width: 32px; height: 32px; border-radius: 50%; background: var(--accent); display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; color: white; flex-shrink: 0; }
.user-name { font-size: 13px; font-weight: 600; color: var(--text); }
.user-role { font-size: 11px; color: var(--text-muted); text-transform: capitalize; }

.topbar { height: 64px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; padding: 0 32px; background: var(--bg); position: sticky; top: 0; z-index: 50; }
.topbar-title { font-family: var(--font-display); font-size: 20px; font-weight: 700; }
.topbar-actions { display: flex; align-items: center; gap: 12px; }

.card { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius); padding: 20px; }
.stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 28px; }
.stat-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius); padding: 20px; display: flex; align-items: center; gap: 16px; transition: all 0.2s; }
.stat-card:hover { border-color: var(--accent); transform: translateY(-2px); box-shadow: 0 8px 32px rgba(124, 92, 252, 0.1); }
.stat-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.stat-value { font-family: var(--font-display); font-size: 28px; font-weight: 800; line-height: 1; }
.stat-label { font-size: 13px; color: var(--text-muted); margin-top: 2px; }

.btn { display: inline-flex; align-items: center; gap: 8px; padding: 9px 16px; border-radius: var(--radius-sm); font-size: 14px; font-weight: 500; font-family: var(--font-body); cursor: pointer; transition: all 0.15s ease; border: none; text-decoration: none; white-space: nowrap; }
.btn-primary { background: var(--accent); color: white; box-shadow: 0 0 20px var(--accent-glow); }
.btn-primary:hover { background: var(--accent-hover); transform: translateY(-1px); }
.btn-secondary { background: var(--bg-3); color: var(--text); border: 1px solid var(--border); }
.btn-secondary:hover { background: var(--bg-card); border-color: var(--border-light); }
.btn-ghost { background: transparent; color: var(--text-muted); }
.btn-ghost:hover { background: var(--bg-3); color: var(--text); }
.btn-danger { background: var(--red-dim); color: var(--red); border: 1px solid rgba(239,68,68,0.2); }
.btn-danger:hover { background: rgba(239,68,68,0.2); }
.btn-sm { padding: 6px 12px; font-size: 13px; }
.btn-lg { padding: 12px 24px; font-size: 15px; }

.input { width: 100%; background: var(--bg-3); border: 1px solid var(--border); border-radius: var(--radius-sm); color: var(--text); font-family: var(--font-body); font-size: 14px; padding: 10px 14px; outline: none; transition: border-color 0.15s; }
.input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-dim); }
.input::placeholder { color: var(--text-dim); }
textarea.input { resize: vertical; min-height: 100px; }
select.input { appearance: none; cursor: pointer; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%238888aa' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 12px center; padding-right: 36px; }
.form-group { display: flex; flex-direction: column; gap: 6px; }
.form-label { font-size: 13px; font-weight: 500; color: var(--text-muted); }

.badge { display: inline-flex; align-items: center; gap: 4px; padding: 3px 10px; border-radius: 100px; font-size: 12px; font-weight: 500; }
.badge-green { background: var(--green-dim); color: var(--green); }
.badge-amber { background: var(--amber-dim); color: var(--amber); }
.badge-red { background: var(--red-dim); color: var(--red); }
.badge-blue { background: var(--blue-dim); color: var(--blue); }
.badge-purple { background: var(--accent-dim); color: var(--accent); }
.badge-gray { background: rgba(136,136,170,0.1); color: var(--text-muted); }

.table-wrap { overflow-x: auto; }
table { width: 100%; border-collapse: collapse; font-size: 14px; }
thead th { text-align: left; padding: 10px 16px; font-size: 11px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: var(--text-dim); border-bottom: 1px solid var(--border); background: var(--bg-2); }
tbody tr { border-bottom: 1px solid var(--border); transition: background 0.12s; }
tbody tr:hover { background: var(--bg-3); }
tbody tr:last-child { border-bottom: none; }
tbody td { padding: 12px 16px; color: var(--text); vertical-align: middle; }

.search-wrap { position: relative; display: flex; align-items: center; }
.search-wrap svg { position: absolute; left: 12px; color: var(--text-dim); pointer-events: none; }
.search-wrap .input { padding-left: 38px; }

.page-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 28px; gap: 16px; flex-wrap: wrap; }
.page-header h1 { font-size: 28px; color: var(--text); }
.page-header p { font-size: 14px; color: var(--text-muted); margin-top: 4px; }

.filters-bar { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; flex-wrap: wrap; }
.filters-bar .search-wrap { flex: 1; min-width: 220px; }

.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px; animation: fadeIn 0.15s ease; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
.modal { background: var(--bg-card); border: 1px solid var(--border-light); border-radius: var(--radius-lg); width: 100%; max-width: 560px; max-height: 90vh; overflow-y: auto; box-shadow: var(--shadow-lg); animation: slideUp 0.2s ease; }
@keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
.modal-header { display: flex; align-items: center; justify-content: space-between; padding: 20px 24px; border-bottom: 1px solid var(--border); }
.modal-header h2 { font-size: 18px; }
.modal-body { padding: 24px; display: flex; flex-direction: column; gap: 16px; }
.modal-footer { padding: 16px 24px; border-top: 1px solid var(--border); display: flex; justify-content: flex-end; gap: 10px; }

.login-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: var(--bg); position: relative; overflow: hidden; }
.login-bg-glow { position: absolute; width: 600px; height: 600px; background: radial-gradient(circle, rgba(124,92,252,0.15) 0%, transparent 70%); top: 50%; left: 50%; transform: translate(-50%, -50%); pointer-events: none; }
.login-card { background: var(--bg-card); border: 1px solid var(--border-light); border-radius: var(--radius-lg); padding: 40px; width: 100%; max-width: 420px; box-shadow: var(--shadow-lg); position: relative; z-index: 1; }
.login-logo { display: flex; align-items: center; gap: 12px; margin-bottom: 32px; }
.login-logo-icon { width: 44px; height: 44px; background: var(--accent); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 22px; box-shadow: 0 0 30px var(--accent-glow); }
.login-logo-text { font-family: var(--font-display); font-size: 22px; font-weight: 800; }
.login-logo-text span { color: var(--accent); }
.login-title { font-size: 24px; margin-bottom: 4px; }
.login-subtitle { font-size: 14px; color: var(--text-muted); margin-bottom: 28px; }
.login-hint { margin-top: 20px; padding: 14px; background: var(--bg-3); border-radius: var(--radius-sm); border: 1px solid var(--border); }
.login-hint p { font-size: 12px; color: var(--text-muted); margin-bottom: 6px; }
.login-hint code { font-size: 11px; color: var(--text-dim); display: block; line-height: 1.8; }

.pipeline-stages { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 4px; }
.stage-pill { display: flex; align-items: center; gap: 6px; padding: 6px 14px; border-radius: 100px; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.15s; border: 1px solid var(--border); background: var(--bg-3); color: var(--text-muted); white-space: nowrap; }
.stage-pill:hover { border-color: var(--border-light); color: var(--text); }
.stage-pill.active { border-color: var(--accent); background: var(--accent-dim); color: var(--accent); }
.stage-count { font-size: 11px; background: rgba(255,255,255,0.1); padding: 1px 6px; border-radius: 100px; font-weight: 600; }

.job-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius); padding: 20px; transition: all 0.2s; display: flex; flex-direction: column; gap: 12px; }
.job-card:hover { border-color: var(--accent); transform: translateY(-2px); box-shadow: 0 8px 32px rgba(124, 92, 252, 0.1); }
.job-card-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; }
.job-card-title { font-size: 16px; font-weight: 600; color: var(--text); font-family: var(--font-display); }
.job-card-meta { font-size: 13px; color: var(--text-muted); display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.job-card-tags { display: flex; flex-wrap: wrap; gap: 6px; }
.tag { padding: 2px 8px; background: var(--bg-3); border: 1px solid var(--border); border-radius: 4px; font-size: 11px; color: var(--text-muted); }
.jobs-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 16px; }

.kanban-board { display: flex; gap: 16px; overflow-x: auto; padding-bottom: 16px; min-height: 600px; }
.kanban-col { min-width: 260px; max-width: 280px; flex-shrink: 0; display: flex; flex-direction: column; }
.kanban-col-header { display: flex; align-items: center; justify-content: space-between; padding: 12px 4px; margin-bottom: 8px; }
.kanban-col-title { font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; color: var(--text-muted); }
.kanban-col-count { font-size: 12px; background: var(--bg-3); border: 1px solid var(--border); padding: 2px 8px; border-radius: 100px; color: var(--text-dim); font-weight: 600; }
.kanban-cards { display: flex; flex-direction: column; gap: 8px; flex: 1; }
.kanban-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 14px; cursor: pointer; transition: all 0.15s; }
.kanban-card:hover { border-color: var(--accent); box-shadow: 0 4px 16px rgba(124,92,252,0.1); }
.kanban-card-name { font-size: 14px; font-weight: 600; color: var(--text); margin-bottom: 4px; }
.kanban-card-email { font-size: 12px; color: var(--text-muted); margin-bottom: 8px; }
.kanban-card-job { font-size: 11px; color: var(--text-dim); }

.pagination { display: flex; align-items: center; justify-content: space-between; padding: 16px 0; border-top: 1px solid var(--border); margin-top: 4px; gap: 12px; flex-wrap: wrap; }
.pagination-info { font-size: 13px; color: var(--text-muted); }
.pagination-btns { display: flex; align-items: center; gap: 6px; }
.page-btn { width: 32px; height: 32px; border-radius: var(--radius-sm); border: 1px solid var(--border); background: var(--bg-3); color: var(--text-muted); font-size: 13px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.12s; font-family: var(--font-body); }
.page-btn:hover:not(:disabled) { border-color: var(--accent); color: var(--accent); }
.page-btn.active { background: var(--accent); border-color: var(--accent); color: white; }
.page-btn:disabled { opacity: 0.4; cursor: not-allowed; }

.chart-bar-wrap { display: flex; flex-direction: column; gap: 10px; }
.chart-bar-row { display: flex; align-items: center; gap: 12px; }
.chart-bar-label { font-size: 12px; color: var(--text-muted); width: 80px; flex-shrink: 0; text-align: right; }
.chart-bar-track { flex: 1; background: var(--bg-3); border-radius: 100px; height: 8px; overflow: hidden; }
.chart-bar-fill { height: 100%; border-radius: 100px; transition: width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1); }
.chart-bar-value { font-size: 12px; color: var(--text-dim); width: 32px; text-align: right; font-weight: 600; }

.timeline { display: flex; flex-direction: column; gap: 0; }
.timeline-item { display: flex; gap: 14px; padding-bottom: 20px; position: relative; }
.timeline-item:last-child { padding-bottom: 0; }
.timeline-dot { width: 10px; height: 10px; border-radius: 50%; background: var(--accent); flex-shrink: 0; margin-top: 6px; box-shadow: 0 0 8px var(--accent-glow); }
.timeline-item::before { content: ''; position: absolute; left: 4px; top: 16px; bottom: 0; width: 2px; background: var(--border); }
.timeline-item:last-child::before { display: none; }
.timeline-content { flex: 1; }
.timeline-stage { font-size: 13px; font-weight: 600; text-transform: capitalize; color: var(--text); }
.timeline-date { font-size: 11px; color: var(--text-dim); margin-top: 2px; }
.timeline-notes { font-size: 12px; color: var(--text-muted); margin-top: 4px; }

.detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.detail-item { display: flex; flex-direction: column; gap: 4px; }
.detail-label { font-size: 11px; color: var(--text-dim); text-transform: uppercase; letter-spacing: 0.06em; font-weight: 600; }
.detail-value { font-size: 14px; color: var(--text); }

.empty-state { text-align: center; padding: 60px 20px; color: var(--text-muted); }
.empty-state svg { opacity: 0.3; margin-bottom: 16px; }
.empty-state h3 { font-size: 18px; color: var(--text); margin-bottom: 8px; }
.empty-state p { font-size: 14px; max-width: 300px; margin: 0 auto; }

.loader { display: flex; align-items: center; justify-content: center; padding: 60px; }
.spinner { width: 32px; height: 32px; border: 3px solid var(--border); border-top-color: var(--accent); border-radius: 50%; animation: spin 0.7s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

.divider { height: 1px; background: var(--border); margin: 8px 0; }
.text-muted { color: var(--text-muted); }
.text-sm { font-size: 13px; }
.flex { display: flex; }
.flex-col { flex-direction: column; }
.items-center { align-items: center; }
.justify-between { justify-content: space-between; }
.gap-2 { gap: 8px; }
.gap-3 { gap: 12px; }
.gap-4 { gap: 16px; }
.mb-4 { margin-bottom: 16px; }
.mb-6 { margin-bottom: 24px; }
.w-full { width: 100%; }
.grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

@media (max-width: 768px) {
  .sidebar { transform: translateX(-100%); }
  .main-content { margin-left: 0; }
  .page-content { padding: 16px; }
  .jobs-grid { grid-template-columns: 1fr; }
  .stats-grid { grid-template-columns: 1fr 1fr; }
  .detail-grid { grid-template-columns: 1fr; }
}
