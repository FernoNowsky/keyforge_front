import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import {ReviewsRow} from "@/components/admin/reviews/ReviewsRow.tsx";
import type {Review} from "@/api";

type ReviewsTableProps = {
    filteredReviews: Review[];
    handleReviewStatusChange: (id: number, oldStatus: ReviewStatus, newStatus: ReviewStatus) => void;
};

type ReviewStatus = "PENDING" | "APPROVED" | "REJECTED";

export function ReviewsTable({ filteredReviews, handleReviewStatusChange }: ReviewsTableProps) {
    return (
        <Card className="bg-[#2A2A2A] border-[#3A3A3A]">
            <CardContent className="p-6">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-[#3A3A3A] hover:bg-transparent">
                                <TableHead className="text-[#A0A0A0]">Użytkownik</TableHead>
                                <TableHead className="text-[#A0A0A0]">Treść</TableHead>
                                <TableHead className="text-[#A0A0A0]">Ocena</TableHead>
                                <TableHead className="text-[#A0A0A0]">Status</TableHead>
                                <TableHead className="text-[#A0A0A0]">Data</TableHead>
                            </TableRow>
                        </TableHeader>


                        <TableBody>
                            {filteredReviews.map((review) => (
                                <ReviewsRow key={review.id} review={review} handleReviewStatusChange={handleReviewStatusChange} />
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}