import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Mail, Lock, AlertCircle, CheckCircle } from 'lucide-react'
import { UsersApi } from '@/api/usersApi'
import { useAuth } from '@/hooks/useAuthToken'

export default function SettingsPage() {
    const { userId, email: authEmail } = useAuth()

    const [email, setEmail] = useState('')
    const [emailError, setEmailError] = useState('')
    const [passwordData, setPasswordData] = useState({
        current: '',
        new: '',
        confirm: ''
    })
    const [passwordErrors, setPasswordErrors] = useState({
        current: '',
        new: '',
        confirm: '',
        general: ''
    })
    const [successMessage, setSuccessMessage] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (authEmail) setEmail(authEmail)
    }, [authEmail])

    const validateEmail = (value: string) => {
        if (!value.trim()) {
            setEmailError('Adres e-mail nie może być pusty')
            return false
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(value)) {
            setEmailError('Nieprawidłowy format adresu e-mail')
            return false
        }
        setEmailError('')
        return true
    }
    const validatePassword = () => {
        const errors = {
            current: '',
            new: '',
            confirm: '',
            general: ''
        }
        let isValid = true

        if (!passwordData.current) {
            errors.current = 'Wprowadź obecne hasło'
            isValid = false
        }

        if (!passwordData.new) {
            errors.new = 'Wprowadź nowe hasło'
            isValid = false
        } else if (passwordData.new.length < 8) {
            errors.new = 'Hasło musi zawierać minimum 8 znaków'
            isValid = false
        } else if (!/[A-Z]/.test(passwordData.new)) {
            errors.new = 'Hasło musi zawierać przynajmniej jedną wielką literę'
            isValid = false
        } else if (!/[a-z]/.test(passwordData.new)) {
            errors.new = 'Hasło musi zawierać przynajmniej jedną małą literę'
            isValid = false
        } else if (!/[0-9]/.test(passwordData.new)) {
            errors.new = 'Hasło musi zawierać przynajmniej jedną cyfrę'
            isValid = false
        }

        if (!passwordData.confirm) {
            errors.confirm = 'Potwierdź nowe hasło'
            isValid = false
        } else if (passwordData.new !== passwordData.confirm) {
            errors.confirm = 'Hasła nie są identyczne'
            isValid = false
        }

        setPasswordErrors(errors)
        return isValid
    }

    const handleChangeEmail = () => {
        if (validateEmail(email)) {
            setSuccessMessage('Adres e-mail został zaktualizowany')
            setTimeout(() => setSuccessMessage(''), 3000)
        }
    }

    const handleChangePassword = async () => {
        setSuccessMessage('')
        
        if (!validatePassword()) {
            return
        }

        setIsLoading(true)
        
        try {
            await UsersApi.resetPassword(userId, {
                password: passwordData.current,
                newPassword: passwordData.new
            })
            
            setSuccessMessage('Hasło zostało pomyślnie zmienione')
            setPasswordData({ current: '', new: '', confirm: '' })
            setPasswordErrors({ current: '', new: '', confirm: '', general: '' })
            
            setTimeout(() => setSuccessMessage(''), 3000)
        } catch (error) {
            setPasswordErrors({
                ...passwordErrors,
                general: error instanceof Error ? error.message : 'Wystąpił błąd podczas zmiany hasła'
            })
        } finally {
            setIsLoading(false)
        }
    }

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

                {successMessage && (
                    <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <p className="text-green-400 text-sm">{successMessage}</p>
                    </div>
                )}

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
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value)
                                    setEmailError('')
                                }}
                                className={`bg-[#2A2A2A] border-[#3A3A3A] text-white mt-2 focus:ring-1 focus:ring-[#D4A44A] ${
                                    emailError ? 'border-red-500' : ''
                                }`}
                            />
                            {emailError && (
                                <div className="flex items-center gap-2 mt-2 text-red-400 text-sm">
                                    <AlertCircle className="h-4 w-4" />
                                    <span>{emailError}</span>
                                </div>
                            )}
                        </div>
                        <Button 
                            onClick={handleChangeEmail}
                            className="bg-[#D4A44A] text-black hover:bg-[#B8873D] font-semibold"
                        >
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
                            Hasło musi zawierać minimum 8 znaków, wielką i małą literę oraz cyfrę
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {passwordErrors.general && (
                            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 flex items-center gap-2">
                                <AlertCircle className="h-4 w-4 text-red-400" />
                                <p className="text-red-400 text-sm">{passwordErrors.general}</p>
                            </div>
                        )}
                        
                        <div>
                            <Label htmlFor="current-password" className="text-gray-400">Aktualne hasło</Label>
                            <Input
                                id="current-password"
                                type="password"
                                value={passwordData.current}
                                onChange={(e) => {
                                    setPasswordData({ ...passwordData, current: e.target.value })
                                    setPasswordErrors({ ...passwordErrors, current: '', general: '' })
                                }}
                                className={`bg-[#2A2A2A] border-[#3A3A3A] text-white mt-2 focus:ring-1 focus:ring-[#D4A44A] ${
                                    passwordErrors.current ? 'border-red-500' : ''
                                }`}
                            />
                            {passwordErrors.current && (
                                <div className="flex items-center gap-2 mt-2 text-red-400 text-sm">
                                    <AlertCircle className="h-4 w-4" />
                                    <span>{passwordErrors.current}</span>
                                </div>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="new-password" className="text-gray-400">Nowe hasło</Label>
                            <Input
                                id="new-password"
                                type="password"
                                value={passwordData.new}
                                onChange={(e) => {
                                    setPasswordData({ ...passwordData, new: e.target.value })
                                    setPasswordErrors({ ...passwordErrors, new: '', general: '' })
                                }}
                                className={`bg-[#2A2A2A] border-[#3A3A3A] text-white mt-2 focus:ring-1 focus:ring-[#D4A44A] ${
                                    passwordErrors.new ? 'border-red-500' : ''
                                }`}
                            />
                            {passwordErrors.new && (
                                <div className="flex items-center gap-2 mt-2 text-red-400 text-sm">
                                    <AlertCircle className="h-4 w-4" />
                                    <span>{passwordErrors.new}</span>
                                </div>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="confirm-password" className="text-gray-400">Potwierdź nowe hasło</Label>
                            <Input
                                id="confirm-password"
                                type="password"
                                value={passwordData.confirm}
                                onChange={(e) => {
                                    setPasswordData({ ...passwordData, confirm: e.target.value })
                                    setPasswordErrors({ ...passwordErrors, confirm: '', general: '' })
                                }}
                                className={`bg-[#2A2A2A] border-[#3A3A3A] text-white mt-2 focus:ring-1 focus:ring-[#D4A44A] ${
                                    passwordErrors.confirm ? 'border-red-500' : ''
                                }`}
                            />
                            {passwordErrors.confirm && (
                                <div className="flex items-center gap-2 mt-2 text-red-400 text-sm">
                                    <AlertCircle className="h-4 w-4" />
                                    <span>{passwordErrors.confirm}</span>
                                </div>
                            )}
                        </div>

                        <Button 
                            onClick={handleChangePassword}
                            disabled={isLoading}
                            className="bg-[#D4A44A] text-black hover:bg-[#B8873D] font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Zmieniam hasło...' : 'Zmień hasło'}
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