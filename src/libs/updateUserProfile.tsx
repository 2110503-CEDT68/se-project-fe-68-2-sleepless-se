<<<<<<< HEAD
export default async function updateProfile(name: string, tel: string, token: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/updateprofile`, {
=======
export default async function updateProfile(name: string, tel: string, color:string, token: string) {
  const res = await fetch(`https://se-be-9w6y.onrender.com/api/v1/auth/updateprofile`, {
>>>>>>> 4d91257336a9ed1d0e17ad90bc434de26365c155
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({
      name: name,
      tel: tel,
      profileImageUrl: color
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Update failed");
  }

  return await res.json();
}