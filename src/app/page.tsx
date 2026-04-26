import HotelCatalog from "@/components/HotelCatalog";
import Banner from "@/components/Banner";
import FilterBar from "@/components/FilterBar";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 pt-16">
      <Banner />
      <HotelCatalog />
    </main>
  );
}
