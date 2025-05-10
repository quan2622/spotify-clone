import { create } from "zustand";
import { axiosIntance } from "../lib/axios";
import { dataAnalystType } from "../types";

interface AnalystStore {
  isLoading: boolean,
  error: string | null,
  dataAnalyst: dataAnalystType[],
  total: Array<{ label: string; value: number }>;
  typeAnalyst: string,

  getDataAnalyst: (type?: string) => Promise<void>
}

export const useAnalystStore = create<AnalystStore>((set, get) => ({
  isLoading: false,
  error: null,
  dataAnalyst: [],
  total: [],
  typeAnalyst: 'month',

  getDataAnalyst: async (type?: string) => {
    set({ isLoading: true, error: null });
    try {
      const selectedType = type || get().typeAnalyst;

      const res = await axiosIntance.get(`stats/statsHistory?type=${selectedType}`);
      const data: dataAnalystType[] = res.data;

      const rawTotal = data.reduce(
        (acc, item) => {
          acc.listen += item.totalListen;
          acc.login += item.totalLogin;
          return acc;
        },
        { listen: 0, login: 0 },
      );

      const totalArray = [
        { label: 'Login', value: rawTotal.login },
        { label: 'Listen', value: rawTotal.listen }
      ];


      set({
        dataAnalyst: res.data,
        total: totalArray,
      });
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  }
}))