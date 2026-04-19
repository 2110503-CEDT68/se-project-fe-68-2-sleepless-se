export interface RejectSubmissionResponse {
  success: boolean;
  message: string;
}

export default async function rejectHotelSubmission(
  id: string,
  reason: string,
  token: string | null
): Promise<RejectSubmissionResponse> {
  if (!token) {
    throw new Error("No authentication token provided");
  }

  if (!reason) {
    throw new Error("A rejection reason is required");
  }

<<<<<<< Updated upstream
  const response = await fetch(`https://se-be-9w6y.onrender.com/api/v1/admin/hotel-submissions/${id}/reject`, {
=======
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/admin/hotel-submissions/${id}/reject`, {
>>>>>>> Stashed changes
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    // Convert our reason string into the JSON object the backend expects
    body: JSON.stringify({ reason }), 
  });

  if (!response.ok) {
    let errorMessage = `Failed to reject submission: ${response.status} ${response.statusText}`;
    try {
      const errorData = await response.json();
      if (errorData.message) errorMessage = errorData.message;
    } catch (e) {
      // Ignore JSON parse errors
    }
    throw new Error(errorMessage);
  }

  return await response.json();
}