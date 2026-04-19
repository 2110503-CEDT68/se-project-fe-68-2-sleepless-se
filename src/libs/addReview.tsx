export default async function addReview(
  hotelId: string,  
  rating: number, 
  comment: string,
  token: string
) {
  

  // ส่ง Request ไปยัง Backend
  const res = await fetch(`https://hotelbooking-kwtf.onrender.com/api/v1/hotels/${hotelId}/reviews`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` 
    },
    body: JSON.stringify({
      hotel: hotelId,                    
      rating: rating,
      comment: comment
    }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to add review");
  }

  return await res.json();
}