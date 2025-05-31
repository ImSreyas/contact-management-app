import { create } from "zustand";

export const useProfileStore = create((set) => ({
  user: null,
  setUser: (user) =>
    set({
      user,
    }),
  removeUser: () =>
    set({
      user: null,
    }),
}));
