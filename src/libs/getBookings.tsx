export default async function getBookings(token: string) {
    const response = await fetch(`https://hotelbooking-kwtf.onrender.com/api/v1/bookings`, {
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