export default async function getHotel(id: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/hotels/${id}`,
      { cache: 'no-store' }
    );
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}