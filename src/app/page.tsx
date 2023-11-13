import Footer from '@/components/Footer/Footer';
import LandingPage from '@/components/LandingPage/LandingPage';
import Navbar from '@/components/Navbar/Navbar';

export default function Home() {
  return (
    <div>
      <Navbar />
      <main className="home-img overflow-x-hidden">
        <LandingPage />
      </main>
      <Footer />
    </div>
  );
}
