import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { TopGamesCarousel } from "@/components/TopGamesSlider";
import { NewGamesSection } from "@/components/NewGamesSection";
import { ProductsApi } from "@/api";
import type { Product } from "@/api";

export const Route = createFileRoute("/")({
    component: Home,
});

function Home() {
    const [topGames, setTopGames] = useState<Product[]>([]);
    const [newGames, setNewGames] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGames = async () => {
            try {
                let allGames: Product[] = [];
                let page = 0;
                let totalPages = 1;

                while (page <= totalPages && allGames.length < 12) {
                    const data = await ProductsApi.getAll({
                        page,
                        size: 10,
                        sortDirection: "ASC",
                    });

                    totalPages = data.totalPages;
                    const availableGames = data.content.filter((g) => g.stock > 0);
                    allGames = [...allGames, ...availableGames];
                    page++;
                }

                setTopGames(allGames.slice(0, 8));
                setNewGames(allGames.slice(8, 12));
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
        <div>
            <main className="flex-1 pt-6 space-y-12">
                <section className="mx-auto px-4">
                    <TopGamesCarousel games={topGames} />
                    <NewGamesSection games={newGames} />
                </section>
            </main>
        </div>
    );
}
