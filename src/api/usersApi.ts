import { apiRequest } from "@/lib/apiRequest";

export interface UserPointsResponse {
    userid: string,
    loyaltyPoints: number
}

export interface ResetPasswordQuery {
    password: string,
    newPassword: string
}

export interface ChangeUsernameQuery {
    username: string,
    firstName: string,
    lastName: string
}

export const UsersApi = {
    getLoyaltyPoints: (userID: string | undefined) =>
        apiRequest<UserPointsResponse>(`/loyalty-users/${userID}`),

    resetPassword: (userID: string | undefined, data: ResetPasswordQuery) =>
        apiRequest(`/users/${userID}/reset-password`, { method: "PUT", data: data }),

    changeUsername: (userID: string | undefined, data: ChangeUsernameQuery) =>
        apiRequest(`/users/${userID}`, { method: "PUT", data: data }),

    isGoogleAccount: (userID: string | undefined) =>
        apiRequest<boolean>(`/users/${userID}/is-federated`)
};
