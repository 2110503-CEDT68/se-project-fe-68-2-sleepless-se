export default async function createReport(
  reviewId: string, 
  reason: string, 
  token: string
) {
  const response = await fetch(`https://se-be-9w6y.onrender.com/api/v1/reviews/${reviewId}/report`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ reason }),
  });

  const data = await response.json();

  // If the response isn't OK or our API specifically returned success: false
  if (!response.ok || !data.success) {
    throw new Error(data.msg || "Something went wrong while reporting");
  }

  return data;
}