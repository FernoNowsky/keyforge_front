import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

type ReviewsFiltersProps = {
    searchTerm: string;
    setSearchTerm: (value: string) => void;
    onSearch: () => void;
    statusFilter: string;
    setStatusFilter: (value: string) => void;
    pageSize: number;
    setPageSize: (value: number) => void;
};

export function ReviewsFilters({
                                   searchTerm,
                                   setSearchTerm,
                                   onSearch,
                                   statusFilter,
                                   setStatusFilter,
                                   pageSize,
                                   setPageSize
                               }: ReviewsFiltersProps) {

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            onSearch();
        }
    };

    return (
        <div className="flex gap-4">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A0A0A0]" />
                <Input
                    placeholder="Szukaj opinii..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="pl-10 bg-[#2A2A2A] border-[#3A3A3A] text-[#F8F8F8]"
                />
            </div>


            <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48 bg-[#2A2A2A] border-[#3A3A3A] text-[#F8F8F8]">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#2A2A2A] border-[#3A3A3A]">
                    <SelectItem value="all" className="text-[#F8F8F8]">Wszystkie</SelectItem>
                    <SelectItem value="PENDING" className="text-[#F8F8F8]">Oczekujące</SelectItem>
                    <SelectItem value="APPROVED" className="text-[#F8F8F8]">Zatwierdzone</SelectItem>
                    <SelectItem value="REJECTED" className="text-[#F8F8F8]">Odrzucone</SelectItem>
                </SelectContent>
            </Select>


            <div>
                <label className="text-[#A0A0A0] mr-2">Liczba na stronę:</label>
                <select
                    value={pageSize}
                    onChange={(e) => setPageSize(Number(e.target.value))}
                    className="bg-[#2A2A2A] border border-[#3A3A3A] text-white rounded-xl px-3 py-1"
                >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                </select>
            </div>
        </div>
    );
}