import { useEffect, useMemo, useState } from 'react';
import { apiFetch } from './api';
import type { DashboardSummary, UserRole } from './types';

type Language = 'pt' | 'en' | 'es';
type ViewKey = 'dashboard' | 'subjects' | 'materials' | 'agenda' | 'quizzes' | 'reports';

const initialForm = {
  name: '',
  email: '',
  password: '',
  role: 'student' as UserRole
};

const materialsCatalog = [
  { id: 'mat-1', title: 'Aula 01 - Vetores', type: 'PDF', duration: '18 min', status: 'Disponível' },
  { id: 'mat-2', title: 'Resumo de Cálculo I', type: 'Resumo', duration: '12 min', status: 'Em revisão' },
  { id: 'mat-3', title: 'Slides de Programação', type: 'PPT', duration: '20 min', status: 'Disponível' },
  { id: 'mat-4', title: 'Atividade de Física', type: 'Exercício', duration: '15 min', status: 'Corrigir' }
];

const agendaItems = [
  { id: 'ag-1', title: 'Revisão de Álgebra', time: 'Hoje • 18:00', type: 'Estudo' },
  { id: 'ag-2', title: 'Quiz de Física', time: 'Amanhã • 09:30', type: 'Avaliação' },
  { id: 'ag-3', title: 'Entrega de resumo', time: 'Quarta • 14:00', type: 'Entrega' },
  { id: 'ag-4', title: 'Sprint de Programação', time: 'Quinta • 10:00', type: 'Trabalho' }
];

const quizCards = [
  { id: 'q-1', title: 'Prova de Programação', score: '92%', date: '12/10', questions: 15 },
  { id: 'q-2', title: 'Atividade de Álgebra', score: '88%', date: '08/10', questions: 10 },
  { id: 'q-3', title: 'Quiz de Cálculo', score: '76%', date: '05/10', questions: 12 }
];

const reportBars = [
  { label: 'Matemática', value: 84 },
  { label: 'Física', value: 72 },
  { label: 'Programação', value: 91 },
  { label: 'História', value: 68 }
];

const translations = {
  pt: {
    auth: {
      subtitle: 'Plataforma acadêmica',
      title: 'Biomaster Academy',
      description: 'Organize estudos, materiais, provas e desempenho em um só lugar.',
      login: 'Entrar',
      register: 'Cadastrar',
      name: 'Nome',
      email: 'E-mail',
      password: 'Senha',
      role: 'Perfil',
      student: 'Aluno',
      teacher: 'Professor',
      admin: 'Admin',
      account: 'Criar conta',
      loading: 'Carregando...'
    },
    dashboard: {
      welcome: 'Bem-vindo(a),',
      brand: 'Biomaster',
      nav: {
        dashboard: 'Dashboard',
        subjects: 'Disciplinas',
        materials: 'Materiais',
        agenda: 'Agenda',
        quizzes: 'Quizzes',
        reports: 'Relatórios'
      },
      logout: 'Sair',
      newTask: 'Nova tarefa',
      mySubjects: 'Minhas disciplinas',
      nextTasks: 'Próximas tarefas',
      recentPerformance: 'Desempenho recente',
      pending: 'Pendente',
      done: 'Concluída',
      stats: {
        subjects: 'Disciplinas',
        classes: 'Aulas concluídas',
        quiz: 'Quiz recente',
        weekly: 'Meta semanal'
      },
      subjectDetail: 'Visão geral das disciplinas',
      materialsTitle: 'Materiais disponíveis',
      agendaTitle: 'Agenda de estudos',
      quizzesTitle: 'Avaliações recentes',
      reportsTitle: 'Progresso por disciplina',
      learningPlan: 'Plano de aprendizado',
      noItems: 'Nenhum item disponível.'
    },
    language: 'Idioma'
  },
  en: {
    auth: {
      subtitle: 'Academic platform',
      title: 'Biomaster Academy',
      description: 'Organize your studies, materials, assessments and performance in one place.',
      login: 'Login',
      register: 'Register',
      name: 'Name',
      email: 'E-mail',
      password: 'Password',
      role: 'Profile',
      student: 'Student',
      teacher: 'Teacher',
      admin: 'Admin',
      account: 'Create account',
      loading: 'Loading...'
    },
    dashboard: {
      welcome: 'Welcome,',
      brand: 'Biomaster',
      nav: {
        dashboard: 'Dashboard',
        subjects: 'Subjects',
        materials: 'Materials',
        agenda: 'Agenda',
        quizzes: 'Quizzes',
        reports: 'Reports'
      },
      logout: 'Logout',
      newTask: 'New task',
      mySubjects: 'My subjects',
      nextTasks: 'Upcoming tasks',
      recentPerformance: 'Recent performance',
      pending: 'Pending',
      done: 'Completed',
      stats: {
        subjects: 'Subjects',
        classes: 'Classes completed',
        quiz: 'Recent quiz',
        weekly: 'Weekly goal'
      },
      subjectDetail: 'Overview of subjects',
      materialsTitle: 'Available materials',
      agendaTitle: 'Study agenda',
      quizzesTitle: 'Recent assessments',
      reportsTitle: 'Progress by subject',
      learningPlan: 'Learning plan',
      noItems: 'No items available.'
    },
    language: 'Language'
  },
  es: {
    auth: {
      subtitle: 'Plataforma académica',
      title: 'Biomaster Academy',
      description: 'Organiza tus estudios, materiales, evaluaciones y rendimiento en un solo lugar.',
      login: 'Iniciar sesión',
      register: 'Registrarse',
      name: 'Nombre',
      email: 'Correo',
      password: 'Contraseña',
      role: 'Perfil',
      student: 'Estudiante',
      teacher: 'Profesor',
      admin: 'Admin',
      account: 'Crear cuenta',
      loading: 'Cargando...'
    },
    dashboard: {
      welcome: 'Bienvenido(a),',
      brand: 'Biomaster',
      nav: {
        dashboard: 'Panel',
        subjects: 'Asignaturas',
        materials: 'Materiales',
        agenda: 'Agenda',
        quizzes: 'Cuestionarios',
        reports: 'Informes'
      },
      logout: 'Cerrar sesión',
      newTask: 'Nueva tarea',
      mySubjects: 'Mis asignaturas',
      nextTasks: 'Próximas tareas',
      recentPerformance: 'Rendimiento reciente',
      pending: 'Pendiente',
      done: 'Completada',
      stats: {
        subjects: 'Asignaturas',
        classes: 'Clases completadas',
        quiz: 'Cuestionario reciente',
        weekly: 'Meta semanal'
      },
      subjectDetail: 'Resumen de asignaturas',
      materialsTitle: 'Materiales disponibles',
      agendaTitle: 'Agenda de estudio',
      quizzesTitle: 'Evaluaciones recientes',
      reportsTitle: 'Progreso por asignatura',
      learningPlan: 'Plan de aprendizaje',
      noItems: 'No hay elementos disponibles.'
    },
    language: 'Idioma'
  }
} as const;

export default function App() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [form, setForm] = useState(initialForm);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('biomaster-token'));
  const [dashboard, setDashboard] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [language, setLanguage] = useState<Language>(() => {
    const stored = localStorage.getItem('biomaster-language');
    return stored === 'en' || stored === 'es' ? stored : 'pt';
  });
  const [activeView, setActiveView] = useState<ViewKey>('dashboard');

  const t = translations[language];

  useEffect(() => {
    localStorage.setItem('biomaster-language', language);
  }, [language]);

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
    if (!dashboard) return t.auth.loading;
    return dashboard.user.name;
  }, [dashboard, t.auth.loading]);

  const navItems = [
    { key: 'dashboard', label: t.dashboard.nav.dashboard },
    { key: 'subjects', label: t.dashboard.nav.subjects },
    { key: 'materials', label: t.dashboard.nav.materials },
    { key: 'agenda', label: t.dashboard.nav.agenda },
    { key: 'quizzes', label: t.dashboard.nav.quizzes },
    { key: 'reports', label: t.dashboard.nav.reports }
  ] as const;

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
    setActiveView('dashboard');
  }

  const localizedStats = dashboard?.stats.map((item) => {
    if (item.label === 'Disciplinas' || item.label === 'Subjects' || item.label === 'Asignaturas') {
      return { ...item, label: t.dashboard.stats.subjects };
    }

    if (item.label === 'Aulas concluídas' || item.label === 'Classes completed' || item.label === 'Clases completadas') {
      return { ...item, label: t.dashboard.stats.classes };
    }

    if (item.label === 'Quiz recente' || item.label === 'Recent quiz' || item.label === 'Cuestionario reciente') {
      return { ...item, label: t.dashboard.stats.quiz };
    }

    if (item.label === 'Meta semanal' || item.label === 'Weekly goal' || item.label === 'Meta semanal') {
      return { ...item, label: t.dashboard.stats.weekly };
    }

    return item;
  });

  const renderView = () => {
    if (!dashboard) return null;

    switch (activeView) {
      case 'subjects':
        return (
          <section className="section-panel">
            <div className="section-heading">
              <h2>{t.dashboard.subjectDetail}</h2>
            </div>
            <div className="subject-card-grid">
              {dashboard.subjects.map((subject) => (
                <article key={subject.id} className="subject-main-card">
                  <div className="subject-header-row">
                    <span className="subject-dot" style={{ background: subject.color }} />
                    <h3>{subject.name}</h3>
                  </div>
                  <p>{subject.description}</p>
                  <div className="progress-line">
                    <span style={{ width: `${subject.progress}%` }} />
                  </div>
                  <strong>{subject.progress}%</strong>
                </article>
              ))}
            </div>
          </section>
        );
      case 'materials':
        return (
          <section className="section-panel">
            <div className="section-heading">
              <h2>{t.dashboard.materialsTitle}</h2>
            </div>
            <div className="material-grid">
              {materialsCatalog.map((material) => (
                <article key={material.id} className="material-card">
                  <span className="badge dark">{material.type}</span>
                  <h3>{material.title}</h3>
                  <p>{material.duration}</p>
                  <span className="badge soft">{material.status}</span>
                </article>
              ))}
            </div>
          </section>
        );
      case 'agenda':
        return (
          <section className="section-panel">
            <div className="section-heading">
              <h2>{t.dashboard.agendaTitle}</h2>
            </div>
            <ul className="agenda-list">
              {agendaItems.map((item) => (
                <li key={item.id} className="agenda-item">
                  <div>
                    <strong>{item.title}</strong>
                    <small>{item.time}</small>
                  </div>
                  <span className="badge primary">{item.type}</span>
                </li>
              ))}
            </ul>
          </section>
        );
      case 'quizzes':
        return (
          <section className="section-panel">
            <div className="section-heading">
              <h2>{t.dashboard.quizzesTitle}</h2>
            </div>
            <div className="quiz-grid">
              {quizCards.map((quiz) => (
                <article key={quiz.id} className="quiz-card">
                  <span>{quiz.title}</span>
                  <strong>{quiz.score}</strong>
                  <small>{quiz.date}</small>
                  <em>{quiz.questions} questões</em>
                </article>
              ))}
            </div>
          </section>
        );
      case 'reports':
        return (
          <section className="section-panel">
            <div className="section-heading">
              <h2>{t.dashboard.reportsTitle}</h2>
            </div>
            <div className="report-list">
              {reportBars.map((item) => (
                <div key={item.label} className="report-row">
                  <div className="report-label-row">
                    <span>{item.label}</span>
                    <strong>{item.value}%</strong>
                  </div>
                  <div className="report-track">
                    <span style={{ width: `${item.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      default:
        return (
          <>
            <section className="stats-grid">
              {(localizedStats ?? dashboard.stats).map((item) => (
                <article key={item.label} className="stat-card">
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </article>
              ))}
            </section>

            <section className="content-grid">
              <div className="panel">
                <h2>{t.dashboard.mySubjects}</h2>
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
                <h2>{t.dashboard.nextTasks}</h2>
                <ul className="task-list">
                  {dashboard.tasks.map((task) => (
                    <li key={task.id}>
                      <div>
                        <strong>{task.title}</strong>
                        <small>{task.due}</small>
                      </div>
                      <span className={task.status === 'done' ? 'done' : 'pending'}>
                        {task.status === 'done' ? t.dashboard.done : t.dashboard.pending}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            <section className="panel bottom-panel">
              <h2>{t.dashboard.recentPerformance}</h2>
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
          </>
        );
    }
  };

  if (!token || !dashboard) {
    return (
      <div className="auth-shell">
        <div className="auth-card">
          <div className="brand-block">
            <span className="mini-label">{t.auth.subtitle}</span>
            <h1>{t.auth.title}</h1>
            <p>{t.auth.description}</p>
          </div>

          <div className="auth-panel">
            <div className="language-row">
              <label htmlFor="language-selector" className="language-label">{t.language}</label>
              <select
                id="language-selector"
                className="language-select"
                value={language}
                onChange={(event) => setLanguage(event.target.value as Language)}
              >
                <option value="pt">Português</option>
                <option value="en">English</option>
                <option value="es">Español</option>
              </select>
            </div>

            <div className="switcher">
              <button className={mode === 'login' ? 'active' : ''} onClick={() => setMode('login')}>
                {t.auth.login}
              </button>
              <button className={mode === 'register' ? 'active' : ''} onClick={() => setMode('register')}>
                {t.auth.register}
              </button>
            </div>

            {mode === 'register' && (
              <label>
                {t.auth.name}
                <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
              </label>
            )}

            <label>
              {t.auth.email}
              <input value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
            </label>

            <label>
              {t.auth.password}
              <input type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
            </label>

            {mode === 'register' && (
              <label>
                {t.auth.role}
                <select value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value as UserRole })}>
                  <option value="student">{t.auth.student}</option>
                  <option value="teacher">{t.auth.teacher}</option>
                  <option value="admin">{t.auth.admin}</option>
                </select>
              </label>
            )}

            {error && <p className="error">{error}</p>}

            <button className="primary-button" onClick={handleSubmit} disabled={loading}>
              {loading ? t.auth.loading : mode === 'login' ? t.auth.login : t.auth.account}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">{t.dashboard.brand}</div>
        <nav>
          {navItems.map((item) => (
            <button
              key={item.key}
              type="button"
              className={activeView === item.key ? 'nav-button active' : 'nav-button'}
              onClick={() => setActiveView(item.key)}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <button className="logout-button" onClick={handleLogout}>{t.dashboard.logout}</button>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="eyebrow">{t.dashboard.welcome}</p>
            <h1>{greeting}</h1>
          </div>

          <div className="header-actions">
            <label className="language-inline">
              <span>{t.language}</span>
              <select value={language} onChange={(event) => setLanguage(event.target.value as Language)}>
                <option value="pt">Português</option>
                <option value="en">English</option>
                <option value="es">Español</option>
              </select>
            </label>
            <button className="primary-button">{t.dashboard.newTask}</button>
          </div>
        </header>

        {renderView()}
      </main>
    </div>
  );
}

