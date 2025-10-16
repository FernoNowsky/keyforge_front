"use client"

import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { loginSchema, type LoginDTO } from "@/dto/login.dto"

interface LoginCardProps {
    onSwitchToRegister: () => void
    onSuccess: () => void
}

export function LoginCard({ onSwitchToRegister, onSuccess }: LoginCardProps) {
    const form = useForm<LoginDTO>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: "", password: "" },
    })

    const onSubmit = (values: z.infer<typeof loginSchema>) => {
        console.log("loginFormValues:", values)
        onSuccess() // na razie zamknięcie dialogu (funkcja z AuthDialog.tsx)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Hasło</FormLabel>
                            <FormControl>
                                <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full bg-[#D4A44A] text-black hover:bg-[#c0923e]">
                    Zaloguj się
                </Button>

                <p className="text-sm text-center mt-2 text-gray-400">
                    Nie masz konta?{" "}
                    <button
                        type="button"
                        onClick={onSwitchToRegister}
                        className="text-[#D4A44A] hover:underline"
                    >
                        Zarejestruj się
                    </button>
                </p>
            </form>
        </Form>
    )
}
