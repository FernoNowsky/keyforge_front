import { redirect } from '@tanstack/react-router'
import { toast } from "sonner"
import {hasRole, isAuthenticated} from "@/hooks/useAuthToken.ts";

export function requireAuth() {
    if (!isAuthenticated()) {
        toast.error("Musisz być zalogowany")
        throw redirect({
            to: '/error/login',
        })
    }
}

export function requireRole(role: string) {
    if (!isAuthenticated()) {
        toast.error("Musisz być zalogowany")
        throw redirect({
            to: '/error/login',
        })
    }

    if (!hasRole(role)) {
        toast.error("Nie masz uprawnień do tej strony")
        throw redirect({
            to: '/error/role',
        })
    }
}