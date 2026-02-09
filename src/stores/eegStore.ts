import { create } from 'zustand';
import type { EegChannel } from '@/types/eeg';
import { parseCsvText } from '@/utils/csvParser';

interface EegState {
  channels: EegChannel[];
  sampleRate: number;
  timeWindow: number;
  scrollOffset: number;
  selectedChannel: string | null;
  fileName: string | null;
  loading: boolean;

  loadCsv: (text: string, fileName: string, sampleRate?: number) => void;
  loadSample: (file?: string) => Promise<void>;
  setTimeWindow: (window: number) => void;
  setScrollOffset: (offset: number) => void;
  toggleChannel: (label: string) => void;
  setAmplitude: (label: string, amplitude: number) => void;
  selectChannel: (label: string | null) => void;
}

export const useEegStore = create<EegState>((set) => ({
  channels: [],
  sampleRate: 500,
  timeWindow: 5,
  scrollOffset: 0,
  selectedChannel: null,
  fileName: null,
  loading: false,

  loadCsv: (text, fileName, sampleRate = 500) => {
    set({ loading: true });
    const channels = parseCsvText(text);
    set({ channels, scrollOffset: 0, fileName, sampleRate, loading: false });
  },

  loadSample: async (file = 's00.csv') => {
    set({ loading: true });
    const res = await fetch(`/data/${file}`);
    const text = await res.text();
    const channels = parseCsvText(text);
    set({ channels, scrollOffset: 0, fileName: file, sampleRate: 500, loading: false });
  },

  setTimeWindow: (timeWindow) =>
    set((state) => {
      const duration = state.channels[0]?.data.length
        ? state.channels[0].data.length / state.sampleRate
        : 0;
      const maxOffset = Math.max(0, duration - timeWindow);
      return { timeWindow, scrollOffset: Math.min(state.scrollOffset, maxOffset) };
    }),

  setScrollOffset: (scrollOffset) =>
    set((state) => {
      const duration = state.channels[0]?.data.length
        ? state.channels[0].data.length / state.sampleRate
        : 0;
      const maxOffset = Math.max(0, duration - state.timeWindow);
      const clampedOffset = Math.max(0, Math.min(scrollOffset, maxOffset));
      return { scrollOffset: clampedOffset };
    }),

  toggleChannel: (label) =>
    set((state) => ({
      channels: state.channels.map((ch) =>
        ch.label === label ? { ...ch, visible: !ch.visible } : ch
      ),
    })),

  setAmplitude: (label, amplitude) =>
    set((state) => ({
      channels: state.channels.map((ch) =>
        ch.label === label ? { ...ch, amplitude } : ch
      ),
    })),

  selectChannel: (selectedChannel) => set({ selectedChannel }),
}));
