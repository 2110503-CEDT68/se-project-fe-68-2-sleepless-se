export default async function updateBooking(id: string, checkInDate: string, checkOutDate: string, token: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/bookings/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({
      checkInDate: checkInDate,
      checkOutDate: checkOutDate,
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Update failed");
  }

  return await res.json();
}