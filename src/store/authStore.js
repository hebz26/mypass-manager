import { create } from "zustand";

// Creating a Zustand store. This is a singleton store for global state management.
// Since Zustand uses hooks, there is only one instance of this store, shared across the application, which is why it's a singleton.

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem("user-info") || "null"),
  login: (user) => set({ user }),
  logout: () => set({ user: null }),
  setUser: (user) => set({ user }),
}));

export default useAuthStore;
