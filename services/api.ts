const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
  phone: string;
  role_id?: number;
}) {
  const res = await fetch(`${API_URL}/user`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...data, role_id: data.role_id ?? 1 }),
  });
  if (!res.ok) throw new Error('Error en el registro');
  return res.json();
}

export async function loginUser(email: string, password: string) {
  const res = await fetch(`${API_URL}/auth`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error('Credenciales inválidas');
  return res.json();
}

export async function getProfile(token: string) {
  const res = await fetch(`${API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Error obteniendo perfil');
  return res.json();
}
