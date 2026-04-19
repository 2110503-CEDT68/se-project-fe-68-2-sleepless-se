export default async function getHotel(id: string) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/hotels/${id}`);
        
        if (!res.ok) {
            throw new Error("Failed to fetch hotels");
        }
        
        const responseData = await res.json();
        
        
        return responseData.data;
        
    } catch (error) {
        console.error("Error fetching single hotel:", error);
        throw error; 
    }
}