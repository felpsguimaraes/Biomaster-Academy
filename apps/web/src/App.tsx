import { useEffect, useMemo, useState } from 'react';
import { apiFetch } from './api';
import type { DashboardSummary, UserRole } from './types';

const initialForm = {
  name: '',
  email: '',
  password: '',
  role: 'student' as UserRole
};

export default function App() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [form, setForm] = useState(initialForm);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('biomaster-token'));
  const [dashboard, setDashboard] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) {
      setDashboard(null);
      return;
    }

    const loadDashboard = async () => {
      try {
        setLoading(true);
        const data = await apiFetch<DashboardSummary>('/api/dashboard', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setDashboard(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar dashboard.');
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [token]);

  const greeting = useMemo(() => {
    if (!dashboard) return 'Carregando...';
    return dashboard.user.name;
  }, [dashboard]);

  async function handleSubmit() {
    setError('');
    setLoading(true);

    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const payload =
        mode === 'login'
          ? { email: form.email, password: form.password }
          : form;

      const response = await apiFetch<{ token: string; user: { name: string; role: UserRole } }>(endpoint, {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      localStorage.setItem('biomaster-token', response.token);
      setToken(response.token);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível concluir a operação.');
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem('biomaster-token');
    setToken(null);
    setDashboard(null);
    setForm(initialForm);
  }

  if (!token || !dashboard) {
    return (
      <div className="auth-shell">
        <div className="auth-card">
          <div className="brand-block">
            <span className="mini-label">Plataforma academica</span>
            <h1>Biomaster Academy</h1>
            <p>Organize estudos, materiais, provas e desempenho em um só lugar.</p>
          </div>

          <div className="auth-panel">
            <div className="switcher">
              <button className={mode === 'login' ? 'active' : ''} onClick={() => setMode('login')}>
                Entrar
              </button>
              <button className={mode === 'register' ? 'active' : ''} onClick={() => setMode('register')}>
                Cadastrar
              </button>
            </div>

            {mode === 'register' && (
              <label>
                Nome
                <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
              </label>
            )}

            <label>
              E-mail
              <input value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
            </label>

            <label>
              Senha
              <input type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
            </label>

            {mode === 'register' && (
              <label>
                Perfil
                <select value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value as UserRole })}>
                  <option value="student">Aluno</option>
                  <option value="teacher">Professor</option>
                  <option value="admin">Admin</option>
                </select>
              </label>
            )}

            {error && <p className="error">{error}</p>}

            <button className="primary-button" onClick={handleSubmit} disabled={loading}>
              {loading ? 'Carregando...' : mode === 'login' ? 'Entrar' : 'Criar conta'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">Biomaster</div>
        <nav>
          <a className="active">Dashboard</a>
          <a>Disciplinas</a>
          <a>Materiais</a>
          <a>Agenda</a>
          <a>Quizzes</a>
          <a>Relatórios</a>
        </nav>
        <button className="logout-button" onClick={handleLogout}>Sair</button>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="eyebrow">Bem-vindo(a),</p>
            <h1>{greeting}</h1>
          </div>
          <button className="primary-button">Nova tarefa</button>
        </header>

        <section className="stats-grid">
          {dashboard.stats.map((item) => (
            <article key={item.label} className="stat-card">
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </article>
          ))}
        </section>

        <section className="content-grid">
          <div className="panel">
            <h2>Minhas disciplinas</h2>
            <ul className="subject-list">
              {dashboard.subjects.map((subject) => (
                <li key={subject.id}>
                  <div className="subject-meta">
                    <span className="subject-dot" style={{ background: subject.color }} />
                    <div>
                      <strong>{subject.name}</strong>
                      <small>{subject.description}</small>
                    </div>
                  </div>
                  <div className="subject-progress">
                    <span>{subject.progress}%</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="panel">
            <h2>Próximas tarefas</h2>
            <ul className="task-list">
              {dashboard.tasks.map((task) => (
                <li key={task.id}>
                  <div>
                    <strong>{task.title}</strong>
                    <small>{task.due}</small>
                  </div>
                  <span className={task.status === 'done' ? 'done' : 'pending'}>{task.status === 'done' ? 'Concluída' : 'Pendente'}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="panel bottom-panel">
          <h2>Desempenho recente</h2>
          <div className="assessment-grid">
            {dashboard.recentAssessments.map((assessment) => (
              <div key={assessment.title} className="assessment-card">
                <span>{assessment.title}</span>
                <strong>{assessment.score}</strong>
                <small>{assessment.date}</small>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
