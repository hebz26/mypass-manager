import { create } from "zustand";

const useUserProfileStore = create((set) => ({
  userProfile: null,
  setUserProfile: (userProfile) => set({ userProfile }),
  addCard: (card) =>
    set((state) => ({
      userProfile: {
        ...state.userProfile,
        cards: [card.id, ...state.userProfile.cards],
      },
    })),
  deleteCard: (cardId) =>
    set((state) => ({
      userProfile: {
        ...state.userProfile,
        cards: state.userProfile.cards.filter((id) => id !== cardId),
      },
    })),
}));

export default useUserProfileStore;
