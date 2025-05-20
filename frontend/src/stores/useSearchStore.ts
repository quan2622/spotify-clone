import { create } from "zustand";
import { persist, createJSONStorage } from 'zustand/middleware'

interface SearchStore {
  dataSearch: string,
}

export const useSearchStore = create(
  persist<SearchStore>((set, get) => ({
    dataSearch: "",
  }), {
    name: "search-store",
    storage: createJSONStorage(() => sessionStorage),
  },
  )
)