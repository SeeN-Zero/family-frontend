import { create } from "zustand";

type SidebarStore = {
  isCollapsed: boolean;
  toggle: () => void;
  setCollapsed: (value: boolean) => void;
};

// Default: expanded. Mobile (< md) tidak pakai sidebar desktop (ada bottom-nav),
// tapi jika user resize ke mobile tetap pakai state terakhir. Inisialisasi awal
// expanded agar dashboard first-load langsung menampilkan label menu.
export const useSidebarStore = create<SidebarStore>((set) => ({
  isCollapsed: false,
  toggle: () => set((state) => ({ isCollapsed: !state.isCollapsed })),
  setCollapsed: (value) => set({ isCollapsed: value }),
}));
