export type User = {
  id: string;
  name: string;
  email: string;
  role: 'Customer' | 'Author' | 'Admin';
  plan: 'Free' | 'Pro' | 'Studio';
  status: 'Active' | 'Invited' | 'Suspended';
  spend: number;
  orders: number;
  joined: string; // ISO
  lastActive: string; // ISO
  country: string;
};

export function filterUsers(
  users: User[],
  query: string,
  role: string,
  plan: string,
  status: string
): User[] {
  const q = query.trim().toLowerCase();
  return users.filter((u) => {
    if (role !== 'All' && u.role !== role) return false;
    if (plan !== 'All' && u.plan !== plan) return false;
    if (status !== 'All' && u.status !== status) return false;
    if (q && !`${u.name} ${u.email} ${u.country}`.toLowerCase().includes(q)) return false;
    return true;
  });
}

export function sortUsers(
  users: User[],
  sortKey: keyof User,
  sortDir: 'asc' | 'desc'
): User[] {
  const arr = [...users];
  arr.sort((a, b) => {
    const av = a[sortKey];
    const bv = b[sortKey];
    let cmp = 0;
    if (typeof av === 'number' && typeof bv === 'number') cmp = av - bv;
    else cmp = String(av).localeCompare(String(bv));
    return sortDir === 'asc' ? cmp : -cmp;
  });
  return arr;
}
