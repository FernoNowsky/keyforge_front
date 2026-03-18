import { Card, CardContent } from "@/components/ui/card";
import { LogIn, Lock, AlertCircle } from "lucide-react";
import { getKeycloakInstance } from "@/KeycloakContext.tsx";
import { useEffect, useState } from "react";

export function LoginNeededError() {
  const keycloak = getKeycloakInstance();
  const [isKeycloakDisabled, setIsKeycloakDisabled] = useState(false);

  useEffect(() => {
    setIsKeycloakDisabled(!keycloak);
  }, [keycloak]);

  const handleLogin = () => {
    if (isKeycloakDisabled) {
      alert("System logowania jest obecnie niedostępny. Spróbuj ponownie później");
      return;
    }
    keycloak?.login();
  };

  return (
    <div className="flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-10">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#D4A44A]/20 border-2 border-[#D4A44A]/40">
            <Lock className="w-10 h-10 text-[#D4A44A]" />
          </div>
          <h2 className="text-3xl font-bold text-[#D4A44A]">
            Wymagane logowanie
          </h2>
          <p className="text-gray-400 text-base">
            Aby uzyskać dostęp do tego zasobu, musisz być zalogowany
          </p>
        </div>

        <Card className="bg-gradient-to-br from-[#2A2A2A] to-[#1C1C1C] border-[#3A3A3A] shadow-lg">
          <CardContent className="p-6 space-y-6">
            <div className="flex items-start gap-4">
              <div className="bg-[#D4A44A]/20 p-2 rounded-lg">
                <AlertCircle className="h-5 w-5 text-[#D4A44A]" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Dlaczego muszę się zalogować?
                </h3>
                <p className="text-sm text-gray-300 leading-relaxed">
                  Ten zasób jest dostępny tylko dla zalogowanych użytkowników.
                  Logowanie pozwala nam zapewnić bezpieczeństwo Twoich danych
                  i spersonalizować Twoje doświadczenia.
                </p>
              </div>
            </div>
            <button
              onClick={handleLogin}
              disabled={isKeycloakDisabled}
              className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-[#D4A44A] hover:bg-[#C4944A] disabled:!cursor-not-allowed font-semibold rounded-lg transition-all duration-200"
            >
              <LogIn className="h-5 w-5" />
              Zaloguj się
            </button>
            {isKeycloakDisabled && (
              <div className="text-center text-sm text-red-400 flex items-center justify-center gap-2">
                <AlertCircle className="h-4 w-4" />
                System logowania jest obecnie niedostępny
              </div>
            )}
          </CardContent>
        </Card>
        <div className="text-center text-sm text-gray-500">
          <p>
            Masz problem z logowaniem?{" "}
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