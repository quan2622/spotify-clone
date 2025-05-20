import { create } from "zustand";
import { persist, createJSONStorage } from 'zustand/middleware'

interface SearchStore {
  dataSearch: string,
}

export const useSearchStore = create(
  persist<SearchStore>(() => ({
    dataSearch: "",
  }), {
    name: "search-store",
    storage: createJSONStorage(() => sessionStorage),
  },
  )
)