export default async function getReviews(
  hotelId: string,
  options?: {
    page?: number;
    limit?: number;
    sort?: 'asc' | 'desc';
    rating?: number | null;
  }
) {
  try {
    const params = new URLSearchParams();

    if (options?.page) params.append('page', options.page.toString());
    if (options?.limit) params.append('limit', options.limit.toString());
    if (options?.sort) params.append('sort', options.sort);
    if (options?.rating !== null && options?.rating !== undefined) {
      params.append('rating', options.rating.toString());
    }

    const url = `https://se-be-9w6y.onrender.com/api/v1/hotels/${hotelId}/reviews?${params.toString()}`;

    const res = await fetch(url, { cache: 'no-store' });

    if (!res.ok) {
      return { data: [], totalPages: 1, currentPage: 1 };
    }

    return res.json();
  } catch (err) {
    console.error(err);
    return { data: [], totalPages: 1, currentPage: 1 };
  }
}