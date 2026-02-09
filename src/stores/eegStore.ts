import { create } from 'zustand';
import type { EegChannel } from '@/types/eeg';
import { generateEegData, DEFAULT_EEG_CONFIG } from '@/utils/eegGenerator';
import { parseCsvText } from '@/utils/csvParser';

type DataSource = 'synthetic' | 'csv';

interface EegState {
  channels: EegChannel[];
  sampleRate: number;
  timeWindow: number;
  scrollOffset: number;
  selectedChannel: string | null;
  dataSource: DataSource;
  fileName: string | null;

  generate: () => void;
  loadCsv: (text: string, fileName: string, sampleRate?: number) => void;
  setTimeWindow: (window: number) => void;
  setScrollOffset: (offset: number) => void;
  toggleChannel: (label: string) => void;
  setAmplitude: (label: string, amplitude: number) => void;
  selectChannel: (label: string | null) => void;
}

export const useEegStore = create<EegState>((set) => ({
  channels: [],
  sampleRate: DEFAULT_EEG_CONFIG.sampleRate,
  timeWindow: 5,
  scrollOffset: 0,
  selectedChannel: null,
  dataSource: 'synthetic',
  fileName: null,

  generate: () => {
    const channels = generateEegData(DEFAULT_EEG_CONFIG);
    set({ channels, scrollOffset: 0, dataSource: 'synthetic', fileName: null, sampleRate: DEFAULT_EEG_CONFIG.sampleRate });
  },

  loadCsv: (text, fileName, sampleRate = 500) => {
    const channels = parseCsvText(text);
    set({ channels, scrollOffset: 0, dataSource: 'csv', fileName, sampleRate });
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
