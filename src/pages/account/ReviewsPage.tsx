import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Star } from 'lucide-react'

const reviews = [
    { id: 1, game: 'Elden Ring', rating: 5, review: 'Niesamowita gra! Grafika i rozgrywka na najwyższym poziomie. Polecam każdemu fanowi RPG.', date: '2025-10-19', status: 'Zaakceptowana' },
    { id: 2, game: 'Red Dead Redemption 2', rating: 5, review: 'Epicka przygoda na Dzikim Zachodzie. Historia wciąga od pierwszej minuty.', date: '2025-10-10', status: 'Zaakceptowana' },
    { id: 3, game: 'The Witcher 3', rating: 5, review: 'Najlepsza gra RPG w jaką grałem. Wspaniała fabuła i świat.', date: '2025-10-05', status: 'Zaakceptowana' },
    { id: 4, game: 'Cyberpunk 2077', rating: 4, review: 'Po poprawkach gra prezentuje się świetnie. Fascynujący świat Night City.', date: '2025-09-28', status: 'Zaakceptowana' },
]

export default function ReviewsPage() {
    return (
        <div className="flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-10">
            <div className="w-full max-w-3xl space-y-8">
                <div className="text-center space-y-2">
                    <h2 className="text-2xl sm:text-3xl font-bold text-[#D4A44A]">
                        Twoje opinie
                    </h2>
                    <p className="text-gray-400 text-sm sm:text-base">
                        Sprawdź, co napisałeś o swoich ulubionych grach
                    </p>
                </div>
                <div className="grid gap-5">
                    {reviews.map((review) => (
                        <Card
                            key={review.id}
                            className="bg-[#1F1F1F] border-[#3A3A3A] hover:border-[#D4A44A]/50 hover:scale-[1.02] transition-all duration-200"
                        >
                            <CardContent className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-lg font-bold text-white mb-2">{review.game}</h3>
                                        <div className="flex items-center gap-3">
                                            <div className="flex gap-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`h-4 w-4 ${
                                                            i < review.rating
                                                                ? 'fill-yellow-400 text-yellow-400 drop-shadow-[0_0_4px_rgba(212,164,74,0.6)]'
                                                                : 'text-gray-600'
                                                        }`}
                                                    />
                                                ))}
                                            </div>
                                            <span className="text-sm text-gray-400">{review.date}</span>
                                        </div>
                                    </div>
                                    <Badge className="bg-green-500/20 text-green-400 border-green-500/50 text-xs px-2 py-0.5">
                                        {review.status}
                                    </Badge>
                                </div>
                                <p className="text-gray-300 leading-relaxed text-sm sm:text-base">{review.review}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Sekcja informacyjna */}
                <Card className="bg-gradient-to-br from-[#2A2A2A] to-[#1C1C1C] border-[#3A3A3A] shadow-md hover:shadow-[#D4A44A]/20 transition-all duration-300">
                    <CardContent className="p-6 flex flex-col sm:flex-row items-center sm:items-start gap-4">
                        <div className="bg-[#D4A44A]/20 p-3 rounded-xl flex items-center justify-center">
                            <Star className="h-6 w-6 text-[#D4A44A]" />
                        </div>
                        <div className="text-center sm:text-left">
                            <h3 className="text-lg font-semibold text-white mb-2">Twój wkład ma znaczenie ⭐</h3>
                            <p className="text-sm text-gray-300">
                                Każda opinia jest analizowana przez nasz system AI, który automatycznie wykrywa wulgaryzmy i spam.
                                AI pomaga też tworzyć streszczenia opinii, aby inni mogli szybciej znaleźć interesujące recenzje.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
