import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Filter, X, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

import { ProductTypeApi } from "@/api/productTypeApi";
import { CategoriesApi } from "@/api/categoriesApi";
import { PlatformsApi } from "@/api/platformsApi";
import { ProducentsApi } from "@/api/producentsApi";
import type { Category, Platform, Producent, ProductType } from "@/api";
import { toast } from "sonner";

export interface ProductFilters {
  name?: string;
  platforms: number[];
  categories: number[];
  types: number[];
  manufacturers: number[];
  visible?: boolean | null;
  priceRange: {
    min: number | null;
    max: number | null;
  };
}

interface ProductFiltersProps {
  onFilterChange: (filters: ProductFilters) => void;
}

export const ProductFilter = ({ onFilterChange }: ProductFiltersProps) => {
  const [localFilters, setLocalFilters] = useState<ProductFilters>({
    name: "",
    platforms: [],
    categories: [],
    types: [],
    manufacturers: [],
    visible: null,
    priceRange: { min: null, max: null },
  });

  // Filtry faktycznie zastosowane (stan „zatwierdzony”)
  const [appliedFilters, setAppliedFilters] = useState<ProductFilters>({
    name: "",
    platforms: [],
    categories: [],
    types: [],
    manufacturers: [],
    visible: null,
    priceRange: { min: null, max: null },
  });

  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [producents, setProducents] = useState<Producent[]>([]);
  const [loading, setLoading] = useState(true);

  const [openDialogKey, setOpenDialogKey] = useState<
    "platforms" | "categories" | "types" | "manufacturers" | null
  >(null);
  const [initialDialogFilters, setInitialDialogFilters] =
    useState<ProductFilters>(localFilters);

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const [typesRes, categoriesRes, platformsRes, producentsRes] =
          await Promise.all([
            ProductTypeApi.getAll(),
            CategoriesApi.getAll(),
            PlatformsApi.getAll(),
            ProducentsApi.getAll(),
          ]);

        setProductTypes(typesRes.content ?? typesRes);
        setCategories(categoriesRes.content ?? categoriesRes);
        setPlatforms(platformsRes.content ?? platformsRes);
        setProducents(producentsRes.content ?? producentsRes);
      } catch (err) {
        console.error("Błąd pobierania danych:", err);
        toast.error("Nie udało się pobrać danych z serwera.");
      } finally {
        setLoading(false);
      }
    };

    fetchMenuData();
  }, []);

  const handleApplyFilters = () => {
    setAppliedFilters(localFilters);
    onFilterChange(localFilters);
  };

  const handleClearFilters = () => {
    const empty: ProductFilters = {
      name: "",
      platforms: [],
      categories: [],
      types: [],
      manufacturers: [],
      visible: null,
      priceRange: { min: null, max: null },
    };
    setLocalFilters(empty);
    setAppliedFilters(empty);
    onFilterChange(empty);
  };

 const handleClearSingleFilter = (
  key: "platforms" | "categories" | "types" | "manufacturers"
) => {
  setLocalFilters((prev) => {
    const updated = { ...prev, [key]: [] };
    onFilterChange(updated);
    setAppliedFilters(updated)
    setInitialDialogFilters(updated)
    return updated;
  });
};

  const toggleArrayFilter = (
    filterKey: "platforms" | "categories" | "types" | "manufacturers",
    value: number
  ) => {
    setLocalFilters((prev) => {
      const arr = prev[filterKey];
      const newArr = arr.includes(value)
        ? arr.filter((id) => id !== value)
        : [...arr, value];
      return { ...prev, [filterKey]: newArr };
    });
  };

  const hasActiveFilters = () =>
    localFilters.name !== "" ||
    localFilters.platforms.length > 0 ||
    localFilters.categories.length > 0 ||
    localFilters.types.length > 0 ||
    localFilters.manufacturers.length > 0 ||
    localFilters.visible !== null ||
    localFilters.priceRange.min !== null ||
    localFilters.priceRange.max !== null;

  const handleDialogOpenChange = (
  isOpen: boolean,
  key: "platforms" | "categories" | "types" | "manufacturers"
) => {
  if (isOpen) {
    setLocalFilters(appliedFilters);
    setInitialDialogFilters(appliedFilters);
    setOpenDialogKey(key);
  } else {
    if (openDialogKey === key) {
      const before = initialDialogFilters[key];
      const after = localFilters[key];
      const changed =
        before.length !== after.length ||
        before.some((id) => !after.includes(id));

      if (changed) {
        setLocalFilters(appliedFilters);
      }
      setOpenDialogKey(null);
    }
  }
};

  type FilterItem = { id: number; name: string };

  const filterSections: {
    key: "platforms" | "categories" | "types" | "manufacturers";
    label: string;
    data: FilterItem[];
  }[] = [
    { key: "platforms", label: "Platformy", data: platforms },
    { key: "categories", label: "Kategorie", data: categories },
    { key: "types", label: "Typy", data: productTypes },
    { key: "manufacturers", label: "Producenci", data: producents },
  ];

  const handleNumberInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "min" | "max"
  ) => {
    const value = e.target.value.replace(/[^0-9.,]/g, "").replace(",", ".");
    setLocalFilters((prev) => ({
      ...prev,
      priceRange: {
        ...prev.priceRange,
        [type]: value ? parseFloat(value) : null,
      },
    }));
  };

 if (loading) {
  return (
    <Card className="bg-[#2A2A2A] border-[#3A3A3A] !p-0 min-h-[60px] max-h-[60px]">
      <CardContent className="flex items-center justify-center py-4 px-4">
        <div className="flex items-center space-x-2 justify-center mt-0.5">
          <Loader2 className="w-4 h-4 text-[#D4A44A] animate-spin" />
          <span className="text-[#A0A0A0] text-sm">Ładowanie...</span>
        </div>
      </CardContent>
    </Card>
  );
}



  return (
    <Card className="bg-[#2A2A2A] border-[#3A3A3A] !p-0">
      <CardContent>
        <Accordion type="single" collapsible defaultValue={undefined}>
          <AccordionItem value="filters">
            <div className="flex items-center justify-between">
              <AccordionTrigger className="text-[#F8F8F8] hover:text-[#D4A44A] flex justify-center items-center w-full">
                <Filter className="w-4 h-4 mr-2" />
                <span className="text-lg font-semibold">Filtry</span>
              </AccordionTrigger>

              {hasActiveFilters() && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearFilters}
                  className="text-[#A0A0A0] border-[#D4A44A] hover:!bg-[#3A3A3A]/40"
                >
                  <X className="w-4 h-4 mr-1" />
                  Wyczyść filtry
                </Button>
              )}
            </div>

            <AccordionContent className="pt-4 space-y-6">
              <div>
                <Label htmlFor="search" className="text-[#F8F8F8] mb-2 block">
                  Wyszukaj po nazwie
                </Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A0A0A0]" />
                  <Input
                    id="search"
                    placeholder="Wprowadź nazwę produktu..."
                    value={localFilters.name}
                    onChange={(e) =>
                      setLocalFilters((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    className="pl-10 bg-[#1A1A1A] border-[#3A3A3A] text-[#F8F8F8] placeholder:text-[#6A6A6A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filterSections.map(({ key, label, data }) => {
                  const activeCount = appliedFilters[key].length;
                  return (
                    <div key={key}>
                      <Label className="text-[#F8F8F8] mb-3 block text-center">
                        {label}
                      </Label>
                      <Dialog
                        onOpenChange={(isOpen) =>
                          handleDialogOpenChange(isOpen, key)
                        }
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            className="bg-[#1A1A1A] border-[#3A3A3A] text-[#F8F8F8] hover:bg-[#3A3A3A] w-full"
                          >
                            Wybierz {label.toLowerCase()}{" "}
                            {activeCount > 0 && `(${activeCount})`}
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-[#2A2A2A] border-[#3A3A3A] max-w-md">
                          <DialogHeader>
                            <DialogTitle className="text-[#F8F8F8]">
                              Wybierz {label.toLowerCase()}
                            </DialogTitle>
                          </DialogHeader>

                          <div className="max-h-60 overflow-y-auto rounded-md border border-[#3A3A3A]">
                            {data.map((item, index) => (
                              <div
                                key={item.id}
                                className={`flex items-center space-x-2 px-3 py-2 ${
                                  index % 2 === 0
                                    ? "bg-[#1F1F1F]"
                                    : "bg-[#252525]"
                                } hover:bg-[#3A3A3A]`}
                              >
                                <Checkbox
                                  id={`${key}-${item.id}`}
                                  checked={localFilters[key].includes(item.id)}
                                  onCheckedChange={() =>
                                    toggleArrayFilter(key, item.id)
                                  }
                                  className="border-[#3A3A3A] data-[state=checked]:bg-[#D4A44A]"
                                />
                                <label
                                  htmlFor={`${key}-${item.id}`}
                                  className="text-sm text-[#A0A0A0] cursor-pointer hover:text-[#F8F8F8]"
                                >
                                  {item.name}
                                </label>
                              </div>
                            ))}
                          </div>

                          <DialogFooter className="mt-4 flex justify-end space-x-2">
                            <Button
                              onClick={() => handleClearSingleFilter(key)}
                              variant="outline"
                              className="border-[#3A3A3A] text-[#A0A0A0]"
                            >
                              Wyczyść
                            </Button>
                            <Button
                              onClick={handleApplyFilters}
                              className="bg-[#D4A44A] text-black hover:bg-[#f1c562]"
                            >
                              Zastosuj
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  );
                })}

                <div>
                  <Label className="text-[#F8F8F8] mb-3 block text-center">
                    Status widoczności
                  </Label>
                  <Select
                    value={
                      localFilters.visible === null
                        ? "all"
                        : localFilters.visible
                        ? "visible"
                        : "hidden"
                    }
                    onValueChange={(v) =>
                      setLocalFilters((prev) => ({
                        ...prev,
                        visible: v === "all" ? null : v === "visible",
                      }))
                    }
                  >
                    <SelectTrigger className="bg-[#1A1A1A] border-[#3A3A3A] text-[#F8F8F8] ml-auto mr-auto">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#2A2A2A] border-[#3A3A3A]">
                      <SelectItem value="all">Wszystkie</SelectItem>
                      <SelectItem value="visible">Widoczne</SelectItem>
                      <SelectItem value="hidden">Ukryte</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-[#F8F8F8] mb-3 block text-center">
                    Zakres cenowy (zł)
                  </Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="text"
                      inputMode="decimal"
                      placeholder="Min"
                      value={localFilters.priceRange.min ?? ""}
                      onChange={(e) => handleNumberInput(e, "min")}
                      className="bg-[#1A1A1A] border-[#3A3A3A] text-[#F8F8F8]"
                    />
                    <span className="text-[#A0A0A0]">-</span>
                    <Input
                      type="text"
                      inputMode="decimal"
                      placeholder="Max"
                      value={localFilters.priceRange.max ?? ""}
                      onChange={(e) => handleNumberInput(e, "max")}
                      className="bg-[#1A1A1A] border-[#3A3A3A] text-[#F8F8F8]"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  onClick={handleApplyFilters}
                  variant="outline"
                  className="border-[#D4A44A] hover:!bg-[#f1c562]/20"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filtruj
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};
