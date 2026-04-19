// ─── Venue (legacy) ───────────────────────────────────────────────────────────
export interface VenueItem {
  _id: string;
  name: string;
  address: string;
  district: string;
  province: string;
  postalcode: string;
  tel: string;
  picture: string;
  dailyrate: number;
  __v: number;
  id: string;
}

export interface VenueJson {
  success: boolean;
  count: number;
  pagination: object;
  data: VenueItem[];
}

// ─── Hotel ────────────────────────────────────────────────────────────────────
export interface Hotel {
  _id: string;
  hotel_name: string;
  address: string;
  district?: string;
  province?: string;
  telephone: string;
  region?: string;
  postalcode?: string;
}

export interface HotelJson {
  success: boolean;
  data: Hotel;
}

export interface HotelsJson {
  success: boolean;
  count: number;
  pagination: object;
  data: Hotel[];
}

// ─── Review ───────────────────────────────────────────────────────────────────
export interface ReviewUser {
  _id: string;
  name: string;
}

export interface Review {
  _id: string;
  user: ReviewUser | string;
  rating: number;
  comment: string;
  createdAt: string;
  status?: string;
}

export interface ReviewsJson {
  success: boolean;
  avgRating?: string;
  data: Review[];
}

// ─── Booking ──────────────────────────────────────────────────────────────────
export interface BookingItem {
  nameLastname: string;
  tel: string;
  venue: string;
  bookDate: string;
}

export interface BookingFormProps {
  initialHotelId: string;
}

export interface FormErrors {
  name?: string;
  tel?: string;
  submit?: string;
}

// ─── Review Modal ─────────────────────────────────────────────────────────────
export interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: number, comment: string) => void;
}

// ─── Star Filter ──────────────────────────────────────────────────────────────
export interface StarFilterTabsProps {
  selectedStar: number | null;
  onSelectStar: (star: number | null) => void;
  starCounts: Record<number, number>;
}

// ─── Rating Distribution ──────────────────────────────────────────────────────
export interface RatingDistributionBarProps {
  starCounts: Record<number, number>;
  totalCount: number;
  avgRating: number | null;
  onStarClick?: (star: number) => void;
  selectedStar?: number | null;
}

// ─── Profile ──────────────────────────────────────────────────────────────────
export interface ProfileViewProps {
  name: string;
  email: string;
  tel: string;
  onEdit: () => void;
}

export interface ProfileFormProps {
  initialName: string;
  initialTel: string;
  token: string;
  onSuccess: (newName: string, newTel: string) => void;
  onCancel: () => void;
}

// ─── Moderation ───────────────────────────────────────────────────────────────
export type ReviewStatus = "active" | "hidden" | "rejected";

export interface ModerationActionsProps {
  reviewId: string;
  currentStatus: ReviewStatus;
  token: string;
  onActionComplete: (
    reviewId: string,
    action: "delete" | "hide" | "unhide" | "reject" | "approve",
  ) => void;
}
