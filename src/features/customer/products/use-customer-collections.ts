import type { Category } from "@/features/admin/products/types";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import type {
  CustomerProduct,
  GetCustomerProductsParams,
  ProductSort,
} from "./types";
import type {
  ActiveFilterBadge,
  CustomerProductFilters,
  FacetKey,
} from "./product-list.shared";
import { getCustomerCategories, getCustomerProducts } from "./api";

export function useCustomerProductList() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<CustomerProduct[]>([]);
  const [availableColors, setAvailableColors] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);

  const searchKeyword = searchParams.get("search") || "";

  const filters = useMemo<CustomerProductFilters>(
    () => ({
      category: searchParams.get("category") || "",
      brand: searchParams.get("brand") || "",
      color: searchParams.get("color") || "",
      size: searchParams.get("size") || "",
    }),
    [searchParams],
  );

  const sort = (searchParams.get("sort") as ProductSort) || "recent";

  const query = useMemo<GetCustomerProductsParams>(
    () => ({
      category: filters.category || undefined,
      brand: filters.brand || undefined,
      color: filters.color || undefined,
      sort,
      size: filters.size || undefined,
    }),
    [filters, sort],
  );

  const filteredProducts = useMemo(() => {
    if (!searchKeyword.trim()) return products;
    const term = searchKeyword.toLowerCase();
    return products.filter(
      (item) =>
        item.title.toLowerCase().includes(term) ||
        item.brand.toLowerCase().includes(term) ||
        (item.description && item.description.toLowerCase().includes(term)),
    );
  }, [products, searchKeyword]);

  const hasActiveFilters = Boolean(
    filters.category || filters.brand || filters.color || filters.size || searchKeyword,
  );

  async function loadCategories() {
    try {
      const data = await getCustomerCategories();
      setCategories(data ?? []);
    } catch {
      setCategories([]);
    }
  }

  async function loadProducts(params: GetCustomerProductsParams) {
    setLoading(true);

    try {
      const data = await getCustomerProducts(params);
      setProducts(data ?? []);
    } finally {
      setLoading(false);
    }
  }

  //   update params -> when user will select or deselect filters/sort

  function updateParams(next: URLSearchParams) {
    setSearchParams(next);
  }

  // toggle filter facets

  const toggleFacet = (key: FacetKey, value: string) => {
    const nextValue = new URLSearchParams(searchParams);
    const currentvalue = searchParams.get(key) || "";

    if (currentvalue === value) {
      nextValue.delete(key);
    } else {
      nextValue.set(key, value);
    }

    updateParams(nextValue);
  };

  // handle sort

  const changeSort = useCallback(
    (value: ProductSort) => {
      const nextValue = new URLSearchParams(searchParams);

      if (value === "recent") {
        nextValue.delete("sort");
      } else {
        nextValue.set("sort", value);
      }

      updateParams(nextValue);
    },
    [searchParams, updateParams],
  );

  //clear all filters

  const clearFilters = () => {
    const nextValue = new URLSearchParams(searchParams);
    nextValue.delete("category");
    nextValue.delete("brand");
    nextValue.delete("size");
    nextValue.delete("color");
    nextValue.delete("search");
    updateParams(nextValue);
  };

  // available colors

  async function loadAvailableColors() {
    try {
      setLoading(true);
      const data = await getCustomerProducts();
      const uniqueColors = new Set<string>();

      (data ?? []).forEach((item) => {
        item.colors.forEach((color) => uniqueColors.add(color));
      });

      setAvailableColors(
        Array.from(uniqueColors).sort((a, b) => a.localeCompare(b)),
      );
    } finally {
      setLoading(false);
    }
  }

  // active filter badges
  const activeFilterBadges = useMemo<ActiveFilterBadge[]>(() => {
    const items: ActiveFilterBadge[] = [];

    if (searchKeyword) {
      items.push({
        key: "search",
        label: "Search",
        value: `"${searchKeyword}"`,
      });
    }

    if (filters.category) {
      const found = categories.find((item) => item._id === filters.category);

      items.push({
        key: "category",
        label: "Category",
        value: found?.name || filters.category,
      });
    }

    if (filters.brand) {
      items.push({
        key: "brand",
        label: "Brand",
        value: filters.brand,
      });
    }

    if (filters.color) {
      items.push({
        key: "color",
        label: "Color",
        value: filters.color,
      });
    }

    if (filters.size) {
      items.push({
        key: "size",
        label: "Size",
        value: filters.size,
      });
    }

    return items;
  }, [categories, filters, searchKeyword]);

  useEffect(() => {
    void loadCategories();
  }, []);

  useEffect(() => {
    void loadProducts(query);
  }, [query]);

  useEffect(() => {
    void loadAvailableColors();
  }, []);

  return {
    categories,
    products: filteredProducts,
    loading,
    filters,
    sort,
    hasActiveFilters,
    changeSort,
    availableColors,
    toggleFacet,
    clearFilters,
    activeFilterBadges,
  };
}
