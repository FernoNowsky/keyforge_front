import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Key, Copy, Check } from 'lucide-react'
import { PlatformBadge } from '@/components/PlatformBadge'

const keys = [
    { id: 1, game: 'Cyberpunk 2077', platform: 'Steam', key: 'XXXX-XXXX-XXXX-XXXX', purchaseDate: '2024-10-20', revealed: false },
    { id: 2, game: 'Elden Ring', platform: 'Steam', key: 'YYYY-YYYY-YYYY-YYYY', purchaseDate: '2024-10-18', revealed: false },
    { id: 3, game: 'Hogwarts Legacy', platform: 'Epic Games', key: 'ZZZZ-ZZZZ-ZZZZ-ZZZZ', purchaseDate: '2024-10-15', revealed: false },
    { id: 4, game: 'Red Dead Redemption 2', platform: 'Rockstar', key: 'WWWW-WWWW-WWWW-WWWW', purchaseDate: '2024-10-10', revealed: false },
]

export default function KeysPage() {
    const [revealedKeys, setRevealedKeys] = useState<number[]>([])
    const [copiedKey, setCopiedKey] = useState<number | null>(null)

    const toggleKeyReveal = (id: number) => {
        setRevealedKeys(prev =>
            prev.includes(id) ? prev.filter(k => k !== id) : [...prev, id]
        )
    }

    const copyKey = (id: number, key: string) => {
        navigator.clipboard.writeText(key)
        setCopiedKey(id)
        setTimeout(() => setCopiedKey(null), 2000)
    }

    return (
        <div className="flex justify-center px-4 sm:px-6 lg:px-8 py-10">
            <div className="w-full max-w-4xl space-y-8">
                <div className="grid gap-5">
                    {keys.map((keyData) => (
                        <Card
                            key={keyData.id}
                            className="bg-[#1F1F1F] border-[#3A3A3A] overflow-hidden hover:border-[#D4A44A]/50 transition-all shadow-md"
                        >
                            <CardContent className="p-4 sm:p-5">
                                <div className="flex items-center gap-4">
                                    <div className="flex-shrink-0 flex items-center justify-center bg-[#2A2A2A] p-3 rounded-lg h-16 w-16">
                                        <Key className="h-7 w-7 text-[#D4A44A]" />
                                    </div>

                                    <div className="flex-1">
                                        <h3 className="text-base sm:text-lg font-bold text-white mb-1">{keyData.game}</h3>
                                        <div className="flex flex-wrap items-center gap-2 mb-3">
                                            <PlatformBadge platform={keyData.platform} />
                                            <span className="text-xs sm:text-sm text-gray-400">
                                                Zakupiono: {keyData.purchaseDate}
                                            </span>
                                        </div>

                                        <div className="bg-[#2A2A2A] p-3 rounded-lg border border-[#3A3A3A] relative overflow-hidden">
                                            {!revealedKeys.includes(keyData.id) && (
                                                <div className="absolute inset-0 backdrop-blur-sm bg-[#2A2A2A]/90 flex items-center justify-center">
                                                    <Button
                                                        size="sm"
                                                        className="bg-[#D4A44A] text-black hover:bg-[#B8873D]"
                                                        onClick={() => toggleKeyReveal(keyData.id)}
                                                    >
                                                        <Key className="h-4 w-4 mr-2" />
                                                        Pokaż klucz
                                                    </Button>
                                                </div>
                                            )}
                                            <div className="flex items-center justify-between">
                                                <code className="text-[#D4A44A] font-mono text-sm sm:text-base font-bold">
                                                    {revealedKeys.includes(keyData.id)
                                                        ? keyData.key
                                                        : 'XXXX-XXXX-XXXX-XXXX'}
                                                </code>
                                                {revealedKeys.includes(keyData.id) && (
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="text-[#D4A44A] hover:bg-[#3A3A3A]"
                                                        onClick={() => copyKey(keyData.id, keyData.key)}
                                                    >
                                                        {copiedKey === keyData.id ? (
                                                            <>
                                                                <Check className="h-4 w-4 mr-1" />
                                                                Skopiowano!
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Copy className="h-4 w-4 mr-1" />
                                                                Kopiuj
                                                            </>
                                                        )}
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <Card className="bg-gradient-to-br from-[#D4A44A]/10 to-[#B8873D]/10 border-[#D4A44A]/30 shadow-lg">
                    <CardContent className="p-5">
                        <div className="flex items-start gap-3">
                            <div className="bg-[#D4A44A] p-2.5 rounded-lg flex items-center justify-center h-10 w-10">
                                <Key className="h-5 w-5 text-black" />
                            </div>
                            <div>
                                <h3 className="text-base sm:text-lg font-bold text-white mb-1.5">Jak aktywować klucz?</h3>
                                <ul className="text-sm text-gray-300 space-y-1">
                                    <li>1. Kliknij „Pokaż klucz”, aby ujawnić swój kod</li>
                                    <li>2. Skopiuj klucz do schowka</li>
                                    <li>3. Przejdź do odpowiedniej platformy (Steam, Origin, Epic Games, Uplay)</li>
                                    <li>4. Aktywuj klucz w sekcji „Aktywuj produkt”</li>
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
