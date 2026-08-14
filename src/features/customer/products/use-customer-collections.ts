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

  const categoryParam = searchParams.get("category") || "";
  const categoryFilters = useMemo<string[]>(
    () => categoryParam.split(",").map((s) => s.trim()).filter(Boolean),
    [categoryParam],
  );

  const filters = useMemo<CustomerProductFilters>(
    () => ({
      category: categoryFilters,
      brand: searchParams.get("brand") || "",
      color: searchParams.get("color") || "",
      size: searchParams.get("size") || "",
    }),
    [categoryFilters, searchParams],
  );

  const sort = (searchParams.get("sort") as ProductSort) || "recent";

  const query = useMemo<GetCustomerProductsParams>(
    () => ({
      category: filters.category.length ? filters.category.join(",") : undefined,
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
    filters.category.length || filters.brand || filters.color || filters.size || searchKeyword,
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

  function updateParams(next: URLSearchParams) {
    setSearchParams(next);
  }

  const toggleCategory = useCallback(
    (value: string) => {
      const nextValue = new URLSearchParams(searchParams);
      const currentArr = (searchParams.get("category") || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const exists = currentArr.includes(value);
      const nextArr = exists
        ? currentArr.filter((item) => item !== value)
        : [...currentArr, value];

      if (nextArr.length === 0) {
        nextValue.delete("category");
      } else {
        nextValue.set("category", nextArr.join(","));
      }

      updateParams(nextValue);
    },
    [searchParams],
  );

  const toggleCategoryGroup = useCallback(
    (values: string[]) => {
      const nextValue = new URLSearchParams(searchParams);
      const currentArr = (searchParams.get("category") || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const allSelected = values.every((val) => currentArr.includes(val));
      let nextArr: string[];

      if (allSelected) {
        nextArr = currentArr.filter((val) => !values.includes(val));
      } else {
        const set = new Set([...currentArr, ...values]);
        nextArr = Array.from(set);
      }

      if (nextArr.length === 0) {
        nextValue.delete("category");
      } else {
        nextValue.set("category", nextArr.join(","));
      }

      updateParams(nextValue);
    },
    [searchParams],
  );

  const toggleFacet = (key: FacetKey, value: string) => {
    if (key === "category") {
      toggleCategory(value);
      return;
    }

    const nextValue = new URLSearchParams(searchParams);
    const currentValue = searchParams.get(key) || "";

    if (currentValue === value) {
      nextValue.delete(key);
    } else {
      nextValue.set(key, value);
    }

    updateParams(nextValue);
  };

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
    [searchParams],
  );

  const clearFilters = () => {
    const nextValue = new URLSearchParams(searchParams);
    nextValue.delete("category");
    nextValue.delete("brand");
    nextValue.delete("size");
    nextValue.delete("color");
    nextValue.delete("search");
    updateParams(nextValue);
  };

  async function loadAvailableColors() {
    try {
      const data = await getCustomerProducts();
      const uniqueColors = new Set<string>();

      (data ?? []).forEach((item) => {
        item.colors.forEach((color) => uniqueColors.add(color));
      });

      setAvailableColors(
        Array.from(uniqueColors).sort((a, b) => a.localeCompare(b)),
      );
    } catch {
      setAvailableColors([]);
    }
  }

  const activeFilterBadges = useMemo<ActiveFilterBadge[]>(() => {
    const items: ActiveFilterBadge[] = [];

    if (searchKeyword) {
      items.push({
        key: "search",
        label: "Search",
        value: `"${searchKeyword}"`,
      });
    }

    filters.category.forEach((catVal) => {
      const found = categories.find(
        (item) => item._id === catVal || item.name.toLowerCase() === catVal.toLowerCase(),
      );
      items.push({
        key: "category",
        label: "Category",
        value: found?.name || catVal,
      });
    });

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
    toggleCategory,
    toggleCategoryGroup,
    toggleFacet,
    clearFilters,
    activeFilterBadges,
  };
}
