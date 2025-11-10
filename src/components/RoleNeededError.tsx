import { Card, CardContent } from "@/components/ui/card";
import { ShieldAlert, Home, Info } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

export function RoleNeededError() {
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
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-500/20 border-2 border-red-500/40">
            <ShieldAlert className="w-10 h-10 text-red-400" />
          </div>
          <h2 className="text-3xl font-bold text-red-400">
            Brak uprawnień
          </h2>
          <p className="text-gray-400 text-base">
            Nie posiadasz wymaganych uprawnień do przeglądania tego zasobu
          </p>
        </div>
        <Card className="bg-gradient-to-br from-[#2A2A2A] to-[#1C1C1C] border-[#3A3A3A] shadow-lg">
          <CardContent className="p-6 space-y-6">
            <div className="flex items-start gap-4">
              <div className="bg-red-500/20 p-2 rounded-lg">
                <Info className="h-5 w-5 text-red-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Dlaczego widzę ten komunikat?
                </h3>
                <p className="text-sm text-gray-300 leading-relaxed">
                  Ten zasób jest dostępny tylko dla użytkowników z określonymi
                  uprawnieniami. Twoje obecne konto nie ma dostępu do tej
                  funkcjonalności.
                </p>
              </div>
            </div>
            <div className="border-t border-[#3A3A3A]"></div>
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-gray-200">
                Co mogę zrobić?
              </h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-[#D4A44A] mt-0.5">•</span>
                  <span>
                    Skontaktuj się z administratorem, jeśli uważasz, że
                    powinieneś mieć dostęp
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#D4A44A] mt-0.5">•</span>
                  <span>
                    Sprawdź, czy korzystasz z właściwego konta użytkownika
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#D4A44A] mt-0.5">•</span>
                  <span>Wróć do strony głównej i przeglądaj dostępne zasoby</span>
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