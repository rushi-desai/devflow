export type BoardStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';
export type TaskPriority = 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW';

export interface User {
  id: number;
  name: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface OrganizationMember {
  organizationId: number;
  userId: number;
  joinedAt: string;
  user?: User;
}

export interface Organization {
  id: number;
  name: string;
  ownerId: number;
  owner?: User;
  members?: OrganizationMember[];
  projects?: Project[];
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: number;
  content: string;
  taskId: number;
  authorId: number;
  author?: User;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: number;
  title: string;
  description?: string | null;
  status: BoardStatus;
  priority?: TaskPriority;
  labels?: string[];
  boardId: number;
  assigneeId?: number | null;
  assignee?: User | null;
  comments?: Comment[];
  createdAt: string;
  updatedAt: string;
}

export interface Board {
  id: number;
  name: string;
  projectId: number;
  tasks?: Task[];
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: number;
  name: string;
  description?: string | null;
  organizationId: number;
  ownerId: number;
  owner?: User;
  organization?: {
    id: number;
    name: string;
    members?: OrganizationMember[];
  };
  boards?: Board[];
  createdAt: string;
  updatedAt: string;
}

export interface ActivityLog {
  id: number;
  action: string;
  entity: string;
  entityId: number;
  userId: number;
  metadata?: any;
  user?: User;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
