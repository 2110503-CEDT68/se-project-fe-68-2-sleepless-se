// ─── Hotel ────────────────────────────────────────────────────────────────────
export interface Hotel {
  _id: string;
  hotel_name: string;
  district: string;
  province: string;
  postalcode: string;
  telephone: string;
  region: string;
  description: string;
  price: number;
  imageURL: string;
  address: string;
}

export type HotelUpdateData = {
  name: string;
  description: string;
  location: string;
  telephone: string;
  email: string;
  photoURL: string;
  province: string;
  region: string;
  postalcode: string;
  district: string;
  price: number;
};

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
  profileImageUrl: string;
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
export type RatingDistributionBarProps = {
  starCounts: Record<number, number>;
  totalCount: number;
  avgRating: number;
  onStarClick?: (star: number) => void;
  selectedStar?: number | null;
  imageURL?: string;
};
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
  initialColor: string;
  token: string;
  onSuccess: (newName: string, newTel: string, newColor: string) => void;
  onCancel: () => void;
}

// ─── Moderation ───────────────────────────────────────────────────────────────
export type ReviewStatus = "active" | "hidden" | "rejected";

export interface ModerationActionsProps {
  reviewId: string;
  hotelId: string;
  currentStatus: ReviewStatus;
  token: string;
  onActionComplete: (
    reviewId: string,
    action: "delete" | "hide" | "unhide" | "reject" | "approve",
  ) => void;
  isReported?: boolean;
  reports?: { reason: string; user?: string }[];
}
