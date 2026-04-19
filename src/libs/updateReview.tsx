export default async function updateReview(
  hotelId: string,
  reviewId: string,
  rating: number,
  comment: string,
  token: string
) {
  const res = await fetch(
    `https://se-be-9w6y.onrender.com/api/v1/hotels/${hotelId}/reviews/${reviewId}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ rating, comment }),
    }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.msg || data.message || 'Failed to update review');
  }

  return data;
}