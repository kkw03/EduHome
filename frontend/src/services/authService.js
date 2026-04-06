import api from './api';

export async function login(email, password) {
  const { data } = await api.post('/auth/login', { email, password });
  return data.user;
}

export async function register(email, password, contactNo) {
  const { data } = await api.post('/auth/register', {
    email,
    password,
    contact_no: contactNo,
  });
  return data.user;
}

export async function logout() {
  await api.post('/auth/logout');
}

export async function getCurrentUser() {
  const { data } = await api.get('/auth/me');
  return data.user;
}
