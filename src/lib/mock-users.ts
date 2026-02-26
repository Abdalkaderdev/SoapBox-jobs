export interface MockUser {
  id: string;
  email: string;
  password: string; // In real app, this would be hashed
  name: string;
  role: "job_seeker" | "church_admin";
  churchId?: string; // For church admins
  profilePhoto?: string;
  ministryStatement?: string;
}

export const mockUsers: MockUser[] = [
  {
    id: "user-1",
    email: "john@example.com",
    password: "password123",
    name: "John Smith",
    role: "job_seeker",
    ministryStatement: "Called to serve in worship ministry, bringing people closer to God through music.",
  },
  {
    id: "user-2",
    email: "sarah@example.com",
    password: "password123",
    name: "Sarah Johnson",
    role: "job_seeker",
    ministryStatement: "Passionate about youth ministry and discipleship.",
  },
  {
    id: "user-3",
    email: "admin@gracechurch.com",
    password: "password123",
    name: "Pastor David Wilson",
    role: "church_admin",
    churchId: "c1",
  },
  {
    id: "user-4",
    email: "admin@hillside.com",
    password: "password123",
    name: "Mary Thompson",
    role: "church_admin",
    churchId: "c2",
  },
];

export function findUserByEmail(email: string): MockUser | undefined {
  return mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function validateCredentials(email: string, password: string): MockUser | null {
  const user = findUserByEmail(email);
  if (user && user.password === password) {
    return user;
  }
  return null;
}
