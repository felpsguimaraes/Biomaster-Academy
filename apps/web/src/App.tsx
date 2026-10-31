const stats = [
  { label: 'Disciplinas', value: '12' },
  { label: 'Aulas concluídas', value: '86%' },
  { label: 'Quiz recente', value: '92%' },
  { label: 'Meta semanal', value: 'Em dia' }
];

const subjects = [
  'Matemática Aplicada',
  'Física',
  'História',
  'Programação',
  'Biologia',
  'Literatura'
];

const tasks = [
  { title: 'Resumo de Álgebra', due: 'Hoje, 18:00' },
  { title: 'Quiz de Física', due: 'Amanhã, 09:30' },
  { title: 'Leitura de capítulo', due: 'Qua, 14:00' }
];

export default function App() {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">Biomaster Academy</div>
        <nav>
          <a className="active">Dashboard</a>
          <a>Disciplinas</a>
          <a>Materiais</a>
          <a>Agenda</a>
          <a>Quizzes</a>
          <a>Relatórios</a>
        </nav>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="eyebrow">Bem-vindo(a),</p>
            <h1>João da Silva</h1>
          </div>
          <button className="primary-button">Nova tarefa</button>
        </header>

        <section className="stats-grid">
          {stats.map((item) => (
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
              {subjects.map((subject) => (
                <li key={subject}>
                  <span>{subject}</span>
                  <span className="status">Ativa</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="panel">
            <h2>Próximas tarefas</h2>
            <ul className="task-list">
              {tasks.map((task) => (
                <li key={task.title}>
                  <div>
                    <strong>{task.title}</strong>
                    <small>{task.due}</small>
                  </div>
                  <button>Ver</button>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}
