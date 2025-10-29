import type { UserMe } from "@/openapi";
import { create } from "zustand";

export interface MeStoreProps {
  data?: UserMe;
  setData: (value: UserMe) => void;
}

export const useMeStore = create<MeStoreProps>()((set) => ({
  data: undefined,
  setData: (value) => set((state) => ({ ...state, data: value })),
}));
