import { createFileRoute } from "@tanstack/react-router"
// import { fetchData } from "@/lib/fetchData"
import { useEffect, useState } from "react"
import {TopGamesCarousel} from "@/components/TopGamesSlider.tsx";
import {NewGamesSection} from "@/components/NewGamesSection.tsx";

interface Game {
    id: number
    name: string
    price: number
    logoId: string
    platform: { id: number; name: string }
    stock: number
}

interface ApiResponse {
    content: Game[]
    page: number
    size: number
    totalElements: number
    totalPages: number
    last: boolean
}


// interface HomeData {
//     featuredProducts: string[]
// }

export const Route = createFileRoute("/")({
    // loader: async () => {
    //     return await fetchData<HomeData>("/api/home")
    // },
    component: Home,
})

function Home() {

    const [topGames, setTopGames] = useState<Game[]>([])
    const [newGames, setNewGames] = useState<Game[]>([])
    const [loading, setLoading] = useState(true)
    const [baseUrl] = useState('http://product-service:8080')
    console.log('baseUrl: ' + baseUrl);

    useEffect(() => {
        const fetchGames = async () => {
            try {
                let allGames: Game[] = []
                let page = 0
                let totalPages = 1

                while (page <= totalPages && allGames.length < 12) {
                    console.log(baseUrl + `/products?page=${page}`);
                    const res = await fetch(baseUrl + `/products?page=${page}`)
                    if (!res.ok) throw new Error(`Błąd HTTP ${res.status}`)

                    const data: ApiResponse = await res.json()
                    totalPages = data.totalPages

                    const availableGames = data.content.filter((g) => g.stock > 0)
                    allGames = [...allGames, ...availableGames]
                    page++
                }

                const top = allGames.slice(0, 8)
                const newOnes = allGames.slice(8, 12)

                setTopGames(top)
                setNewGames(newOnes)
            } catch (err) {
                console.error("Błąd pobierania gier:", err)
            } finally {
                setLoading(false)
            }
        }

        fetchGames()
    }, [])


    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen text-lg text-gray-400">
                Wczytywanie gier...
            </div>
        )
    }
    // const data = Route.useLoaderData()
    return (
        <div>
            <main className="flex-1 pt-6 space-y-12">
                <section className="mx-auto px-4">
                    <TopGamesCarousel games={topGames}/>
                    <NewGamesSection games={newGames}/>
                </section>
            </main>
        </div>
    )
}
