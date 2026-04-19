export default async function getHotelSubmissions(
    token:string | null
) {
    const response = await fetch(`https://se-be-9w6y.onrender.com/api/v1/admin/hotel-submissions`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch hotel submissions");
    }

    return await response.json();
}