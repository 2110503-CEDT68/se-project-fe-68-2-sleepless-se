export default async function userRegister(userData: any) {
  const res = await fetch('https://hotelbooking-kwtf.onrender.com/api/v1/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    // ส่งข้อมูลที่รับมาไปให้ Backend
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