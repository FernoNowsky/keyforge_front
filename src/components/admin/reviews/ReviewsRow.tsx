import { ChevronDown, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";

export type ReviewStatus = "PENDING" | "APPROVED" | "REJECTED";

type Review = {
    id: number;
    userId: string | number;
    content: string;
    rating: number;
    status: ReviewStatus;
    createdAt: Date;
};

type ReviewRowProps = {
    review: Review;
    handleReviewStatusChange: (id: number, oldStatus: ReviewStatus, newStatus: ReviewStatus) => void;
};

export function ReviewsRow({ review, handleReviewStatusChange }: ReviewRowProps) {
    return (
        <TableRow className="border-[#3A3A3A] hover:bg-[#1C1C1C]">
            <TableCell className="text-[#F8F8F8] font-medium">{review.userId}</TableCell>

            <TableCell className="text-[#F8F8F8] max-w-md">
                <div className="truncate">{review.content}</div>
            </TableCell>

            <TableCell>
                <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-[#D4A44A] text-[#D4A44A]" />
                    <span className="text-[#F8F8F8]">{review.rating}</span>
                </div>
            </TableCell>

            <TableCell>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                            <Badge
                                className={`w-[100px] ${
                                    review.status === "APPROVED"
                                        ? "bg-green-500/20 text-green-500"
                                        : review.status === "REJECTED"
                                            ? "bg-red-500/20 text-red-500"
                                            : "bg-yellow-500/20 text-yellow-500"
                                }`}
                            >
                                {review.status === "APPROVED"
                                    ? "Zatwierdzono"
                                    : review.status === "REJECTED"
                                        ? "Odrzucono"
                                        : "Oczekuje"}
                            </Badge>
                            <ChevronDown className="w-4 h-4 text-[#A0A0A0]" />
                        </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent className="bg-[#2A2A2A] border-[#3A3A3A]">
                        <DropdownMenuItem
                            onClick={() => handleReviewStatusChange(review.id, review.status, "PENDING")}
                            className="text-yellow-500 hover:bg-yellow-500/20 cursor-pointer"
                        >
                            Oczekuje
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            onClick={() => handleReviewStatusChange(review.id, review.status, "APPROVED")}
                            className="text-green-500 hover:bg-green-500/20 cursor-pointer"
                        >
                            Zatwierdź
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            onClick={() => handleReviewStatusChange(review.id, review.status, "REJECTED")}
                            className="text-red-500 hover:bg-red-500/20 cursor-pointer"
                        >
                            Odrzuć
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </TableCell>

            <TableCell className="text-[#A0A0A0]">
                {new Date(review.createdAt).toLocaleDateString("pl-PL")}
            </TableCell>
        </TableRow>
    );
}