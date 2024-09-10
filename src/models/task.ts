
export interface User {
    id: string;
    role: 'user' | 'admin';
}
export interface Task {
    id: string;
    title: string;
    description?: string;
    status: 'todo' | 'in-progress' | 'done';
    dueDate?: string | Date;
    createdAt: string;
    updatedAt: string;
    user: User;
}
