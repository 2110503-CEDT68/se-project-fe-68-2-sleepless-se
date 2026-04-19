export default async function getHotels() {
    try {
        const res = await fetch(`https://se-be-9w6y.onrender.com/api/v1/hotels`);
        
        if (!res.ok) {
            throw new Error("Failed to fetch hotels");
        }
        
        const responseData = await res.json();
        
        
        return responseData.data.filter((item: any) => item.hotel_name);
        
    } catch (error) {
        console.error("Error fetching hotels:", error);
        throw error; 
    }
}