export default async function userRegister(userData: any) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: userData.name,
      email: userData.email,
      tel: userData.telephone,
      password: userData.password,
      role: 'user'
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || data.error || 'Registration failed. Please try again.');
  }

  return data;
}
