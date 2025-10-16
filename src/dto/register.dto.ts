import { z } from "zod"

export const registerSchema = z.object({
    username: z.string().min(3, "Nazwa użytkownika musi mieć co najmniej 3 znaki"),
    email: z.email("Niepoprawny adres e-mail"),
    password: z.string().min(6, "Hasło musi mieć co najmniej 6 znaków"),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Hasła muszą być takie same",
    path: ["confirmPassword"],
})

export type RegisterDTO = z.infer<typeof registerSchema>
