import { apiRequest } from "@/lib/apiRequest";


export type LoyaltyPointsResponse = {
  userId: string;
  loyaltyPoints: number;
}


export const LoyaltyPointsApi = {

    getByUserId: (id: string) =>
        apiRequest<LoyaltyPointsResponse>(`/loyalty-users/${id}`),
};
