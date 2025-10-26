import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { User, Mail, Lock } from 'lucide-react'

export default function SettingsPage() {
    return (
        <div className="flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-10">
            <div className="w-full max-w-3xl space-y-8">
                <div className="text-center space-y-2">
                    <h2 className="text-2xl sm:text-3xl font-bold text-[#D4A44A]">
                        Ustawienia konta
                    </h2>
                    <p className="text-gray-400 text-sm sm:text-base">
                        Zarządzaj swoim profilem, hasłem i bezpieczeństwem
                    </p>
                </div>
                <Card className="bg-[#1F1F1F] border-[#3A3A3A] hover:border-[#D4A44A]/40 transition-all duration-300 hover:scale-[1.01]">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2 text-lg">
                            <User className="h-5 w-5 text-[#D4A44A]" />
                            Nazwa użytkownika
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="username" className="text-gray-400">Aktualna nazwa</Label>
                            <Input
                                id="username"
                                defaultValue="Mistrz Kuźni"
                                className="bg-[#2A2A2A] border-[#3A3A3A] text-white mt-2 focus:ring-1 focus:ring-[#D4A44A]"
                            />
                        </div>
                        <Button className="bg-[#D4A44A] text-black hover:bg-[#B8873D] font-semibold">
                            Zapisz zmiany
                        </Button>
                    </CardContent>
                </Card>
                <Card className="bg-[#1F1F1F] border-[#3A3A3A] hover:border-[#D4A44A]/40 transition-all duration-300 hover:scale-[1.01]">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2 text-lg">
                            <Mail className="h-5 w-5 text-[#D4A44A]" />
                            Adres e-mail
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="email" className="text-gray-400">Aktualny e-mail</Label>
                            <Input
                                id="email"
                                type="email"
                                defaultValue="user@keyforge.com"
                                className="bg-[#2A2A2A] border-[#3A3A3A] text-white mt-2 focus:ring-1 focus:ring-[#D4A44A]"
                            />
                        </div>
                        <Button className="bg-[#D4A44A] text-black hover:bg-[#B8873D] font-semibold">
                            Zmień e-mail
                        </Button>
                    </CardContent>
                </Card>
                <Card className="bg-[#1F1F1F] border-[#3A3A3A] hover:border-[#D4A44A]/40 transition-all duration-300 hover:scale-[1.01]">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2 text-lg">
                            <Lock className="h-5 w-5 text-[#D4A44A]" />
                            Zmiana hasła
                        </CardTitle>
                        <CardDescription className="text-gray-400">
                            Hasło musi zawierać minimum 8 znaków
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="current-password" className="text-gray-400">Aktualne hasło</Label>
                            <Input
                                id="current-password"
                                type="password"
                                className="bg-[#2A2A2A] border-[#3A3A3A] text-white mt-2 focus:ring-1 focus:ring-[#D4A44A]"
                            />
                        </div>
                        <div>
                            <Label htmlFor="new-password" className="text-gray-400">Nowe hasło</Label>
                            <Input
                                id="new-password"
                                type="password"
                                className="bg-[#2A2A2A] border-[#3A3A3A] text-white mt-2 focus:ring-1 focus:ring-[#D4A44A]"
                            />
                        </div>
                        <div>
                            <Label htmlFor="confirm-password" className="text-gray-400">Potwierdź nowe hasło</Label>
                            <Input
                                id="confirm-password"
                                type="password"
                                className="bg-[#2A2A2A] border-[#3A3A3A] text-white mt-2 focus:ring-1 focus:ring-[#D4A44A]"
                            />
                        </div>
                        <Button className="bg-[#D4A44A] text-black hover:bg-[#B8873D] font-semibold">
                            Zmień hasło
                        </Button>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-red-500/10 to-red-600/10 border-red-500/30 hover:border-red-500/50 transition-all duration-300 hover:scale-[1.01]">
                    <CardContent className="p-6 flex flex-col sm:flex-row items-start gap-4">
                        <div className="bg-red-500 p-3 rounded-lg shadow-md shadow-red-900/40">
                            <Lock className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white mb-2">Bezpieczeństwo konta</h3>
                            <p className="text-sm text-gray-300 leading-relaxed">
                                Twoje dane są chronione protokołem <span className="text-white font-semibold">OAuth2</span>.
                                Zalecamy używanie silnych, unikalnych haseł i ich regularną zmianę w celu maksymalnego bezpieczeństwa.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
