import { useEffect, useState } from "react";
import { TopGamesCarousel } from "@/components/TopGamesSlider";
import { NewGamesSection } from "@/components/NewGamesSection";
import { HomeBanner } from "@/components/home/HomeBanner";
import { HomeInfoSection } from "@/components/home/HomeInfoSection";
import { ProductsApi } from "@/api";
import type { Product } from "@/api";

export function HomePage() {
  const [topGames, setTopGames] = useState<Product[]>([]);
  const [newGames, setNewGames] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const topGamesData = await ProductsApi.getAll();
        // TODO: GET top games with stock > 0 based on orders from db
        setTopGames(topGamesData.content);
        // TODO: Be sure that newGames have stcok > 0 before we display them in homePage
        const newestGamesData = await ProductsApi.getNewest();
        setNewGames(newestGamesData.content);
      } catch (err) {
        console.error("Błąd pobierania gier:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGames();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg text-gray-400">
        Wczytywanie gier...
      </div>
    );
  }

  return (
    <div className="-mt-4">
      <HomeBanner />
      <main className="flex-1 pt-6 space-y-12">
        <section className="mx-auto px-4">
          <TopGamesCarousel games={topGames} />
        </section>

        <HomeInfoSection />

        <section className="mx-auto px-4">
          <NewGamesSection games={newGames} />
        </section>
      </main>
    </div>
  );
}