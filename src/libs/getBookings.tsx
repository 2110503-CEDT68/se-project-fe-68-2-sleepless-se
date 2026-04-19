export default async function getBookings(token: string) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/bookings`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch bookings");
    }

    return await response.json();
}