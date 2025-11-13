import { Card, CardContent } from "@/components/ui/card";
import { Compass, Home, Info } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

export function NotFoundError() {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate({ to: "/" });
  };

  const handleGoSupport = () => {
    navigate({ to: "/support" });
  };

  return (
    <div className="flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-10">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#D4A44A]/20 border-2 border-[#D4A44A]/40">
            <Compass className="w-10 h-10 text-[#D4A44A]" />
          </div>
          <h2 className="text-3xl font-bold text-[#D4A44A]">
            Nie znaleziono strony
          </h2>
          <p className="text-gray-400 text-base">
            Strona, której szukasz, mogła zostać przeniesiona lub nie istnieje.
          </p>
        </div>

        <Card className="bg-gradient-to-br from-[#2A2A2A] to-[#1C1C1C] border-[#3A3A3A] shadow-lg">
          <CardContent className="p-6 space-y-6">
            <div className="flex items-start gap-4">
              <div className="bg-[#D4A44A]/20 p-2 rounded-lg">
                <Info className="h-5 w-5 text-[#D4A44A]" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Co mogło się stać?
                </h3>
                <p className="text-sm text-gray-300 leading-relaxed">
                  Adres, który wpisałeś, nie prowadzi do żadnej istniejącej strony.
                  Możliwe, że link jest nieaktualny lub strona została usunięta.
                </p>
              </div>
            </div>

            <div className="border-t border-[#3A3A3A]"></div>

            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-gray-200">
                Co możesz zrobić?
              </h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-[#D4A44A] mt-0.5">•</span>
                  <span>Sprawdź, czy adres strony jest poprawny</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#D4A44A] mt-0.5">•</span>
                  <span>Wróć na stronę główną i spróbuj ponownie</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#D4A44A] mt-0.5">•</span>
                  <span>Skontaktuj się z nami, jeśli uważasz, że to błąd</span>
                </li>
              </ul>
            </div>

            <button
              onClick={handleGoHome}
              className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-[#D4A44A] font-semibold rounded-lg"
            >
              <Home className="h-5 w-5" />
              Wróć do strony głównej
            </button>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-gray-500">
          <p>
            Potrzebujesz pomocy?{" "}
            <a
              href="/support"
              onClick={handleGoSupport}
              className="text-[#D4A44A] hover:text-[#C4944A] underline"
            >
              Skontaktuj się z zespołem wsparcia
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
