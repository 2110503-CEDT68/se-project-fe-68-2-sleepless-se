export default async function deleteBooking(id: string, token: string) {
    const response = await fetch(`https://hotelbooking-kwtf.onrender.com/api/v1/bookings/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error("Failed to delete booking");
    }

    return await response.json();
}