export default async function getHotel(id: string) {
  try {
    const res = await fetch(
      `https://se-be-9w6y.onrender.com/api/v1/hotels/${id}`,
      { cache: "no-store" },
    );
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}
