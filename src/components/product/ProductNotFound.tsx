import { AlertTriangle, ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "@tanstack/react-router";

export function ProductNotFound() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate({ to: "/products" });
  };

  return (
    <div className="flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-16">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-500/20 border-2 border-red-500/40">
            <AlertTriangle className="w-10 h-10 text-red-400" />
          </div>
          <h2 className="text-3xl font-bold text-red-400">
            Nie znaleziono produktu
          </h2>
          <p className="text-gray-400 text-base">
            Wygląda na to, że ten produkt nie istnieje lub został usunięty.
          </p>
        </div>

        <Card className="bg-gradient-to-br from-[#2A2A2A] to-[#1C1C1C] border-[#3A3A3A] shadow-lg">
          <CardContent className="p-6 space-y-6">
            <div className="flex items-start gap-4">
              <div className="bg-red-500/20 p-2 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Co mogło się stać?
                </h3>
                <p className="text-sm text-gray-300 leading-relaxed">
                  Produkt mógł zostać usunięty, przeniesiony lub jego dane są tymczasowo niedostępne.
                  Sprawdź później lub wróć do strony głównej, aby kontynuować zakupy.
                </p>
              </div>
            </div>

            <button
              onClick={handleBack}
              className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-red-500 hover:bg-red-600 font-semibold rounded-lg transition-all duration-200"
            >
              <ArrowLeft className="h-5 w-5" />
              Wróć do listy produktów
            </button>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-gray-500">
          <p>
            Potrzebujesz pomocy?{" "}
            <a
              href="/support"
              className="text-[#D4A44A] hover:text-[#C4944A] underline"
            >
              Skontaktuj się z nami
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
