import { useEffect, useState } from "react";
import type { Category, Product, ProductFormState, ProductImage } from "./types";
import { createAdminProduct, updateAdminProduct } from "./api";
import { BRANDS } from "./constants";
import { toast } from "sonner";

type UseProductFormOptions = {
  open: boolean;
  product: Product | null;
  onSaved: () => Promise<void>;
  onClose: () => void;
};

function getEmptyForm(): ProductFormState {
  return {
    title: "",
    description: "",
    category: "",
    brand: "",
    colors: [],
    sizes: [],
    price: "",
    salePercentage: "0",
    stock: "",
    status: "active",
    existingImages: [],
    newFiles: [],
    coverImagePublicId: "",
  };
}

export function getCoverImage(images: ProductImage[] = []) {
  return images.find((img) => img.isCover) ?? images[0];
}

function mapProductToFormValues(product: Product): ProductFormState {
  const cover = getCoverImage(product.images);

  return {
    title: product.title,
    description: product.description,
    category: product.category._id,
    brand: product.brand,
    colors: product.colors ?? [],
    sizes: product.sizes ?? [],
    price: String(product.price),
    salePercentage: String(product.salePercentage ?? 0),
    stock: String(product.stock),
    status: product.status,
    existingImages: product.images ?? [],
    newFiles: [],
    coverImagePublicId: cover?.publicId ?? "",
  };
}

export function useProductForm({
  open,
  onClose,
  onSaved,
  product,
}: UseProductFormOptions) {
  const [form, setForm] = useState<ProductFormState>(getEmptyForm());
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(product ? mapProductToFormValues(product) : getEmptyForm());
  }, [open, product]);

  function toggleSize(size: string) {
    setForm((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((item) => item !== size)
        : [...prev.sizes, size],
    }));
  }

  function addColor(color: string) {
    setForm((prev) => ({
      ...prev,
      colors: prev.colors.includes(color)
        ? prev.colors
        : [...prev.colors, color],
    }));
  }

  function removeColor(color: string) {
    setForm((prev) => ({
      ...prev,
      colors: prev.colors.filter((item) => item !== color),
    }));
  }

  function addFiles(files: FileList | null) {
    if (!files?.length) return;

    setForm((prev) => ({
      ...prev,
      newFiles: [...prev.newFiles, ...Array.from(files)],
    }));
  }

  function updateField<K extends keyof ProductFormState>(
    key: K,
    value: ProductFormState[K],
  ) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function removeExistingImage(publicId: string) {
    setForm((prev) => {
      const nextImages = prev.existingImages.filter(
        (image) => image.publicId !== publicId,
      );

      const nextCoverImageId =
        prev.coverImagePublicId === publicId
          ? (nextImages[0]?.publicId ?? "")
          : prev.coverImagePublicId;

      return {
        ...prev,
        existingImages: nextImages,
        coverImagePublicId: nextCoverImageId,
      };
    });
  }

  function changeCoverImage(publicId: string) {
    updateField("coverImagePublicId", publicId);
  }

  async function submit() {
    if (!form.title.trim()) {
      toast.error("Please enter a product title");
      return;
    }
    if (!form.description.trim()) {
      toast.error("Please enter a description");
      return;
    }
    if (!form.category) {
      toast.error("Please select a category");
      return;
    }
    if (!form.brand) {
      toast.error("Please select a brand");
      return;
    }

    try {
      setSaving(true);

      if (product) {
        await updateAdminProduct(
          product._id,
          {
            title: form.title.trim(),
            description: form.description.trim(),
            category: form.category,
            brand: form.brand,
            colors: form.colors,
            sizes: form.sizes,
            price: Number(form.price),
            salePercentage: Number(form.salePercentage) || 0,
            stock: Number(form.stock),
            status: form.status,
            existingImages: form.existingImages,
            coverImagePublicId: form.coverImagePublicId || undefined,
          },
          form.newFiles,
        );
        toast.success("Product updated successfully!");
      } else {
        await createAdminProduct(
          {
            title: form.title.trim(),
            description: form.description.trim(),
            category: form.category,
            brand: form.brand,
            colors: form.colors,
            sizes: form.sizes,
            price: Number(form.price),
            salePercentage: Number(form.salePercentage) || 0,
            stock: Number(form.stock),
            status: form.status,
          },
          form.newFiles,
        );
        toast.success("Product created successfully!");
      }

      await onSaved();
      onClose();
    } catch (err: any) {
      toast.error(err?.message || "Failed to save product");
    } finally {
      setSaving(false);
    }
  }

  function autoFillSampleData(categories: Category[]) {
    const sampleProducts = [
      {
        title: "UltraSlim M15 Pro Gaming Laptop",
        description:
          "High performance laptop equipped with 16-core CPU, 32GB RAM, 1TB SSD, and 165Hz IPS anti-glare display for seamless gaming and work.",
        brand: "Nike",
        categoryName: "Laptops",
        price: "89999",
        salePercentage: "10",
        stock: "25",
        colors: ["#000000", "#1E293B"],
        sizes: ["M", "L"],
      },
      {
        title: "Pro Noise-Cancelling Wireless Headphones",
        description:
          "Premium over-ear wireless headphones with active noise cancellation, 40-hour battery life, and crystal-clear high fidelity audio.",
        brand: "Adidas",
        categoryName: "Electronics",
        price: "12999",
        salePercentage: "15",
        stock: "40",
        colors: ["#000000", "#FFFFFF", "#64748B"],
        sizes: [],
      },
      {
        title: "Men's Classic Slim-Fit Oxford Shirt",
        description:
          "100% premium breathable cotton tailored oxford shirt, perfect for formal and smart-casual occasions.",
        brand: "Tommy Hilfiger",
        categoryName: "Men",
        price: "2499",
        salePercentage: "20",
        stock: "60",
        colors: ["#FFFFFF", "#2563EB", "#64748B"],
        sizes: ["S", "M", "L", "XL"],
      },
      {
        title: "Women's Floral Chiffon Midi Summer Dress",
        description:
          "Elegantly crafted floral print dress featuring elasticated waist, gentle puff sleeves, and lightweight breathable fabric.",
        brand: "Zara",
        categoryName: "Women",
        price: "3299",
        salePercentage: "15",
        stock: "45",
        colors: ["#EC4899", "#F59E0B", "#10B981"],
        sizes: ["S", "M", "L"],
      },
      {
        title: "Kids' Active Cotton Hoodie & Joggers Set",
        description:
          "Cozy 100% organic cotton tracksuit ensemble designed for active play and everyday comfort for kids.",
        brand: "H&M",
        categoryName: "Kids",
        price: "1799",
        salePercentage: "10",
        stock: "50",
        colors: ["#2563EB", "#EC4899", "#000000"],
        sizes: ["S", "M"],
      },
      {
        title: "Urban Oversized Heavyweight Hoodie",
        description:
          "Designed for ultimate style and everyday comfort. Crafted with high-grade 400GSM cotton blend, drop shoulders, and durable double-stitched seams.",
        brand: "Nike",
        categoryName: "Clothing",
        price: "3499",
        salePercentage: "15",
        stock: "50",
        colors: ["#000000", "#1E293B", "#64748B"],
        sizes: ["S", "M", "L", "XL"],
      },
      {
        title: "Minimalist Retro Leather Sneakers",
        description:
          "Handcrafted low-top sneakers featuring genuine full-grain leather, cushioned memory foam insoles, and vulcanized rubber outsoles.",
        brand: "Adidas",
        categoryName: "Footwear",
        price: "4999",
        salePercentage: "20",
        stock: "30",
        colors: ["#FFFFFF", "#000000", "#D97706"],
        sizes: ["M", "L", "XL"],
      },
    ];

    const sample =
      sampleProducts[Math.floor(Math.random() * sampleProducts.length)];

    const matchedCategory = categories.find(
      (c) => c.name.toLowerCase() === sample.categoryName.toLowerCase(),
    );

    const selectedCategory =
      matchedCategory?._id ||
      (categories.length > 0 ? categories[0]._id : "") ||
      form.category;

    const selectedBrand = BRANDS.includes(sample.brand as any)
      ? sample.brand
      : BRANDS[0] || "";

    setForm((prev) => ({
      ...prev,
      title: sample.title,
      description: sample.description,
      brand: selectedBrand,
      category: selectedCategory,
      price: sample.price,
      salePercentage: sample.salePercentage,
      stock: sample.stock,
      status: "active",
      colors: sample.colors,
      sizes: sample.sizes as any,
    }));

    toast.success("Form auto-filled with sample product data!");
  }

  return {
    form,
    saving,
    isEditMode: !!product,
    toggleSize,
    addColor,
    removeColor,
    addFiles,
    submit,
    updateField,
    removeExistingImage,
    changeCoverImage,
    autoFillSampleData,
  };
}
