export default async function getBooking(id: string, token: string) {
  const res = await fetch(`https://hotelbooking-kwtf.onrender.com/api/v1/bookings/${id}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  if (!res.ok) {
    throw new Error("Failed to fetch booking");
  }

  return await res.json();
}