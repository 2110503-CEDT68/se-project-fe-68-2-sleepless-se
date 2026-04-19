export interface ApproveSubmissionResponse {
  success: boolean;
  message: string;
  data?: any; // Contains the updated/created Hotel object
}

export default async function approveHotelSubmission(
  id: string,
  token: string | null
): Promise<ApproveSubmissionResponse> {
  if (!token) {
    throw new Error("No authentication token provided");
  }

<<<<<<< Updated upstream
  const response = await fetch(`https://se-be-9w6y.onrender.com/api/v1/admin/hotel-submissions/${id}/approve`, {
=======
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/admin/hotel-submissions/${id}/approve`, {
>>>>>>> Stashed changes
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      // Even without a body, it's good practice to include Content-Type
      "Content-Type": "application/json" 
    },
  });

  if (!response.ok) {
    // If the backend returns a specific error message (like "Submission not found"), try to parse it
    let errorMessage = `Failed to approve submission: ${response.status} ${response.statusText}`;
    try {
      const errorData = await response.json();
      if (errorData.message) errorMessage = errorData.message;
    } catch (e) {
      // Ignore JSON parse errors if the response is empty or HTML
    }
    throw new Error(errorMessage);
  }

  return await response.json();
}