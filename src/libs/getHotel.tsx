export default async function getHotel(id: string) {
    try {
        const res = await fetch(`https://se-be-9w6y.onrender.com/api/v1/hotels/${id}`);
        
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