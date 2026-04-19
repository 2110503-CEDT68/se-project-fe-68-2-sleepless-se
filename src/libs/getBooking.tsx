export default async function getBooking(id: string, token: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/bookings/${id}`, {
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