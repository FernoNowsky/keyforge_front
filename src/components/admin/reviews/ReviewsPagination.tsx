import { Button } from "@/components/ui/button";

type ReviewsPaginationProps = {
    page: number;
    totalPages: number;
    handlePageChange: (page: number) => void;
};

export function ReviewsPagination({ page, totalPages, handlePageChange }: ReviewsPaginationProps) {
    return (
        <div className="flex justify-center items-center gap-2 mt-6">
            <Button variant="outline" size="sm" disabled={page === 0} onClick={() => handlePageChange(page - 1)}>
                Poprzednia
            </Button>


            {[...Array(totalPages)].map((_, index) => (
                <button
                    key={index}
                    onClick={() => handlePageChange(index)}
                    className={`px-3 py-1 rounded-lg text-sm ${
                        page === index ? "bg-[#D4A44A] text-black" : "bg-[#2A2A2A] text-[#A0A0A0] border border-[#3A3A3A]"
                    }`}
                >
                    {index + 1}
                </button>
            ))}


            <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages - 1}
                onClick={() => handlePageChange(page + 1)}
            >
                Następna
            </Button>
        </div>
    );
}