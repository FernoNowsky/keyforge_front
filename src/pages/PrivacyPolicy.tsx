"use client"

import { NavigationBar } from "@/components/NavigationBar"
import { Footer } from "@/components/Footer"

export function PrivacyPolicy() {

    const user = { isLoggedIn: false, username: "GamerX" }

    return (

        <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#1C1C1C] to-[#2A2A2A] text-[#F8F8F8]">
            <NavigationBar isLoggedIn={user.isLoggedIn} username={user.username} />
            <main className="flex-1 pt-6">
                <section className="max-w-6xl mx-auto px-4">

                    <h1 className="text-3xl font-bold text-[#D4A44A] mb-6">Polityka prywatności</h1>

                    <p className="mb-4">
                        W KeyForge cenimy prywatność naszych użytkowników i dokładamy wszelkich starań,
                        aby chronić przekazywane nam dane osobowe. Niniejsza Polityka prywatności
                        opisuje sposób gromadzenia, wykorzystywania i zabezpieczania danych użytkowników.
                    </p>

                    <h2 className="text-xl font-semibold mt-6 mb-2">1. Administrator danych</h2>
                    <p className="mb-4">
                        Administratorem danych osobowych jest KeyForge Sp. z o.o. z siedzibą w Warszawie,
                        ul. Pixelowa 12, 00-001 Warszawa.
                    </p>

                    <h2 className="text-xl font-semibold mt-6 mb-2">2. Zakres zbieranych danych</h2>
                    <p className="mb-4">
                        Podczas korzystania z naszej platformy możemy zbierać dane takie jak imię,
                        adres e-mail, adres dostawy, numer telefonu oraz dane dotyczące płatności.
                    </p>

                    <h2 className="text-xl font-semibold mt-6 mb-2">3. Cel przetwarzania danych</h2>
                    <ul className="list-disc pl-6 mb-4">
                        <li>realizacja zamówień i płatności,</li>
                        <li>obsługa konta użytkownika,</li>
                        <li>poprawa jakości usług i bezpieczeństwa serwisu.</li>
                    </ul>

                    <h2 className="text-xl font-semibold mt-6 mb-2">4. Udostępnianie danych</h2>
                    <p className="mb-4">
                        Dane osobowe nie są udostępniane osobom trzecim, z wyjątkiem przypadków wymaganych
                        przez prawo lub niezbędnych do realizacji zamówienia (np. operatorzy płatności, firmy kurierskie).
                    </p>

                    <h2 className="text-xl font-semibold mt-6 mb-2">5. Prawa użytkownika</h2>
                    <p className="mb-4">
                        Użytkownik ma prawo do wglądu, sprostowania, usunięcia lub ograniczenia przetwarzania swoich danych,
                        a także prawo do cofnięcia zgody w dowolnym momencie.
                    </p>

                    <p className="mt-6 text-sm text-muted-foreground">
                        Ostatnia aktualizacja: {new Date().toLocaleDateString("pl-PL")}
                    </p>
                </section>
            </main>
            <Footer />
        </div>
    )
}
