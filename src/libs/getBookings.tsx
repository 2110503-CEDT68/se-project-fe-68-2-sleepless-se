export default async function getBookings(token: string) {
    const response = await fetch(`https://se-be-9w6y.onrender.com/api/v1/bookings`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
        },
        cache: 'no-store'
    });

    if (!response.ok) {
        throw new Error("Failed to fetch bookings");
    }

    return await response.json();
}