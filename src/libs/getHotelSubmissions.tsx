// Define the shape of the data you expect from the backend
export interface HotelSubmissionResponse {
  success: boolean;
  count: number;
  data: any[]; // We can make this more specific later!
}

export default async function getHotelSubmissions(
  token: string | null
): Promise<HotelSubmissionResponse> {
  // 1. Guard against null tokens before making the network request
  if (!token) {
    throw new Error("No authentication token provided");
  }

  const response = await fetch(`https://se-be-9w6y.onrender.com/api/v1/admin/hotel-submissions`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    // Note: If you are using Next.js App Router, fetches with 'Authorization' 
    // headers are automatically opted out of caching, which is exactly what you want here.
  });

  if (!response.ok) {
    // 2. Fixed the error message and added status text for easier debugging
    throw new Error(`Failed to fetch hotel submissions: ${response.status} ${response.statusText}`);
  }

  return await response.json();
}