import type { ModeratorStatus } from "@/openapi";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type StatusObject = {
  targetStatus: ModeratorStatus;
};

export interface StatusStoreProps {
  data: Record<string, StatusObject>;
  setData: (key: string, value: StatusObject) => void;
  deleteKey: (key: string) => void;
  clearData: () => void;
}

/**
 * Stores the target status for moderators. Used
 * to begin polling to check if the status has changed.
 */
export const useStatusStore = create<StatusStoreProps>()(
  persist(
    (set) => ({
      data: {},

      setData: (key, value) =>
        set((state) => ({
          data: {
            ...state.data,
            [key]: value,
          },
        })),

      deleteKey: (key) =>
        set((state) => {
          const newData = { ...state.data };
          delete newData[key];
          return { data: newData };
        }),

      clearData: () => set({ data: {} }),
    }),
    {
      name: "status-store",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
