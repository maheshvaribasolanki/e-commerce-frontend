import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SIZE_OPTIONS } from "@/features/admin/products/constants";
import type { ProductCategory } from "@/features/admin/products/types";
import {
  BRAND_OPTIONS,
  getSwatchColor,
  type CustomerProductFilters,
  type FacetKey,
} from "@/features/customer/products/product-list.shared";
import { ChevronDown, ChevronRight } from "lucide-react";

type CustomerFiltersPanelProps = {
  categories: ProductCategory[];
  filters: CustomerProductFilters;
  availableColors: string[];
  hasActiveFilters: boolean;
  onToggleFacet: (key: FacetKey, value: string) => void;
  onToggleCategoryGroup?: (values: string[]) => void;
  onClearFilters: () => void;
};

const CLOTHING_SUBCATS = ["Women", "Men", "Kids"];

function CustomerFiltersPanel({
  categories,
  filters,
  availableColors,
  hasActiveFilters,
  onClearFilters,
  onToggleFacet,
  onToggleCategoryGroup,
}: CustomerFiltersPanelProps) {
  const [clothingExpanded, setClothingExpanded] = useState(true);

  // Helper to check if a category (by ID or Name) is checked
  const isChecked = (idOrName: string) => {
    const target = idOrName.toLowerCase();
    return filters.category.some((val) => val.toLowerCase() === target);
  };

  // Find DB category IDs matching subcategory names
  const getSubcategoryMatchIds = (subName: string) => {
    const matched = categories.find(
      (c) => c.name.toLowerCase() === subName.toLowerCase(),
    );
    return matched ? [matched._id, matched.name] : [subName];
  };

  const clothingSubcatIds = CLOTHING_SUBCATS.flatMap(getSubcategoryMatchIds);
  const clothingParentCategory = categories.find(
    (c) => c.name.toLowerCase() === "clothing",
  );
  const allClothingIds = clothingParentCategory
    ? [...clothingSubcatIds, clothingParentCategory._id, clothingParentCategory.name]
    : clothingSubcatIds;

  const isClothingAllChecked = allClothingIds.some(isChecked);

  // Separate non-clothing categories
  const otherCategories = categories.filter((item) => {
    const name = item.name.toLowerCase();
    return name !== "clothing" && !CLOTHING_SUBCATS.some((sub) => sub.toLowerCase() === name);
  });

  return (
    <div className="space-y-6 overflow-y-auto px-4 py-2 lg:px-0 lg:py-0">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-foreground">Filters</h2>
        {hasActiveFilters ? (
          <Button
            variant="ghost"
            className="rounded-none px-2 text-sm text-muted-foreground hover:text-foreground"
            onClick={onClearFilters}
          >
            Clear All
          </Button>
        ) : null}
      </div>

      <Separator />

      {/* Category Section */}
      <section className="space-y-3">
        <h3 className="text-sm font-medium text-foreground">Categories</h3>

        <div className="space-y-2">
          {/* Clothing Group */}
          <div className="rounded-md border border-border/50 bg-secondary/20 p-2.5">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2.5 text-sm font-medium text-foreground cursor-pointer">
                <Checkbox
                  checked={isClothingAllChecked}
                  onCheckedChange={() => {
                    if (onToggleCategoryGroup) {
                      onToggleCategoryGroup(allClothingIds);
                    } else {
                      allClothingIds.forEach((id) => onToggleFacet("category", id));
                    }
                  }}
                />
                <span>Clothing</span>
              </label>

              <button
                type="button"
                onClick={() => setClothingExpanded((prev) => !prev)}
                className="text-muted-foreground hover:text-foreground p-1"
                aria-label="Toggle clothing subcategories"
              >
                {clothingExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
            </div>

            {clothingExpanded && (
              <div className="ml-6 mt-2.5 space-y-2 border-l border-border/60 pl-3">
                {CLOTHING_SUBCATS.map((subName) => {
                  const matchedCat = categories.find(
                    (c) => c.name.toLowerCase() === subName.toLowerCase(),
                  );
                  const valueToToggle = matchedCat ? matchedCat._id : subName;
                  const checked = matchedCat
                    ? isChecked(matchedCat._id) || isChecked(matchedCat.name)
                    : isChecked(subName);

                  return (
                    <label
                      key={subName}
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                      <Checkbox
                        checked={checked}
                        onCheckedChange={() => onToggleFacet("category", valueToToggle)}
                      />
                      <span>{subName}</span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          {/* Other Categories */}
          {otherCategories.map((item) => {
            const checked = isChecked(item._id) || isChecked(item.name);

            return (
              <label
                key={item._id}
                className="flex items-center gap-2.5 px-1 py-1 text-sm text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <Checkbox
                  checked={checked}
                  onCheckedChange={() => onToggleFacet("category", item._id)}
                />
                <span>{item.name}</span>
              </label>
            );
          })}
        </div>
      </section>

      <Separator />

      {/* Brands Section */}
      <section className="space-y-3">
        <h3 className="text-sm font-medium text-foreground">Brands</h3>
        <div className="space-y-1">
          {BRAND_OPTIONS.map((brand) => {
            const isActive = filters.brand === brand;

            return (
              <Button
                key={brand}
                type="button"
                variant={isActive ? "default" : "ghost"}
                className="w-full justify-start rounded-none"
                onClick={() => onToggleFacet("brand", brand)}
              >
                {brand}
              </Button>
            );
          })}
        </div>
      </section>

      <Separator />

      {/* Colors Section */}
      <section className="space-y-3">
        <h3 className="text-sm font-medium text-foreground">Colors</h3>
        <div className="flex flex-wrap gap-3">
          {availableColors.map((color) => {
            const isActive = filters.color === color;

            return (
              <button
                key={color}
                type="button"
                className={`flex flex-col items-center gap-2 text-xs ${
                  isActive ? "text-foreground font-medium" : "text-muted-foreground"
                }`}
                onClick={() => onToggleFacet("color", color)}
              >
                <span
                  className={`h-8 w-8 rounded-full border ${
                    isActive
                      ? "border-primary ring-2 ring-primary/30"
                      : "border-border"
                  }`}
                  style={{ backgroundColor: getSwatchColor(color) }}
                />
                <span className="capitalize">{color}</span>
              </button>
            );
          })}
        </div>
      </section>

      <Separator />

      {/* Sizes Section */}
      <section className="space-y-3">
        <h3 className="text-sm font-medium text-foreground">Sizes</h3>
        <div className="flex flex-wrap gap-2">
          {SIZE_OPTIONS.map((size) => {
            const isActive = filters.size === size;

            return (
              <Button
                key={size}
                type="button"
                variant={isActive ? "default" : "outline"}
                className="min-w-12 rounded-lg"
                onClick={() => onToggleFacet("size", size)}
              >
                {size}
              </Button>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export default CustomerFiltersPanel;
