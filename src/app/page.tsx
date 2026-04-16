import HotelCatalog from '@/components/HotelCatalog';
import Banner from '@/components/Banner';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 pt-16">
      
      <Banner />
      
      <div className="container mx-auto py-8">
        <HotelCatalog />
      </div>

    </main>
  );
}