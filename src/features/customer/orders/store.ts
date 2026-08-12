import { create } from "zustand";
import type { CustomerOrder } from "./types";
import {
  cancelCustomerOrder,
  getCustomerOrders,
  returnCustomerOrder,
} from "./api";
import { toast } from "sonner";

type CustomerOrdersStore = {
  isOpen: boolean;
  loading: boolean;
  items: CustomerOrder[];
  openOrders: () => Promise<void>;
  closeOrders: () => void;
  loadOrders: () => Promise<void>;
  returnOrder: (orderId: string) => Promise<void>;
  cancelOrder: (orderId: string) => Promise<void>;
  clear: () => void;
};

export const useCustomerOrdersStore = create<CustomerOrdersStore>(
  (set, get) => ({
    isOpen: false,
    loading: false,
    items: [],
    loadOrders: async () => {
      try {
        set({ loading: true });
        const response = await getCustomerOrders();
        set({ items: response?.items ?? [] });
      } catch {
        set({ items: [] });
      } finally {
        set({ loading: false });
      }
    },

    openOrders: async () => {
      set({ isOpen: true });
      await get().loadOrders();
    },
    closeOrders: () => set({ isOpen: false }),
    clear: () => {
      set({
        isOpen: false,
        loading: false,
        items: [],
      });
    },
    returnOrder: async (orderId) => {
      const confirmed = window.confirm(
        "Are you sure you want to return this order?",
      );
      if (!confirmed) return;

      try {
        const response = await returnCustomerOrder(orderId);

        set((state) => ({
          items: state.items.map((item) =>
            item._id === orderId
              ? {
                  ...item,
                  orderStatus: response?.orderStatus ?? item?.orderStatus,
                  returnedAt: response?.returnedAt ?? item.returnedAt ?? null,
                }
              : item,
          ),
        }));

        toast.success("Order return initiated successfully!");
      } catch (err: any) {
        toast.error(err?.message || "Failed to return order");
      }
    },
    cancelOrder: async (orderId) => {
      const confirmed = window.confirm(
        "Are you sure you want to cancel this order?",
      );
      if (!confirmed) return;

      try {
        const response = await cancelCustomerOrder(orderId);

        set((state) => ({
          items: state.items.map((item) =>
            item._id === orderId
              ? {
                  ...item,
                  orderStatus: response?.orderStatus ?? item?.orderStatus,
                  cancelledAt: response?.cancelledAt ?? item.cancelledAt ?? null,
                }
              : item,
          ),
        }));

        toast.success("Order cancelled successfully!");
      } catch (err: any) {
        toast.error(err?.message || "Failed to cancel order");
      }
    },
  }),
);
