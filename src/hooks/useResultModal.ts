// src/store/useNotificationStore.ts
import { create } from 'zustand';

interface NotificationState {
  isOpen: boolean;
  type: 'success' | 'error';
  title: string;
  message: string;
  lockerId?: string;
  onAction?: () => void;
  openNotification: (data: Omit<NotificationState, 'isOpen' | 'openNotification' | 'closeNotification'>) => void;
  closeNotification: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  isOpen: false,
  type: 'success',
  title: '',
  message: '',
  openNotification: (data) => set({ ...data, isOpen: true }),
  closeNotification: () => set({ isOpen: false }),
}));