export default async function getReviews(hotelId: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/hotels/${hotelId}/reviews`,
      { cache: 'no-store' }
    );
    if (!res.ok) return { data: [], avgRating: null };
    return res.json();
  } catch {
    return { data: [], avgRating: null };
  }
}
