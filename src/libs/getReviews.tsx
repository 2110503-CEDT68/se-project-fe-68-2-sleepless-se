export default async function getReviews(hotelId: string) {
  try {
    const res = await fetch(
      `https://se-be-9w6y.onrender.com/api/v1/hotels/${hotelId}/reviews`,
      { cache: 'no-store' }
    );
    if (!res.ok) return { data: [], avgRating: null };
    return res.json();
  } catch {
    return { data: [], avgRating: null };
  }
}
