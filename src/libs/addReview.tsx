export default async function addReview(
  hotelId: string,
  rating: number,
  comment: string,
  token: string
) {
  const res = await fetch(
    `https://se-be-9w6y.onrender.com/api/v1/hotels/${hotelId}/reviews`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ rating, comment }),
    }
  );

<<<<<<< Updated upstream
  // ส่ง Request ไปยัง Backend
  const res = await fetch(`https://se-be-9w6y.onrender.com/api/v1/hotels/${hotelId}/reviews`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` 
    },
    body: JSON.stringify({
      hotel: hotelId,                    
      rating: rating,
      comment: comment,
      token: token
    }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    console.log("BACKEND ERROR DETAILS:", errorData);
    
    throw new Error(errorData.message || "Failed to add review");
=======
  const data = await res.json();

  if (!res.ok) {
    // BE ส่ง msg ไม่ใช่ message
    throw new Error(data.msg || data.message || 'Failed to add review');
>>>>>>> Stashed changes
  }

  return data;
}