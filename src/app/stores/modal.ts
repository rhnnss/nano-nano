import { create } from "zustand";

type ModalActionType = {
  isOpenModalAction: boolean;
  onOpenChangeModalAction: () => void;
};

export const useModalAction = create<ModalActionType>()((set) => ({
  isOpenModalAction: false,
  onOpenChangeModalAction: () =>
    set((state) => ({ isOpenModalAction: !state.isOpenModalAction })),
}));
