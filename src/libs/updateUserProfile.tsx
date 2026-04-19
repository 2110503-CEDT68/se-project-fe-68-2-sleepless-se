export default async function updateProfile(name: string, tel: string, token: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/updateprofile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({
      name: name,
      tel: tel,
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Update failed");
  }

  return await res.json();
}