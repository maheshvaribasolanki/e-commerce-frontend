import { useEffect, useMemo, useState } from "react";
import type { Promo, PromoFormValues } from "./types";
import {
  createAdminPromo,
  deleteAdminPromo,
  getAdminPromos,
  updateAdminPromo,
} from "./api";
import { toast } from "sonner";

export function useAdminPromos() {
  const [search, setSearch] = useState("");
  const [promos, setPromos] = useState<Promo[]>([]);
  const [loading, setLoading] = useState(true);
  const [promoDialogOpen, setPromoDialogOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<Promo | null>(null);
  const [deletingPromoId, setDeletingPromoId] = useState("");
  const [saving, setSaving] = useState(false);

  async function refreshAll() {
    try {
      setLoading(true);

      const response = await getAdminPromos();
      setPromos((response ?? { items: [] }).items);
    } catch (err: any) {
      toast.error(err?.message || "Failed to load promos");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refreshAll();
  }, []);

  const filteredPromos = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return promos;

    return promos.filter((promo) => promo.code.toLowerCase().includes(query));
  }, [promos, search]);

  function openCreateDialog() {
    setEditingPromo(null);
    setPromoDialogOpen(true);
  }

  function closePromoDialog() {
    setEditingPromo(null);
    setPromoDialogOpen(false);
  }

  function openEditDialog(promo: Promo) {
    setEditingPromo(promo);
    setPromoDialogOpen(true);
  }

  async function savePromo(values: PromoFormValues) {
    try {
      setSaving(true);

      const response = editingPromo
        ? await updateAdminPromo(editingPromo?._id, values)
        : await createAdminPromo(values);

      setPromos((response ?? { items: [] })?.items);
      toast.success(
        editingPromo
          ? "Promo code updated successfully!"
          : "Promo code created successfully!",
      );
      closePromoDialog();
    } catch (err: any) {
      toast.error(err?.message || "Failed to save promo");
    } finally {
      setSaving(false);
    }
  }

  async function removePromo(promoId: string) {
    const confirmed = window.confirm("Are you sure you want to delete this promo?");

    if (!confirmed) return;

    try {
      setDeletingPromoId(promoId);

      const response = await deleteAdminPromo(promoId);
      setPromos((response ?? { items: [] }).items);
      toast.success("Promo code deleted successfully!");
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete promo");
    } finally {
      setDeletingPromoId("");
    }
  }

  return {
    search,
    setSearch,
    promos: filteredPromos,
    loading,
    promoDialogOpen,
    setPromoDialogOpen,
    editingPromo,
    openCreateDialog,
    closePromoDialog,
    refreshAll,
    savePromo,
    removePromo,
    saving,
    deletingPromoId,
    openEditDialog,
  };
}
