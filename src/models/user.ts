export interface User {
    id: string;
    email: string;
    password: string;
    role: 'user' | 'admin';
    account: 'active' | 'inactive';
}
