"use client"

import { NavigationBar } from "@/components/NavigationBar"
import { Footer } from "@/components/Footer"

export function TermsOfService() {

    const user = { isLoggedIn: false, username: "GamerX" }


    return (

        <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#1C1C1C] to-[#2A2A2A] text-[#F8F8F8]">
            <NavigationBar isLoggedIn={user.isLoggedIn} username={user.username} />
            <main className="flex-1 pt-6 overflow-hidden">
                <section className="max-w-6xl mx-auto px-4">
            <h1 className="text-3xl font-bold text-[#D4A44A] mb-6">Regulamin sklepu KeyForge</h1>

            <p className="mb-4">
                Niniejszy regulamin określa zasady korzystania ze sklepu internetowego KeyForge
                dostępnego pod adresem <strong>www.keyforge.com</strong>.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-2">1. Postanowienia ogólne</h2>
            <p className="mb-4">
                Sklep KeyForge prowadzony jest przez KeyForge Sp. z o.o. z siedzibą w Warszawie.
                Regulamin określa prawa i obowiązki Sprzedawcy oraz Klienta.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-2">2. Zamówienia i płatności</h2>
            <ul className="list-disc pl-6 mb-4">
                <li>Zamówienia można składać 24/7 przez stronę internetową sklepu.</li>
                <li>Płatności obsługiwane są przez bezpiecznych operatorów płatności.</li>
                <li>Po złożeniu zamówienia klient otrzymuje potwierdzenie e-mail.</li>
            </ul>

            <h2 className="text-xl font-semibold mt-6 mb-2">3. Dostawa</h2>
            <p className="mb-4">
                Produkty cyfrowe (gry, kody, subskrypcje) dostarczane są drogą elektroniczną na adres e-mail
                wskazany w zamówieniu, zazwyczaj w ciągu kilku minut po zaksięgowaniu płatności.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-2">4. Reklamacje i zwroty</h2>
            <p className="mb-4">
                Klient ma prawo do złożenia reklamacji w przypadku wad produktu lub problemów z dostarczeniem kodu.
                Zwrot środków możliwy jest tylko, jeśli kod nie został jeszcze wykorzystany.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-2">5. Odpowiedzialność</h2>
            <p className="mb-4">
                Sklep nie ponosi odpowiedzialności za błędne dane podane przez klienta ani za szkody wynikłe z
                nieprawidłowego użytkowania produktu.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-2">6. Postanowienia końcowe</h2>
            <p className="mb-4">
                Regulamin może ulec zmianie. Aktualna wersja jest zawsze dostępna na stronie sklepu.
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
