export interface HotelSubmissionResponse {
  success: boolean;
  count: number;
  data: any[]; 
}

export default async function getHotelSubmissions(
  token: string | null,
  status?: string // <-- Add an optional status parameter
): Promise<HotelSubmissionResponse> {
  if (!token) {
    throw new Error("No authentication token provided");
  }

  // Construct the URL with the query parameter if it exists
  const baseUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/admin/hotel-submissions`;
  const fetchUrl = status ? `${baseUrl}?status=${status}` : baseUrl;

  const response = await fetch(fetchUrl, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch hotel submissions: ${response.status} ${response.statusText}`);
  }

  return await response.json();
}