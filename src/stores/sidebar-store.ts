import { create } from "zustand";

type SidebarStore = {
  isCollapsed: boolean;
  toggle: () => void;
  setCollapsed: (value: boolean) => void;
};

export const useSidebarStore = create<SidebarStore>((set) => ({
  isCollapsed: true,
  toggle: () => set((state) => ({ isCollapsed: !state.isCollapsed })),
  setCollapsed: (value) => set({ isCollapsed: value }),
}));
