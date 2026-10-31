export type UserRole = 'student' | 'teacher' | 'admin';

export type DashboardSummary = {
  user: {
    id: string;
    name: string;
    role: UserRole;
  };
  stats: Array<{ label: string; value: string; tone?: 'primary' | 'success' | 'warning' }>;
  subjects: Array<{
    id: string;
    name: string;
    description: string;
    color: string;
    progress: number;
  }>;
  tasks: Array<{
    id: string;
    title: string;
    due: string;
    status: 'pending' | 'done';
  }>;
  recentAssessments: Array<{ title: string; score: string; date: string }>;
};
