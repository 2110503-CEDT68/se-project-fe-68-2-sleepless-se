export interface HotelSearchParams {
    rating?: number;
    minRating?: number;
    maxRating?: number;
    page?: number;
    limit?: number;
    sort?: string;
}

export default async function getHotels(params: HotelSearchParams = {}) {
    try {
        // 1. Convert the params object into a query string
        // Example: { rating: 4 } becomes "rating=4"
        const queryParams = new URLSearchParams();
        
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                queryParams.append(key, value.toString());
            }
        });

        const queryString = queryParams.toString();
        const url = `https://se-be-9w6y.onrender.com/api/v1/hotels${queryString ? `?${queryString}` : ''}`;

        const res = await fetch(url, {
            cache: 'no-store' // Useful if ratings change frequently
        });

        if (!res.ok) {
            throw new Error(`Failed to fetch hotels: ${res.statusText}`);
        }

        const responseData = await res.json();

        // 2. Return the data. 
        // Note: Your backend already filters by rating now, 
        // so we don't need to filter manually here anymore!
        return responseData.data;

    } catch (error) {
        console.error("Error fetching hotels:", error);
        throw error;
    }
}