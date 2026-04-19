export default async function deleteBooking(id: string, token: string) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/bookings/${id}`, {
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