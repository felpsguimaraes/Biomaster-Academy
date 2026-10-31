@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

:root {
  font-family: 'Inter', sans-serif;
  color: #e2e8f0;
  background: #0b1020;
  line-height: 1.5;
  font-weight: 400;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

* {
  box-sizing: border-box;
}

html, body, #root {
  margin: 0;
  min-height: 100%;
  min-width: 100%;
  background: linear-gradient(180deg, #081120 0%, #101b2d 100%);
}

body {
  min-height: 100vh;
}

button,
input,
select {
  font: inherit;
}

button {
  cursor: pointer;
}

.auth-shell {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: radial-gradient(circle at top, rgba(96, 165, 250, 0.18), transparent 30%);
}

.auth-card {
  width: min(980px, 100%);
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 24px 48px rgba(15, 23, 42, 0.32);
}

.brand-block {
  padding: 48px 40px;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(15, 118, 110, 0.12));
}

.mini-label {
  display: inline-block;
  color: #7dd3fc;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.72rem;
  margin-bottom: 12px;
}

.brand-block h1 {
  margin: 0 0 14px;
  font-size: clamp(2.3rem, 6vw, 4rem);
}

.brand-block p {
  margin: 0;
  max-width: 420px;
  color: #cbd5e1;
  font-size: 1.05rem;
}

.auth-panel {
  padding: 36px 32px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  background: rgba(15, 23, 42, 0.9);
}

.language-row,
.header-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.language-label,
.language-inline span {
  color: #cbd5e1;
  font-size: 0.82rem;
}

.language-select,
.language-inline select {
  border: 1px solid rgba(148, 163, 184, 0.2);
  background: rgba(15, 23, 42, 0.8);
  color: white;
  border-radius: 10px;
  padding: 8px 10px;
}

.switcher {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  background: rgba(30, 41, 59, 0.8);
  border-radius: 12px;
  overflow: hidden;
}

.switcher button {
  border: none;
  background: transparent;
  color: #cbd5e1;
  padding: 12px 10px;
  font-weight: 700;
}

.switcher button.active {
  background: #2563eb;
  color: white;
}

.auth-panel label {
  display: flex;
  flex-direction: column;
  gap: 8px;
  color: #e2e8f0;
  font-weight: 600;
}

.auth-panel input,
.auth-panel select {
  border: 1px solid rgba(148, 163, 184, 0.2);
  background: rgba(15, 23, 42, 0.8);
  color: white;
  border-radius: 12px;
  padding: 12px 14px;
}

.primary-button,
.logout-button {
  border: none;
  border-radius: 12px;
  padding: 12px 18px;
  font-weight: 700;
}

.primary-button {
  background: linear-gradient(135deg, #38bdf8, #2563eb);
  color: white;
}

.error {
  margin: 0;
  color: #fca5a5;
  font-size: 0.9rem;
}

.app-shell {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 260px;
  background: rgba(15, 23, 42, 0.9);
  border-right: 1px solid rgba(148, 163, 184, 0.2);
  padding: 28px 18px;
  display: flex;
  flex-direction: column;
}

.brand {
  font-size: 1.5rem;
  font-weight: 800;
  color: #7dd3fc;
  margin-bottom: 28px;
}

.sidebar nav {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.sidebar a {
  padding: 10px 12px;
  border-radius: 10px;
  color: #cbd5e1;
  text-decoration: none;
}

.sidebar a.active {
  background: rgba(59, 130, 246, 0.1);
  color: white;
}

.logout-button {
  margin-top: auto;
  background: rgba(239, 68, 68, 0.12);
  color: #fca5a5;
}

.main-content {
  flex: 1;
  padding: 36px;
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 28px;
}

.eyebrow {
  margin: 0;
  color: #7dd3fc;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.72rem;
}

.topbar h1 {
  margin: 4px 0 0;
  font-size: clamp(2rem, 4vw, 2.8rem);
}

.language-inline {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #cbd5e1;
  font-size: 0.8rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(160px, 1fr));
  gap: 18px;
  margin-bottom: 28px;
}

.stat-card,
.panel {
  background: rgba(15, 23, 42, 0.7);
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: 18px;
  padding: 20px;
}

.stat-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.stat-card span {
  color: #94a3b8;
  font-size: 0.82rem;
}

.stat-card strong {
  font-size: 1.8rem;
}

.content-grid {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 22px;
  margin-bottom: 22px;
}

.panel h2 {
  margin-top: 0;
  margin-bottom: 16px;
}

.subject-list,
.task-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.subject-list li,
.task-list li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 12px;
  background: rgba(30, 41, 59, 0.7);
}

.subject-meta {
  display: flex;
  align-items: center;
  gap: 12px;
}

.subject-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  display: inline-block;
}

.subject-meta small,
.task-list small {
  display: block;
  color: #94a3b8;
}

.subject-progress {
  color: #7dd3fc;
  font-weight: 700;
}

.task-list .pending,
.task-list .done {
  padding: 5px 10px;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 700;
}

.task-list .pending {
  background: rgba(245, 158, 11, 0.12);
  color: #fbbf24;
}

.task-list .done {
  background: rgba(16, 185, 129, 0.12);
  color: #6ee7b7;
}

.bottom-panel {
  margin-top: 12px;
}

.assessment-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(180px, 1fr));
  gap: 14px;
}

.assessment-card {
  background: rgba(30, 41, 59, 0.7);
  border-radius: 14px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.assessment-card span {
  color: #cbd5e1;
}

.assessment-card strong {
  font-size: 1.8rem;
}

.assessment-card small {
  color: #94a3b8;
}

@media (max-width: 900px) {
  .auth-card {
    grid-template-columns: 1fr;
  }

  .app-shell {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid rgba(148, 163, 184, 0.2);
  }

  .topbar,
  .header-actions,
  .language-row {
    flex-direction: column;
    align-items: flex-start;
  }

  .content-grid,
  .stats-grid,
  .assessment-grid {
    grid-template-columns: 1fr;
  }
}
