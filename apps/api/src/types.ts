export type UserRole = 'student' | 'teacher' | 'admin';

export type CourseStatus = 'active' | 'paused';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface Subject {
  id: string;
  name: string;
  description: string;
  color: string;
  progress: number;
}

export interface Task {
  id: string;
  title: string;
  due: string;
  status: 'pending' | 'done';
}

export interface DashboardSummary {
  user: {
    id: string;
    name: string;
    role: UserRole;
  };
  stats: Array<{ label: string; value: string; tone?: 'primary' | 'success' | 'warning' }>;
  subjects: Subject[];
  tasks: Task[];
  recentAssessments: Array<{ title: string; score: string; date: string }>;
}

export interface Course {
  id: string;
  name: string;
  professor: string;
  students: number;
  status: CourseStatus;
}
