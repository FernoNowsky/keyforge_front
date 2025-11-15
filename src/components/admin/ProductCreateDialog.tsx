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
import { useState, useEffect, type Dispatch, type SetStateAction } from "react";
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


interface ProductCreateDialogProps {
    createDialogOpen: boolean;
    setCreateDialogOpen: (open: boolean) => void;
    products: DetailedProduct[];
    setProducts: Dispatch<SetStateAction<DetailedProduct[]>>;
}

export function ProductCreateDialog({
                                        createDialogOpen,
                                        setCreateDialogOpen,
                                        products,
                                        setProducts
                                    }: ProductCreateDialogProps) {
    const [activeTab, setActiveTab] = useState("info");
    const [errors, setErrors] = useState<Record<string, boolean>>({});
    const [loading, setLoading] = useState(true);

    const [platforms, setPlatforms] = useState<Platform[]>([]);
    const [productTypes, setProductTypes] = useState<ProductType[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [producents, setProducents] = useState<Producent[]>([]);

    const [newProduct, setNewProduct] = useState<DetailedProduct | null>(null);

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
        if (createDialogOpen && !loading && platforms.length && productTypes.length && producents.length) {
            setActiveTab("info");
            setErrors({});
            setNewProduct({
                id: 0,
                name: "",
                descriptionPl: "",
                descriptionEn: "",
                price: 0,
                stock: 0,
                releaseDate: "",
                logoId: "",
                discountPercentage: 0,
                visible: false,
                deleted: false,
                categories: [],
                platform: platforms[0],
                type: productTypes[0],
                producent: producents[0]
            });
        }
    }, [createDialogOpen, loading, platforms, productTypes, producents]);

    const validateForm = () => {
        if (!newProduct) return false;
        const newErrors: Record<string, boolean> = {};

        newErrors.name = newProduct.name.trim() === "";
        newErrors.price = newProduct.price <= 0;
        newErrors.stock = newProduct.stock < 0;
        newErrors.discountPercentage =
            newProduct.discountPercentage < 0 ||
            newProduct.discountPercentage > 100;
        newErrors.releaseDate = newProduct.releaseDate.trim() === "";
        newErrors.logoId = newProduct.logoId.trim() === "";
        newErrors.descriptionPl = newProduct.descriptionPl.trim() === "";
        newErrors.descriptionEn = newProduct.descriptionEn.trim() === "";
        newErrors.categories = newProduct.categories.length === 0;
        newErrors.platform = !newProduct.platform?.id;
        newErrors.type = !newProduct.type?.id;
        newErrors.producent = !newProduct.producent?.id;

        setErrors(newErrors);
        return Object.values(newErrors).every(v => v === false);
    };

    const clearError = (field: string) => {
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: false }));
        }
    };

    const handleCreateProduct = async () => {
        if (!newProduct) return;
        if (!validateForm()) {
            toast.error("Uzupełnij poprawnie wszystkie wymagane pola!");
            return;
        }

        try {
            const createRequest = {
                name: newProduct.name,
                descriptionPl: newProduct.descriptionPl,
                descriptionEn: newProduct.descriptionEn,
                price: newProduct.price,
                stock: newProduct.stock,
                releaseDate: newProduct.releaseDate,
                logoId: newProduct.logoId,
                discountPercentage: newProduct.discountPercentage,
                categoriesId: newProduct.categories.map(c => c.id),
                platformId: newProduct.platform.id,
                typeId: newProduct.type.id,
                producentId: newProduct.producent.id
            };

            const createdProduct = await ProductsApi.create(createRequest);
            setProducts([...products, createdProduct]);
            setCreateDialogOpen(false);
            toast.success("Produkt został pomyślnie utworzony!");
            eventBus.emit("products:reload");
        } catch (error) {
            console.error("Błąd podczas tworzenia produktu:", error);
            toast.error("Nie udało się dodać produktu.");
        }
    };

    if (loading || !newProduct) {
        return (
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
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
    <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
      <DialogContent className="bg-[#1E1E1E] border-[#333] text-[#F8F8F8] !max-w-6xl w-full h-[90vh] flex flex-col rounded-2xl shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            Dodaj nowy produkt
          </DialogTitle>
          <DialogDescription className="text-[#A0A0A0]">
            Wprowadź informacje o nowym produkcie
          </DialogDescription>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex-1 flex flex-col mt-4 overflow-hidden"
        >
          <TabsList className="flex w-full border-[#333] bg-transparent mb-6">
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
              {/* Podstawowe informacje */}
              <div className="bg-[#252525] rounded-lg p-6 space-y-4">
                <h3 className="text-lg font-semibold text-[#D4A44A] mb-4">Podstawowe informacje</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label className="text-sm text-[#C0C0C0] mb-2">Nazwa produktu</Label>
                    <Input
                      value={newProduct.name}
                      onChange={(e) => {
                        setNewProduct({ ...newProduct, name: e.target.value });
                        if (e.target.value.trim() !== "") clearError("name");
                      }}
                      className={`bg-[#2A2A2A] border h-11 ${
                        errors.name ? "border-red-500" : "border-[#3A3A3A]"
                      } focus:ring-[#D4A44A]`}
                      placeholder="Wprowadź nazwę produktu"
                    />
                  </div>
                  <div>
                    <Label className="text-sm text-[#C0C0C0] mb-2">Data wydania</Label>
                    <Input
                      type="date"
                      value={newProduct.releaseDate}
                      onChange={(e) => {
                        setNewProduct({
                          ...newProduct,
                          releaseDate: e.target.value
                        });
                        if (e.target.value.trim() !== "") clearError("releaseDate");
                      }}
                      onKeyDown={(e) => e.preventDefault()}
                      className={`bg-[#2A2A2A] border h-11 ${
                        errors.releaseDate ? "border-red-500" : "border-[#3A3A3A]"
                      } focus:ring-[#D4A44A]`}
                    />
                  </div>
                  <div>
                    <Label className="text-sm text-[#C0C0C0] mb-2">ID logo</Label>
                    <Input
                      value={newProduct.logoId}
                      onChange={(e) => {
                        setNewProduct({
                          ...newProduct,
                          logoId: e.target.value
                        });
                        if (e.target.value.trim() !== "") clearError("logoId");
                      }}

                      className={`bg-[#2A2A2A] border h-11 ${
                        errors.logoId ? "border-red-500" : "border-[#3A3A3A]"
                      } focus:ring-[#D4A44A]`}
                    />
                  </div>
                </div>
              </div>

              {/* Ceny i dostępność */}
              <div className="bg-[#252525] rounded-lg p-6 space-y-4">
                <h3 className="text-lg font-semibold text-[#D4A44A] mb-4">Ceny i dostępność</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label className="text-sm text-[#C0C0C0] mb-2">Cena (PLN)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={newProduct.price}
                      onFocus={(e) => e.target.select()}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) || 0;
                        setNewProduct({
                          ...newProduct,
                          price: val
                        });
                        if (val > 0) clearError("price");
                      }}
                      className={`bg-[#2A2A2A] border h-11 ${
                        errors.price ? "border-red-500" : "border-[#3A3A3A]"
                      } focus:ring-[#D4A44A]`}
                    />
                  </div>
                  <div>
                    <Label className="text-sm text-[#C0C0C0] mb-2">Rabat (%)</Label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={newProduct.discountPercentage}
                      onFocus={(e) => e.target.select()}
                      onChange={(e) => {
                          let val = parseInt(e.target.value) || 0;
                          if (val > 100) val = 100;
                          if (val < 0) val = 0;
                          setNewProduct({
                              ...newProduct,
                              discountPercentage: val,
                          });

                          if (val >= 0 && val <= 100) clearError("discountPercentage");
                      }}
                      className={`bg-[#2A2A2A] border h-11 ${
                        errors.discountPercentage ? "border-red-500" : "border-[#3A3A3A]"
                      } focus:ring-[#D4A44A]`}
                    />
                  </div>
                  <div>
                    <Label className="text-sm text-[#C0C0C0] mb-2">Stan magazynowy</Label>
                    <Input
                      type="number"
                      min="0"
                      value={newProduct.stock}
                      onFocus={(e) => e.target.select()}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 0;
                        setNewProduct({
                          ...newProduct,
                          stock: val
                        });
                        if (val >= 0) clearError("stock");
                      }}
                      className={`bg-[#2A2A2A] border h-11 ${
                        errors.stock ? "border-red-500" : "border-[#3A3A3A]"
                      } focus:ring-[#D4A44A]`}
                    />
                  </div>
                </div>
                {newProduct.discountPercentage > 0 && (
                  <div className="bg-[#2A2A2A] rounded-lg p-3 flex items-center justify-between">
                    <span className="text-sm text-[#A0A0A0]">Cena po rabacie:</span>
                    <span className="text-lg font-semibold text-[#D4A44A]">
                      {(newProduct.price * (1 - newProduct.discountPercentage / 100)).toFixed(2)} PLN
                    </span>
                  </div>
                )}
              </div>

              {/* Klasyfikacja */}
              <div className="bg-[#252525] rounded-lg p-6 space-y-4">
                <h3 className="text-lg font-semibold text-[#D4A44A] mb-4">Klasyfikacja</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label className="text-sm text-[#C0C0C0] mb-2">Platforma</Label>
                    <Select
                      value={newProduct.platform.id.toString()}
                      onValueChange={(value) => {
                        setNewProduct({
                          ...newProduct,
                          platform: platforms.find((p: Platform) => p.id === Number(value))!
                        });
                        clearError("platform");
                      }}
                    >
                      <SelectTrigger className={`bg-[#2A2A2A] border h-11 w-full ${
                        errors.platform ? "border-red-500" : "border-[#3A3A3A]"
                      }`}>
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
                      value={newProduct.type.id.toString()}
                      onValueChange={(value) => {
                        setNewProduct({
                          ...newProduct,
                          type: productTypes.find((t: ProductType) => t.id === Number(value))!
                        });
                        clearError("type");
                      }}
                    >
                      <SelectTrigger className={`bg-[#2A2A2A] border h-11 w-full ${
                        errors.type ? "border-red-500" : "border-[#3A3A3A]"
                      }`}>
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
                      value={newProduct.producent.id.toString()}
                      onValueChange={(value) => {
                        setNewProduct({
                          ...newProduct,
                          producent: producents.find((p: Producent) => p.id === Number(value))!
                        });
                        clearError("producent");
                      }}
                    >
                      <SelectTrigger className={`bg-[#2A2A2A] border h-11 w-full ${
                        errors.producent ? "border-red-500" : "border-[#3A3A3A]"
                      }`}>
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

          {/* --- Opis --- */}
          <TabsContent value="desc" className="flex-1 overflow-y-auto pr-2">
            <div className="space-y-6">
              <div className="bg-[#252525] rounded-lg p-6">
                <Label className="text-sm text-[#C0C0C0] mb-2">Opis po polsku</Label>
                <Textarea
                  rows={8}
                  value={newProduct.descriptionPl}
                  onChange={(e) => {
                    setNewProduct({
                      ...newProduct,
                      descriptionPl: e.target.value
                    });
                    if (e.target.value.trim() !== "") clearError("descriptionPl");
                  }}
                  className={`bg-[#2A2A2A] border resize-none ${
                    errors.descriptionPl ? "border-red-500" : "border-[#3A3A3A]"
                  }`}
                  placeholder="Wprowadź opis produktu w języku polskim..."
                />
              </div>
              <div className="bg-[#252525] rounded-lg p-6">
                <Label className="text-sm text-[#C0C0C0] mb-2">Opis po angielsku</Label>
                <Textarea
                  rows={8}
                  value={newProduct.descriptionEn}
                  onChange={(e) => {
                    setNewProduct({
                      ...newProduct,
                      descriptionEn: e.target.value
                    });
                    if (e.target.value.trim() !== "") clearError("descriptionEn");
                  }}
                  className={`bg-[#2A2A2A] border resize-none ${
                    errors.descriptionEn ? "border-red-500" : "border-[#3A3A3A]"
                  }`}
                  placeholder="Enter product description in English..."
                />
              </div>
            </div>
          </TabsContent>

          {/* --- Kategorie --- */}
          <TabsContent value="cats" className="flex-1 overflow-y-auto pr-2">
            <div className="bg-[#252525] rounded-lg p-6">
              <div className="mb-4">
                <Label className="text-sm text-[#C0C0C0]">Wybrane kategorie</Label>
                <p className="text-xs text-[#808080] mt-1">
                    Wybrano: {newProduct?.categories.length} {newProduct?.categories.length === 1 ? 'kategorię' : newProduct?.categories.length >= 2 && newProduct?.categories.length <= 4 ? 'kategorie' : 'kategorii'}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                {categories.map((cat: Category) => {
                  const selected = newProduct.categories.some((c: Category) => c.id === cat.id);
                  return (
                    <Button
                      key={cat.id}
                      variant={"outline"}
                      onClick={() => {
                        const newCategories = selected
                          ? newProduct.categories.filter((c: Category) => c.id !== cat.id)
                          : [...newProduct.categories, cat];
                        setNewProduct({
                          ...newProduct,
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
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="pt-4 mt-auto border-t border-[#333] gap-2">
          <Button
            variant="outline"
            onClick={() => setCreateDialogOpen(false)}
            className="hover:!border-[#f1c562]/80 px-6 shadow-lg"
          >
            Anuluj
          </Button>
          <Button
            onClick={handleCreateProduct}
            variant={"outline"}
            className="hover:!border-[#f1c562]/80 px-6 shadow-lg"
          >
            Dodaj produkt
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}