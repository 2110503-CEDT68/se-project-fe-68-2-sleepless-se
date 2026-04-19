export default async function deleteReview(
  hotelId: string,
  reviewId: string,
  token: string
) {
  const res = await fetch(
    `https://se-be-9w6y.onrender.com/api/v1/hotels/${hotelId}/reviews/${reviewId}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.msg || data.message || 'Failed to delete review');
  }

  return true;
}