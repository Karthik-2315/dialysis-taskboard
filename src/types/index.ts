export type Role = "nurse" | "dietician" | "social_worker";

export type TaskStatus = "todo" | "in_progress" | "done";

export interface Patient {
  id: string;
  name: string;
}

export interface Task {
  id: string;
  patientId: string;
  title: string;
  status: TaskStatus;
  role: Role;
  dueDate?: string;
}