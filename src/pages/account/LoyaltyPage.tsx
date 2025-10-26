import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Award, Trophy, TrendingUp } from 'lucide-react'

const levels = [
    { name: 'Nowicjusz Kowal', pointsRequired: 0, discount: 0, color: 'gray-400' },
    { name: 'Uczeń Kuźni', pointsRequired: 1000, discount: 3, color: 'blue-400' },
    { name: 'Czeladnik Kuźni', pointsRequired: 2500, discount: 6, color: 'green-400' },
    { name: 'Mistrz Kuźni', pointsRequired: 5000, discount: 9, color: 'purple-400' },
    { name: 'Legendarny Kowal', pointsRequired: 10000, discount: 12, color: 'yellow-400' },
    { name: 'Wielki Mistrz Kluczy', pointsRequired: 20000, discount: 15, color: 'orange-400' },
]

export function LoyaltyPage() {
    const currentPoints = 5450
    const currentLevelIndex = 3
    const currentLevel = levels[currentLevelIndex]
    const nextLevel = levels[currentLevelIndex + 1]
    const progressToNext = nextLevel
        ? ((currentPoints - currentLevel.pointsRequired) / (nextLevel.pointsRequired - currentLevel.pointsRequired)) * 100
        : 100

    return (
        <div className="flex justify-center px-4 sm:px-6 lg:px-8 py-10">
            <div className="w-full max-w-4xl space-y-8">
                <Card className="bg-gradient-to-br from-[#D4A44A]/20 to-[#B8873D]/20 border-[#D4A44A]/50 shadow-lg">
                    <CardContent className="p-8">
                        <div className="text-center mb-6">
                            <div className={`inline-flex items-center justify-center bg-${currentLevel.color}/20 p-6 rounded-full mb-4`}>
                                <Trophy className={`h-12 w-12 text-${currentLevel.color}`}/>
                            </div>
                            <h2 className={`text-3xl font-bold mb-2 text-${currentLevel.color}`}>{currentLevel.name}</h2>
                            <p className="text-gray-300 text-lg">
                                Aktualny rabat:{' '}
                                <span className={`text-${currentLevel.color} font-bold`}>{currentLevel.discount}%</span>
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Twoje KeyPoints</span>
                                <span className="text-[#D4A44A] font-bold text-lg">{currentPoints}</span>
                            </div>
                            <Progress value={progressToNext} className="h-3 bg-[#3A3A3A]" />
                            {nextLevel && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Do następnego poziomu:</span>
                                    <span className="text-white font-semibold">
                                        {nextLevel.pointsRequired - currentPoints} KeyPoints
                                    </span>
                                </div>
                            )}
                        </div>

                        {nextLevel && (
                            <div className="mt-6 p-4 bg-[#2A2A2A] rounded-lg border border-[#3A3A3A]">
                                <div className="flex items-center gap-3">
                                    <TrendingUp className="h-5 w-5 text-[#D4A44A]" />
                                    <div>
                                        <p className="text-sm text-gray-400">Następny poziom</p>
                                        <p className={`font-bold text-${nextLevel.color}`}>{nextLevel.name}</p>
                                        <p className="text-sm text-gray-300">
                                            Rabat:{' '}
                                            <span className="text-[#D4A44A] font-bold">{nextLevel.discount}%</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="bg-[#1F1F1F] border-[#3A3A3A] shadow-md">
                    <CardHeader>
                        <CardTitle className="text-white">Wszystkie poziomy</CardTitle>
                        <CardDescription className="text-gray-400">
                            Droga do Wielkiego Mistrza Kluczy
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {levels.map((level, index) => (
                                <div
                                    key={index}
                                    className={`p-4 rounded-lg border-2 ${
                                        index === currentLevelIndex
                                            ? 'bg-[#D4A44A]/10 border-[#D4A44A]'
                                            : 'bg-[#2A2A2A] border-[#3A3A3A]'
                                    }`}
                                >
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <Trophy className={`h-6 w-6 text-${level.color}`} />
                                            <div>
                                                <p className={`font-bold text-${level.color}`}>{level.name}</p>
                                                <p className="text-sm text-gray-400">
                                                    {level.pointsRequired} KeyPoints
                                                </p>
                                            </div>
                                        </div>
                                        <Badge variant="outline" className={`border-current text-${level.color}`}>
                                            {level.discount}% rabatu
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-500/30 shadow-md">
                    <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                            <div className="bg-blue-500 p-3 rounded-lg">
                                <Award className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white mb-2">
                                    Jak zdobywać KeyPoints?
                                </h3>
                                <p className="text-sm text-gray-300 mb-3">
                                    Za każdy zakup otrzymujesz KeyPoints, które przybliżają Cię do następnego
                                    poziomu i wyższych rabatów!
                                </p>
                                <ul className="text-sm text-gray-300 space-y-1">
                                    <li>• Każdy zakup = więcej KeyPoints</li>
                                    <li>• Wyższy poziom = stały rabat na wszystkie zakupy</li>
                                    <li>• Rabaty kumulują się z promocjami</li>
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
