import { z } from "zod"

export const loginSchema = z.object({
    email: z.email("Niepoprawny adres e-mail"),
    password: z.string().min(6, "Hasło musi mieć co najmniej 6 znaków"),
})

export type LoginDTO = z.infer<typeof loginSchema>
