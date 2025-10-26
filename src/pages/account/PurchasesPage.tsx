import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Download, Star } from 'lucide-react'
import { PlatformBadge } from '@/components/PlatformBadge'

const purchases = [
    {
        id: 'ORD-2024-1234',
        date: '2024-10-20',
        platform: 'Steam',
        price: 199.99,
        status: 'Dostarczono',
        hasReview: false,
        count: 2,
    },
    {
        id: 'ORD-2024-1233',
        date: '2024-10-18',
        platform: 'Steam',
        price: 249.99,
        status: 'Dostarczono',
        hasReview: true,
        count: 1,
    },
    {
        id: 'ORD-2024-1232',
        date: '2024-10-15',
        platform: 'Epic Games',
        price: 279.99,
        status: 'Dostarczono',
        hasReview: false,
        count: 3,
    },
    {
        id: 'ORD-2024-1231',
        date: '2024-10-10',
        platform: 'Rockstar',
        price: 189.99,
        status: 'Dostarczono',
        hasReview: true,
        count: 1,
    },
]

export default function PurchasesPage() {
    return (
        <div className="flex justify-center px-4 sm:px-6 lg:px-8 py-10">
            <div className="w-full max-w-3xl space-y-8">
                <Card className="bg-[#1F1F1F] border-[#3A3A3A] shadow-md">
                    <CardHeader>
                        <CardTitle className="text-white text-lg sm:text-xl">Ostatnie zamówienia</CardTitle>
                        <CardDescription className="text-gray-400 text-sm">
                            Wszystkie Twoje zakupy w KeyForge
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Accordion type="single" collapsible className="w-full">
                            {purchases.map((purchase) => (
                                <AccordionItem
                                    key={purchase.id}
                                    value={purchase.id}
                                    className="border-[#3A3A3A] !rounded-none"
                                >
                                    <AccordionTrigger className="hover:no-underline bg-[#2A2A2A] px-4 py-3 rounded-none">
                                        <div className="flex items-center justify-between w-full">
                                            <div className="flex flex-col text-left">
                                                <p className="font-semibold text-white text-sm sm:text-base">
                                                    {purchase.id}{' '}
                                                    <span className="text-gray-400 text-xs">
                                                        ({purchase.count} {purchase.count === 1 ? 'gra' : 'gry'})
                                                    </span>
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <PlatformBadge platform={purchase.platform} />
                                                <span className="text-[#D4A44A] font-bold text-sm sm:text-base">
                                                    {purchase.price.toFixed(2)} PLN
                                                </span>
                                            </div>
                                        </div>
                                    </AccordionTrigger>

                                    <AccordionContent className="bg-[#262626] px-5 py-4 border-t border-[#3A3A3A] !rounded-none">
                                        <div className="space-y-4 text-sm">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-gray-400">Data zakupu</p>
                                                    <p className="text-white font-semibold">{purchase.date}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-400">Status</p>
                                                    <Badge className="bg-green-500/20 text-green-400 border-green-500/50 px-2 py-0.5 text-xs">
                                                        {purchase.status}
                                                    </Badge>
                                                </div>
                                            </div>

                                            <Separator className="bg-[#3A3A3A]" />

                                            <div className="flex flex-wrap gap-3">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="border-[#D4A44A] text-[#D4A44A] hover:bg-[#D4A44A] hover:text-black text-xs sm:text-sm"
                                                >
                                                    <Download className="h-4 w-4 mr-2" />
                                                    Pobierz fakturę
                                                </Button>
                                                {/*TODO: Add reviewForm*/}
                                                {!purchase.hasReview && (
                                                    <Button
                                                        size="sm"
                                                        className="bg-[#D4A44A] text-black hover:bg-[#B8873D] text-xs sm:text-sm"
                                                    >
                                                        <Star className="h-4 w-4 mr-2" />
                                                        Wystaw opinię
                                                    </Button>
                                                )}

                                                {purchase.hasReview && (
                                                    <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50 px-2 py-0.5 text-xs">
                                                        Opinia wystawiona
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
