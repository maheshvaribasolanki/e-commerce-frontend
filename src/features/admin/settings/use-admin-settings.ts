import { useEffect, useMemo, useState } from "react";
import type { AdminBanner } from "./types";
import {
  createSampleAdminBanner,
  deleteAdminBanner,
  getAdminBanners,
  updateAdminBanner,
  uploadAdminBanners,
} from "./api";
import { toast } from "sonner";

export function useAdminSettings() {
  const [search, setSearch] = useState("");
  const [items, setItems] = useState<AdminBanner[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [bannerDialogOpen, setBannerDialogOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<AdminBanner | null>(null);
  const [deletingId, setDeletingId] = useState("");

  async function refreshBanners() {
    try {
      setLoading(true);
      const response = await getAdminBanners();
      setItems(response?.items ?? []);
    } catch (err: any) {
      toast.error(err?.message || "Failed to load banners");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refreshBanners();
  }, []);

  const filteredBanners = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return items;

    return items.filter(
      (item) =>
        item.imagePublicId.toLowerCase().includes(query) ||
        item.imageUrl.toLowerCase().includes(query),
    );
  }, [items, search]);

  function openCreateDialog() {
    setEditingBanner(null);
    setBannerDialogOpen(true);
  }

  function openEditDialog(banner: AdminBanner) {
    setEditingBanner(banner);
    setBannerDialogOpen(true);
  }

  function closeBannerDialog() {
    setEditingBanner(null);
    setBannerDialogOpen(false);
  }

  async function handleUpload() {
    if (!files.length) {
      toast.error("Please select at least one image to upload");
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      files.forEach((file) => formData.append("images", file));

      const response = await uploadAdminBanners(formData);
      setItems(response?.items ?? []);
      setFiles([]);
      toast.success("Homepage banners uploaded successfully!");
    } catch (e: any) {
      toast.error(e?.message || "Failed to upload banners");
    } finally {
      setUploading(false);
    }
  }

  async function autoFillSampleBanner() {
    const sampleBanners = [
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1400&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1400&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1400&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1400&auto=format&fit=crop&q=80",
    ];

    const randomBanner =
      sampleBanners[Math.floor(Math.random() * sampleBanners.length)];

    try {
      setUploading(true);
      const response = await createSampleAdminBanner(randomBanner);
      setItems(response?.items ?? []);
      toast.success("Sample homepage banner added successfully!");
    } catch (e: any) {
      toast.error(e?.message || "Failed to add sample banner");
    } finally {
      setUploading(false);
    }
  }

  async function saveBanner(payload: FormData | { imageUrl: string }) {
    try {
      setSaving(true);
      let response: { items: AdminBanner[] } | undefined;

      if (editingBanner) {
        response = await updateAdminBanner(editingBanner._id, payload);
        toast.success("Banner updated successfully!");
      } else {
        if (payload instanceof FormData) {
          response = await uploadAdminBanners(payload);
        } else {
          response = await createSampleAdminBanner(payload.imageUrl);
        }
        toast.success("Banner created successfully!");
      }

      setItems(response?.items ?? []);
      closeBannerDialog();
    } catch (err: any) {
      toast.error(err?.message || "Failed to save banner");
    } finally {
      setSaving(false);
    }
  }

  async function removeBanner(bannerId: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this banner?",
    );
    if (!confirmed) return;

    try {
      setDeletingId(bannerId);
      const response = await deleteAdminBanner(bannerId);
      setItems(response?.items ?? []);
      toast.success("Banner deleted successfully!");
    } catch (e: any) {
      toast.error(e?.message || "Failed to delete banner");
    } finally {
      setDeletingId("");
    }
  }

  const fileCountLabel = useMemo(() => {
    if (!files.length) return "No files selected";
    if (files.length === 1) return files[0].name;

    return `${files.length} files selected`;
  }, [files]);

  return {
    search,
    setSearch,
    items: filteredBanners,
    files,
    setFiles,
    fileCountLabel,
    loading,
    saving,
    uploading,
    bannerDialogOpen,
    setBannerDialogOpen,
    editingBanner,
    openCreateDialog,
    openEditDialog,
    closeBannerDialog,
    refreshBanners,
    handleUpload,
    autoFillSampleBanner,
    saveBanner,
    removeBanner,
    deletingId,
  };
}



