export interface User {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  githubUsername?: string;
  createdAt?: any;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  members: string[];
  githubRepo?: string;
  createdAt: any;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  assigneeId?: string;
  dueDate?: any;
  createdAt: any;
}

export interface Repository {
  id: number;
  name: string;
  stars: number;
  forks: number;
  language: string;
  lastCommit: string;
}
