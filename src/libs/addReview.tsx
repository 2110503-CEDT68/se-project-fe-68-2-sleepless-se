export default async function addReview(
  hotelId: string,  
  rating: number, 
  comment: string,
  token: string
) {
  

  // ส่ง Request ไปยัง Backend
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/hotels/${hotelId}/reviews`, {
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
  }

  return await res.json();
}