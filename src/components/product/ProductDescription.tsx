import { Card, CardHeader, CardContent } from "@/components/ui/card";

interface Props {
    description: string;
}

export const ProductDescription = ({ description }: Props) => (
    <Card className="bg-[#2A2A2A] border-[#3A3A3A]">
        <CardHeader>
            <h2 className="text-xl font-semibold text-[#F8F8F8]">Opis produktu</h2>
        </CardHeader>
        <CardContent>
            <p className="text-[#A0A0A0] leading-relaxed">{description}</p>
        </CardContent>
    </Card>
);
