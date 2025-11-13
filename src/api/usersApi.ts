import { apiRequest } from "@/lib/apiRequest";

export interface UserPointsResponse {
    userid: string,
    loyaltyPoints: number
}

export const UsersApi = {
    getLoyaltyPoints: (userID: string | undefined) =>
        apiRequest<UserPointsResponse>(`/loyalty-users/${userID}`),
};
