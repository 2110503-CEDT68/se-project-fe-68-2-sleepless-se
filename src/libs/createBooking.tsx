export default async function createBooking(
  hotelId: string, 
  checkInDate: string, 
  numOfNights: number, 
  price: number,
  token: string
) {
  // 1. คำนวณหา checkOutDate 
  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkIn);
  checkOut.setDate(checkOut.getDate() + numOfNights); // เอาวันเช็คอิน + จำนวนคืน

  // 2. ส่ง Request ไปยัง Backend
  const res = await fetch(`https://se-be-9w6y.onrender.com/api/v1/bookings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` 
    },
    body: JSON.stringify({
      hotel: hotelId,                // ตรงกับชื่อฟิลด์ใน Schema (hotel)
      checkInDate: checkInDate,      // ตรงกับชื่อฟิลด์ใน Schema
      checkOutDate: checkOut.toISOString(),
      price: price,
    }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to create booking");
  }

  return await res.json();
}