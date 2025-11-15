import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {useState, useEffect, type SetStateAction, type Dispatch} from "react";
import {
    type Category,
    type DetailedProduct,
    type Platform,
    type Producent,
    type ProductType,
    ProductsApi,
} from "@/api";

import {ProductTypeApi} from "@/api/productTypeApi.ts";
import {CategoriesApi} from "@/api/categoriesApi.ts";
import {PlatformsApi} from "@/api/platformsApi.ts";
import {ProducentsApi} from "@/api/producentsApi.ts";
import {eventBus} from "@/utils/events.ts";

interface ProductEditDialogProps {
    editDialogOpen: boolean;
    setEditDialogOpen: (open: boolean) => void;
    selectedProductItem: DetailedProduct | null;
    setSelectedProductItem: Dispatch<SetStateAction<DetailedProduct | null>>;
    products: DetailedProduct[];
    setProducts: Dispatch<SetStateAction<DetailedProduct[]>>;
}

export function ProductEditDialog({
                                      editDialogOpen,
                                      setEditDialogOpen,
                                      selectedProductItem,
                                      setSelectedProductItem,
                                      products,
                                      setProducts
                                  }: ProductEditDialogProps) {
    const [activeTab, setActiveTab] = useState("info");
    const [loading, setLoading] = useState(true);

    const [platforms, setPlatforms] = useState<Platform[]>([]);
    const [productTypes, setProductTypes] = useState<ProductType[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [producents, setProducents] = useState<Producent[]>([]);

    const [errors, setErrors] = useState<Record<string, boolean>>({});

    useEffect(() => {
        const fetchMenuData = async () => {
            try {
                const [typesRes, categoriesRes, platformsRes, producentsRes] =
                    await Promise.all([
                        ProductTypeApi.getAll(),
                        CategoriesApi.getAll(),
                        PlatformsApi.getAll(),
                        ProducentsApi.getAll()
                    ]);

                setProductTypes(typesRes.content ?? typesRes);
                setCategories(categoriesRes.content ?? categoriesRes);
                setPlatforms(platformsRes.content ?? platformsRes);
                setProducents(producentsRes.content ?? producentsRes);
            } catch (err) {
                console.error("Błąd pobierania danych do tworzenia produktu:", err);
                toast.error("Nie udało się pobrać danych z serwera.");
            } finally {
                setLoading(false);
            }
        };

        fetchMenuData();
    }, []);

    useEffect(() => {
        if (editDialogOpen) {
            setActiveTab("info");
            setErrors({});
        }
    }, [editDialogOpen]);

    const clearError = (field: string) => {
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: false }));
        }
    };

    const validateForm = () => {
        if (!selectedProductItem) return false;
        const newErrors: Record<string, boolean> = {};

        newErrors.name = selectedProductItem.name.trim() === "";
        newErrors.price = selectedProductItem.price <= 0;
        newErrors.stock = selectedProductItem.stock < 0;
        newErrors.discountPercentage =
            selectedProductItem.discountPercentage < 0 ||
            selectedProductItem.discountPercentage > 100;
        newErrors.releaseDate = selectedProductItem.releaseDate.trim() === "";
        newErrors.logoId = selectedProductItem.logoId.trim() === "";
        newErrors.descriptionPl = selectedProductItem.descriptionPl.trim() === "";
        newErrors.descriptionEn = selectedProductItem.descriptionEn.trim() === "";
        newErrors.categories = selectedProductItem.categories.length === 0;
        newErrors.platform = !selectedProductItem.platform?.id;
        newErrors.type = !selectedProductItem.type?.id;
        newErrors.producent = !selectedProductItem.producent?.id;

        setErrors(newErrors);
        return Object.values(newErrors).every(v => v === false);
    };

    const handleSaveProduct = async () => {
        if (!selectedProductItem) return;
        if (!validateForm()) {
            toast.error("Uzupełnij poprawnie wszystkie wymagane pola!");
            return;
        }

        const updateRequest = {
            name: selectedProductItem.name,
            descriptionPl: selectedProductItem.descriptionPl,
            descriptionEn: selectedProductItem.descriptionEn,
            price: selectedProductItem.price,
            stock: selectedProductItem.stock,
            releaseDate: selectedProductItem.releaseDate,
            logoId: selectedProductItem.logoId,
            discountPercentage: selectedProductItem.discountPercentage,
            categoriesId: selectedProductItem.categories.map((c: Category) => c.id),
            platformId: selectedProductItem.platform.id,
            typeId: selectedProductItem.type.id,
            producentId: selectedProductItem.producent.id
        };

        try {
            const updatedProduct = await ProductsApi.updateById(selectedProductItem.id, updateRequest);

            setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
            setEditDialogOpen(false);
            toast.success("Produkt został pomyślnie zaktualizowany!");
            eventBus.emit("products:reload");
        } catch (error) {
            console.error("Błąd podczas aktualizacji produktu:", error);
            toast.error("Nie udało się zaktualizować produktu.");
        }
    };

    if (loading) {
        return (
            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogContent className="bg-[#1E1E1E] border-[#333] text-[#F8F8F8] rounded-2xl shadow-2xl">
                    <DialogHeader>
                        <DialogTitle>Ładowanie danych...</DialogTitle>
                    </DialogHeader>
                    <div className="p-6 text-center text-[#AAA]">Proszę czekać...</div>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
            <DialogContent className="bg-[#1E1E1E] border-[#333] text-[#F8F8F8] !max-w-6xl w-full h-[90vh] flex flex-col rounded-2xl shadow-2xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-semibold">Edytuj produkt</DialogTitle>
                    <DialogDescription className="text-[#A0A0A0]">
                        Wprowadź zmiany w szczegółach produktu
                    </DialogDescription>
                </DialogHeader>

                {selectedProductItem && (
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col mt-4 overflow-hidden">
                        <TabsList className="flex w-full  border-[#333] bg-transparent mb-6">
                            {[
                                { value: "info", label: "Informacje główne" },
                                { value: "desc", label: "Opis" },
                                { value: "cats", label: "Kategorie" }
                            ].map((tab, index) => (
                                <TabsTrigger
                                    key={tab.value}
                                    value={tab.value}
                                    className={`${index < 2 ? "mr-2" : ""} h-[48px] relative mb-2 text-sm font-medium transition-all duration-200 
                data-[state=active]:text-[#D4A44A] text-[#AFAFAF]
                hover:!text-[#E6C067]`}
                                >
                                    <span className="mt-2">{tab.label}</span>
                                    {activeTab === tab.value && (
                                        <motion.div
                                            layoutId="underline"
                                            className="absolute left-0 right-0 bottom-0 h-[2px] bg-[#D4A44A] z-10"
                                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        />
                                    )}
                                </TabsTrigger>
                            ))}
                        </TabsList>

                        <TabsContent value="info" className="flex-1 overflow-y-auto pr-2">
                            <div className="space-y-6">
                                <div className="bg-[#252525] rounded-lg p-6 space-y-4">
                                    <h3 className="text-lg font-semibold text-[#D4A44A] mb-4">Podstawowe informacje</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="col-span-2">
                                            <Label className="text-sm text-[#C0C0C0] mb-2">Nazwa produktu</Label>
                                            <Input
                                                value={selectedProductItem.name}
                                                onChange={(e) => {
                                                    setSelectedProductItem({ ...selectedProductItem, name: e.target.value })
                                                    if (e.target.value.trim() !== "") clearError("name");
                                                }}
                                                className={`bg-[#2A2A2A] border h-11 ${errors.name ? "border-red-500" : "border-[#3A3A3A]"} focus:ring-[#D4A44A]`}
                                                placeholder="Wprowadź nazwę produktu"
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-sm text-[#C0C0C0] mb-2">Data wydania</Label>
                                            <Input
                                                type="date"
                                                value={selectedProductItem.releaseDate}
                                                onChange={(e) => {
                                                    setSelectedProductItem({
                                                        ...selectedProductItem,
                                                        releaseDate: e.target.value
                                                    });
                                                    if (e.target.value.trim() !== "") clearError("releaseDate");
                                                }}
                                                onKeyDown={(e) => e.preventDefault()}
                                                className={`bg-[#2A2A2A] border h-11 ${errors.releaseDate ? "border-red-500" : "border-[#3A3A3A]"} focus:ring-[#D4A44A]`}
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-sm text-[#C0C0C0] mb-2">ID logo</Label>
                                            <Input
                                                value={selectedProductItem.logoId}
                                                onChange={(e) => {
                                                    setSelectedProductItem({
                                                        ...selectedProductItem,
                                                        logoId: e.target.value
                                                    });
                                                    if (e.target.value.trim() !== "") clearError("logoId");
                                                }}

                                                className={`bg-[#2A2A2A] border h-11 ${errors.logoId ? "border-red-500" : "border-[#3A3A3A]"} focus:ring-[#D4A44A]`}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-[#252525] rounded-lg p-6 space-y-4">
                                    <h3 className="text-lg font-semibold text-[#D4A44A] mb-4">Ceny i dostępność</h3>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <Label className="text-sm text-[#C0C0C0] mb-2">Cena (PLN)</Label>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                value={selectedProductItem.price}
                                                onFocus={(e) => e.target.select()}
                                                onChange={(e) =>
                                                {
                                                    const val = parseFloat(e.target.value) || 0;
                                                    setSelectedProductItem({
                                                        ...selectedProductItem,
                                                        price: val
                                                    });
                                                    if (val > 0) clearError("price");
                                                }
                                                }
                                                className={`bg-[#2A2A2A] border h-11 ${errors.price ? "border-red-500" : "border-[#3A3A3A]"} focus:ring-[#D4A44A]`}
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-sm text-[#C0C0C0] mb-2">Rabat (%)</Label>
                                            <Input
                                                type="number"
                                                min="0"
                                                max="100"
                                                value={selectedProductItem.discountPercentage}
                                                onFocus={(e) => e.target.select()}
                                                onChange={(e) => {
                                                    let val = parseInt(e.target.value) || 0;
                                                    if (val > 100) val = 100;
                                                    if (val < 0) val = 0;
                                                    setSelectedProductItem({
                                                        ...selectedProductItem,
                                                        discountPercentage: val,
                                                    });
                                                    if (val >= 0 && val <= 100) clearError("discountPercentage");
                                                }}
                                                className={`bg-[#2A2A2A] border h-11 ${errors.discountPercentage ? "border-red-500" : "border-[#3A3A3A]"} focus:ring-[#D4A44A]`}
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-sm text-[#C0C0C0] mb-2">Stan magazynowy</Label>
                                            <Input
                                                type="number"
                                                min="0"
                                                value={selectedProductItem.stock}
                                                onFocus={(e) => e.target.select()}
                                                onChange={(e) =>
                                                {
                                                    const val = parseInt(e.target.value) || 0;
                                                    setSelectedProductItem({
                                                        ...selectedProductItem,
                                                        stock: val
                                                    });
                                                    if (val >= 0) clearError("stock");
                                                }
                                                }
                                                className={`bg-[#2A2A2A] border h-11 ${errors.stock ? "border-red-500" : "border-[#3A3A3A]"} focus:ring-[#D4A44A]`}
                                            />
                                        </div>
                                    </div>
                                    {selectedProductItem.discountPercentage > 0 && (
                                        <div className="bg-[#2A2A2A] rounded-lg p-3 flex items-center justify-between">
                                            <span className="text-sm text-[#A0A0A0]">Cena po rabacie:</span>
                                            <span className="text-lg font-semibold text-[#D4A44A]">
                                            {(selectedProductItem.price * (1 - selectedProductItem.discountPercentage / 100)).toFixed(2)} PLN
                                        </span>
                                        </div>
                                    )}
                                </div>
                                <div className="bg-[#252525] rounded-lg p-6 space-y-4">
                                    <h3 className="text-lg font-semibold text-[#D4A44A] mb-4">Klasyfikacja</h3>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <Label className="text-sm text-[#C0C0C0] mb-2">Platforma</Label>
                                            <Select
                                                value={selectedProductItem.platform.id.toString()}
                                                onValueChange={(value) => {
                                                    setSelectedProductItem({
                                                        ...selectedProductItem,
                                                        platform: platforms.find((p: Platform) => p.id === Number(value))!
                                                    });
                                                    clearError("platform");
                                                }}
                                            >
                                                <SelectTrigger className={`bg-[#2A2A2A] border h-11 w-full ${errors.platform ? "border-red-500" : "border-[#3A3A3A]"}`}>
                                                    <SelectValue placeholder="Wybierz platformę" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-[#2A2A2A] border-[#3A3A3A]">
                                                    {platforms.map((p: Platform) => (
                                                        <SelectItem key={p.id} value={p.id.toString()}>
                                                            {p.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <Label className="text-sm text-[#C0C0C0] mb-2">Typ</Label>
                                            <Select
                                                value={selectedProductItem.type.id.toString()}
                                                onValueChange={(value) => {
                                                    setSelectedProductItem({
                                                        ...selectedProductItem,
                                                        type: productTypes.find((t: ProductType) => t.id === Number(value))!
                                                    });
                                                    clearError("type");
                                                }}
                                            >
                                                <SelectTrigger className={`bg-[#2A2A2A] border h-11 w-full ${errors.type ? "border-red-500" : "border-[#3A3A3A]"}`}>
                                                    <SelectValue placeholder="Wybierz typ" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-[#2A2A2A] border-[#3A3A3A]">
                                                    {productTypes.map((t: ProductType) => (
                                                        <SelectItem key={t.id} value={t.id.toString()}>
                                                            {t.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <Label className="text-sm text-[#C0C0C0] mb-2">Producent</Label>
                                            <Select
                                                value={selectedProductItem.producent.id.toString()}
                                                onValueChange={(value) => {
                                                    setSelectedProductItem({
                                                        ...selectedProductItem,
                                                        producent: producents.find((p: Producent) => p.id === Number(value))!
                                                    });
                                                    clearError("producent");
                                                }}
                                            >
                                                <SelectTrigger className={`bg-[#2A2A2A] border h-11 w-full ${errors.producent ? "border-red-500" : "border-[#3A3A3A]"}`}>
                                                    <SelectValue placeholder="Wybierz producenta" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-[#2A2A2A] border-[#3A3A3A]">
                                                    {producents.map((p: Producent) => (
                                                        <SelectItem key={p.id} value={p.id.toString()}>
                                                            {p.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>
                        <TabsContent value="desc" className="flex-1 overflow-y-auto pr-2">
                            <div className="space-y-6">
                                <div className="bg-[#252525] rounded-lg p-6">
                                    <Label className="text-sm text-[#C0C0C0] mb-2">Opis po polsku</Label>
                                    <Textarea
                                        rows={8}
                                        value={selectedProductItem.descriptionPl}
                                        onChange={(e) => {
                                            setSelectedProductItem({
                                                ...selectedProductItem,
                                                descriptionPl: e.target.value
                                            });
                                            if (e.target.value.trim() !== "") clearError("descriptionPl");
                                        }}
                                        className={`bg-[#2A2A2A] border resize-none ${errors.descriptionPl ? "border-red-500" : "border-[#3A3A3A]"}`}
                                        placeholder="Wprowadź opis produktu w języku polskim..."
                                    />
                                </div>
                                <div className="bg-[#252525] rounded-lg p-6">
                                    <Label className="text-sm text-[#C0C0C0] mb-2">Opis po angielsku</Label>
                                    <Textarea
                                        rows={8}
                                        value={selectedProductItem.descriptionEn}
                                        onChange={(e) => {
                                            setSelectedProductItem({
                                                ...selectedProductItem,
                                                descriptionEn: e.target.value
                                            });
                                            if (e.target.value.trim() !== "") clearError("descriptionEn");
                                        }}
                                        className={`bg-[#2A2A2A] border resize-none ${errors.descriptionEn ? "border-red-500" : "border-[#3A3A3A]"}`}
                                        placeholder="Enter product description in English..."
                                    />
                                </div>
                            </div>
                        </TabsContent>
                        <TabsContent value="cats" className="flex-1 overflow-y-auto pr-2">
                            <div className="bg-[#252525] rounded-lg p-6">
                                <div className="mb-4">
                                    <Label className="text-sm text-[#C0C0C0]">Wybrane kategorie</Label>
                                    <p className="text-xs text-[#808080] mt-1">
                                        Wybrano: {selectedProductItem?.categories.length} {selectedProductItem?.categories.length === 1 ? 'kategorię' : selectedProductItem?.categories.length >= 2 && selectedProductItem?.categories.length <= 4 ? 'kategorie' : 'kategorii'}
                                    </p>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    {categories.map((cat: Category) => {
                                        const selected = selectedProductItem.categories.some((c: Category) => c.id === cat.id);
                                        return (
                                            <Button
                                                key={cat.id}
                                                variant={"outline"}
                                                onClick={() => {
                                                    const newCategories = selected
                                                        ? selectedProductItem.categories.filter((c: Category) => c.id !== cat.id)
                                                        : [...selectedProductItem.categories, cat];
                                                    setSelectedProductItem({
                                                        ...selectedProductItem,
                                                        categories: newCategories
                                                    });
                                                    if (newCategories.length > 0) clearError("categories");
                                                }}
                                                className={`px-4 py-2 text-sm rounded-lg transition-all duration-200 ${
                                                    selected
                                                        ? "!bg-[#D4A44A]/80 !text-black hover:!bg-[#D4A44A]/60"
                                                        : "hover:!bg-[#2E2E2E] hover:!border-[#D4A44A]"
                                                }`}
                                            >
                                                {cat.name}
                                            </Button>
                                        );
                                    })}
                                </div>
                                {errors.categories && <p className="text-red-500 text-sm mt-2">Wybierz przynajmniej jedną kategorię</p>}
                            </div>
                        </TabsContent>
                    </Tabs>
                )}

                <DialogFooter className="pt-4 mt-auto border-t border-[#333] gap-2">
                    <Button
                        variant="outline"
                        onClick={() => setEditDialogOpen(false)}
                        className="hover:!border-[#f1c562]/80 px-6 shadow-lg"
                    >
                        Anuluj
                    </Button>
                    <Button
                        onClick={handleSaveProduct}
                        variant={"outline"}
                        className="hover:!border-[#f1c562]/80 px-6 shadow-lg"
                    >
                        Zapisz zmiany
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );


}