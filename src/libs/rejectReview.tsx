export default async function rejectReview(
  hotelId: string,
  reviewId: string,
  token: string,
) {
  const res = await fetch(
    `https://se-be-9w6y.onrender.com/api/v1/hotels/${hotelId}/reviews/${reviewId}/reject`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.msg || data.message || "Failed to reject review");
  }

  return data;
}
