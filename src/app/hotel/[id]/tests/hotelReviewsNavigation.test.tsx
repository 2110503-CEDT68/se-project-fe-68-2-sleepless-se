import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

// ─── Mocks ───────────────────────────────────────────────────────────────────

// Mock next/navigation
const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

// Mock next-auth/react
jest.mock("next-auth/react", () => ({
  useSession: () => ({ data: null, status: "unauthenticated" }),
}));

// Mock next/link — renders a plain <a> so href is testable
jest.mock("next/link", () => {
  const MockLink = ({
    href,
    children,
    className,
  }: {
    href: string;
    children: React.ReactNode;
    className?: string;
  }) => (
    <a href={href} className={className}>
      {children}
    </a>
  );
  MockLink.displayName = "MockLink";
  return MockLink;
});

// Mock react's `use()` so the hotel page can unwrap the params Promise
jest.mock("react", () => ({
  ...jest.requireActual("react"),
  use: (promise: Promise<{ id: string }> | { id: string }) => {
    // In tests params is already a plain object, not a Promise
    if (promise && typeof (promise as any).then !== "function") {
      return promise;
    }
    return { id: "test-hotel-123" };
  },
}));

// Mock MUI Rating so it renders without canvas/SVG issues
jest.mock("@mui/material", () => ({
  Rating: ({ defaultValue }: { defaultValue: number }) => (
    <span data-testid="rating">{defaultValue}</span>
  ),
}));

// Mock child components used by the hotel page
jest.mock("@/components/Hotel/HotelEditPanel", () => () => <div />);
jest.mock("@/components/Hotel/HotelEditModal", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));
jest.mock("@/components/ReviewModal", () => () => <div />);

// Mock the data-fetching libs so no real HTTP calls are made
jest.mock("@/libs/getHotel", () =>
  jest.fn().mockResolvedValue({
    hotel_name: "Test Hotel",
    description: "A great place",
    address: "123 Main St",
    telephone: "+66000000000",
    email: "hotel@test.com",
    region: "Bangkok",
    district: "Sathorn",
    postalcode: "10120",
    province: "Bangkok",
  }),
);
jest.mock("@/libs/addReview", () => jest.fn());
jest.mock("@/libs/updateHotels", () => jest.fn());

// Mock CSS modules
jest.mock(
  "./page.module.css",
  () => ({
    StyleWrapper: "div",
    ContentWrapper: "div",
    ImageWrapper: "div",
    InformationWrapper: "div",
    Rating: "div",
    ButtonWrapper: "div",
  }),
  { virtual: true },
);

// ─── Imports (after mocks) ────────────────────────────────────────────────────

import HotelPage from "@/app/hotel/[id]/page";
import AllReviewsPage from "@/app/hotel/[id]/reviews/page";

// ─── Hotel Information Page Tests ─────────────────────────────────────────────

describe("HotelPage — All Reviews link", () => {
  const HOTEL_ID = "test-hotel-123";

  function renderHotelPage() {
    // params is a Promise<{id}> in production; our `use()` mock handles either
    return render(<HotelPage params={Promise.resolve({ id: HOTEL_ID })} />);
  }

  it('renders an "All reviews" link', () => {
    renderHotelPage();
    const link = screen.getByRole("link", { name: /all reviews/i });
    expect(link).toBeInTheDocument();
  });

  it(`"All reviews" link points to /hotel/${HOTEL_ID}/reviews`, () => {
    renderHotelPage();
    const link = screen.getByRole("link", { name: /all reviews/i });
    expect(link).toHaveAttribute("href", `/hotel/${HOTEL_ID}/reviews`);
  });

  it('navigates to the All Reviews page when "All reviews" is clicked', async () => {
    const user = userEvent.setup();
    renderHotelPage();

    const link = screen.getByRole("link", { name: /all reviews/i });

    // Simulate click (next/link renders an <a>, so clicking it is sufficient)
    await user.click(link);

    // The href attribute confirms the correct destination
    expect(link).toHaveAttribute("href", `/hotel/${HOTEL_ID}/reviews`);
  });
});

// ─── All Reviews Page Tests ────────────────────────────────────────────────────

// Mock ReviewList used in AllReviewsPage
jest.mock("@/components/ReviewList", () => {
  const MockReviewList = ({
    reviews,
  }: {
    reviews: { id: number; name: string; comment: string; rating: number }[];
  }) => (
    <ul>
      {reviews.map((r) => (
        <li key={r.id} data-testid="review-item">
          {r.name}: {r.comment} ({r.rating})
        </li>
      ))}
    </ul>
  );
  MockReviewList.displayName = "MockReviewList";
  return MockReviewList;
});

describe("AllReviewsPage", () => {
  const HOTEL_ID = "test-hotel-123";

  function renderAllReviewsPage() {
    return render(<AllReviewsPage params={{ id: HOTEL_ID }} />);
  }

  it("renders the All Reviews page heading", () => {
    renderAllReviewsPage();
    expect(screen.getByText(/all reviews of/i)).toBeInTheDocument();
  });

  it("displays the list of reviews", () => {
    renderAllReviewsPage();
    const items = screen.getAllByTestId("review-item");
    // 9 dummy reviews defined in the component
    expect(items.length).toBe(9);
  });

  it('renders a "Back to hotel" link pointing to the hotel page', () => {
    renderAllReviewsPage();
    const backLink = screen.getByRole("link", { name: /back to hotel/i });
    expect(backLink).toBeInTheDocument();
    expect(backLink).toHaveAttribute("href", `/hotel/${HOTEL_ID}`);
  });

  it("renders the sort-order dropdown with default value 'desc'", () => {
    renderAllReviewsPage();
    const select = screen.getByRole("combobox");
    expect(select).toHaveValue("desc");
  });

  it("changes sort order to ascending when selected", async () => {
    const user = userEvent.setup();
    renderAllReviewsPage();

    const select = screen.getByRole("combobox");
    await user.selectOptions(select, "asc");
    expect(select).toHaveValue("asc");
  });

  it("filters reviews when a star-rating filter button is clicked", async () => {
    const user = userEvent.setup();
    renderAllReviewsPage();

    // Click the "5 stars" filter button
    const fiveStarButton = screen.getByRole("button", { name: /5 stars/i });
    await user.click(fiveStarButton);

    // Only reviews with rating === 5 should show (Jake, Jackson, Jennie = 3)
    const items = screen.getAllByTestId("review-item");
    expect(items.length).toBe(3);
  });

  it('resets filter to show all reviews when "All" is clicked', async () => {
    const user = userEvent.setup();
    renderAllReviewsPage();

    // First narrow down
    const fiveStarButton = screen.getByRole("button", { name: /5 stars/i });
    await user.click(fiveStarButton);
    expect(screen.getAllByTestId("review-item").length).toBe(3);

    // Then reset
    const allButton = screen.getByRole("button", { name: /^all$/i });
    await user.click(allButton);
    expect(screen.getAllByTestId("review-item").length).toBe(9);
  });
});

// ─── Navigation Integration Test ──────────────────────────────────────────────

describe("Navigation: HotelPage → AllReviewsPage", () => {
  const HOTEL_ID = "test-hotel-123";

  it('the href of "All reviews" matches the route rendered by AllReviewsPage', () => {
    // 1. Render the hotel page and grab the link href
    const { unmount } = render(
      <HotelPage params={Promise.resolve({ id: HOTEL_ID })} />,
    );
    const link = screen.getByRole("link", { name: /all reviews/i });
    const destination = link.getAttribute("href")!;
    unmount();

    // 2. Confirm AllReviewsPage renders correctly for that same id
    render(<AllReviewsPage params={{ id: HOTEL_ID }} />);
    expect(screen.getByText(/all reviews of/i)).toBeInTheDocument();

    // 3. The link href must be exactly /hotel/<id>/reviews
    expect(destination).toBe(`/hotel/${HOTEL_ID}/reviews`);
  });
});
