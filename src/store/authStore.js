import { create } from "zustand";

// Creating a Zustand store. This is a singleton store for global state management.
// Since Zustand uses hooks, there is only one instance of this store, shared across the application, which is why it's a singleton.

const useAuthStore = create((set) => ({
  user: (() => {
    const storedUser = localStorage.getItem("user-info");
    try {
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Error parsing user-info from localStorage:", error);
      return null; // Fallback if the stored data is invalid or can't be parsed
    }
  })(),
  login: (user) => set({ user }),
  logout: () => set({ user: null }),
  setUser: (user) => set({ user }),
}));

export default useAuthStore;
