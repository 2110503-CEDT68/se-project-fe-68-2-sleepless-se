export default async function updateHotel(
  id: string,
  updatedData: {
    name: string;
    description: string;
    location: string;
    telephone: string;
    email: string;
    photoURL: string;
  },
  token: string
) {
  const res = await fetch(
    `https://se-be-9w6y.onrender.com/api/v1/hotels/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        hotel_name: updatedData.name,
        address: updatedData.location,
        telephone: updatedData.telephone, 
      }),
    }
  );

  const data = await res.json();

  if (!res.ok) {
    console.error("Backend error:", data);
    throw new Error(data.message || "Failed to update hotel");
  }

  return data;
}