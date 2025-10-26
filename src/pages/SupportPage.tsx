import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.tsx'
import { Button } from '@/components/ui/button.tsx'
import { Separator } from '@/components/ui/separator.tsx'
import { MessageSquare, Phone, MapPin, Clock, Mail } from 'lucide-react'

export default function SupportPage() {
    return (
        <div className="flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-10">
            <div className="w-full max-w-4xl space-y-10">
                <div className="text-center space-y-2">
                    <h2 className="text-2xl sm:text-3xl font-bold text-[#D4A44A]">
                        Centrum Pomocy KeyForge
                    </h2>
                    <p className="text-gray-400 text-sm sm:text-base">
                        Skontaktuj się z nami lub znajdź odpowiedzi na najczęstsze pytania
                    </p>
                </div>
                <Card className="bg-gradient-to-br from-green-500/15 to-green-600/15 border-green-500/40 hover:border-green-400/60 transition-all duration-300 hover:scale-[1.02]">
                    <CardContent className="p-10 text-center">
                        <div className="inline-flex items-center justify-center bg-green-500 p-6 rounded-full mb-5 shadow-lg shadow-green-700/30">
                            <Phone className="h-12 w-12 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">WhatsApp</h2>
                        <p className="text-gray-300 mb-6 text-sm sm:text-base">Napisz do nas w każdej chwili</p>
                        <a
                            href="https://wa.me/48123456789"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block"
                        >
                            <Button
                                size="lg"
                                className="text-white hover:bg-green-600 text-lg px-8 py-6 transition-all duration-200"
                            >
                                <MessageSquare className="h-5 w-5 mr-2" />
                                +48 123 456 789
                            </Button>
                        </a>
                    </CardContent>
                </Card>
                <div className="grid md:grid-cols-2 gap-8">
                    <Card className="bg-[#1F1F1F] border-[#3A3A3A] hover:border-[#D4A44A]/40 transition-all duration-300">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2 text-lg">
                                <MapPin className="h-5 w-5 text-[#D4A44A]" />
                                Siedziba firmy
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm text-gray-400">Adres</p>
                                <p className="text-white font-semibold">ul. Piotrkowska 123</p>
                                <p className="text-white font-semibold">90-001 Łódź, Polska</p>
                            </div>
                            <Separator className="bg-[#3A3A3A]" />
                            <div>
                                <p className="text-sm text-gray-400">E-mail</p>
                                <a href="mailto:kontakt@keyforge.pl" className="text-[#D4A44A] hover:underline flex items-center gap-2">
                                    <Mail className="h-4 w-4" />
                                    kontakt@keyforge.pl
                                </a>
                            </div>
                            <div>
                                <p className="text-sm text-gray-400">Telefon</p>
                                <p className="text-white font-medium">+48 123 456 789</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-[#1F1F1F] border-[#3A3A3A] hover:border-[#D4A44A]/40 transition-all duration-300">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2 text-lg">
                                <Clock className="h-5 w-5 text-[#D4A44A]" />
                                Godziny pracy
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-400">Poniedziałek - Piątek</span>
                                <span className="text-white font-semibold">9:00 - 18:00</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Sobota</span>
                                <span className="text-white font-semibold">10:00 - 15:00</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Niedziela</span>
                                <span className="text-white font-semibold">Nieczynne</span>
                            </div>
                            <Separator className="bg-[#3A3A3A] my-4" />
                            <div className="bg-[#2A2A2A] p-3 rounded-lg border border-[#3A3A3A]">
                                <p className="text-sm text-gray-300 text-center sm:text-left">
                                    <span className="text-[#D4A44A] font-semibold">WhatsApp dostępny 24/7</span> — odpowiadamy nawet poza godzinami pracy!
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <Card className="bg-[#1F1F1F] border-[#3A3A3A] hover:border-[#D4A44A]/40 transition-all duration-300">
                    <CardHeader>
                        <CardTitle className="text-white text-lg">Znajdź nas na mapie</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="w-full h-96 bg-[#2A2A2A] rounded-xl overflow-hidden shadow-md shadow-black/30">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2468.8644665926873!2d19.454233876918384!3d51.76894397184857!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x471a34e3b21c68cf%3A0xd10d5c2b7c2a6df!2sPiotrkowska%20123%2C%2090-001%20%C5%81%C3%B3d%C5%BA!5e0!3m2!1spl!2spl!4v1698765432100!5m2!1spl!2spl"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Lokalizacja KeyForge"
                            ></iframe>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-500/30 hover:border-blue-400/40 transition-all duration-300">
                    <CardContent className="p-6 flex flex-col sm:flex-row items-start gap-4">
                        <div className="bg-blue-500 p-3 rounded-lg shadow-md shadow-blue-900/40">
                            <MessageSquare className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white mb-3">Najczęściej zadawane pytania</h3>
                            <div className="space-y-3 text-sm text-gray-300">
                                <div>
                                    <p className="font-semibold text-white mb-1">Jak długo czekam na klucz po zakupie?</p>
                                    <p>Klucze są dostarczane natychmiast po pomyślnej płatności.</p>
                                </div>
                                <div>
                                    <p className="font-semibold text-white mb-1">Co jeśli klucz nie działa?</p>
                                    <p>Skontaktuj się z nami przez WhatsApp, a pomożemy rozwiązać problem.</p>
                                </div>
                                <div>
                                    <p className="font-semibold text-white mb-1">Czy mogę zwrócić zakupiony klucz?</p>
                                    <p>
                                        Zwroty kluczy cyfrowych są możliwe w szczególnych przypadkach — napisz do naszego działu obsługi klienta.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
