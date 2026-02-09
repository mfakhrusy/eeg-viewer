export interface EegChannel {
  label: string;
  data: number[];
  color: string;
  visible: boolean;
  amplitude: number;
}

export interface EegConfig {
  sampleRate: number;
  duration: number;
  channels: ChannelConfig[];
}

export interface ChannelConfig {
  label: string;
  frequencies: FrequencyBand[];
  noiseLevel: number;
}

export interface FrequencyBand {
  name: string;
  frequency: number;
  amplitude: number;
}

export const EEG_BANDS = {
  delta: { min: 0.5, max: 4, color: '#8b5cf6' },
  theta: { min: 4, max: 8, color: '#06b6d4' },
  alpha: { min: 8, max: 13, color: '#22c55e' },
  beta: { min: 13, max: 30, color: '#f59e0b' },
  gamma: { min: 30, max: 100, color: '#ef4444' },
} as const;

export const DEFAULT_CHANNEL_COLORS = [
  '#60a5fa', '#f472b6', '#34d399', '#fbbf24',
  '#a78bfa', '#fb923c', '#2dd4bf', '#f87171',
  '#818cf8', '#4ade80', '#e879f9', '#38bdf8',
  '#facc15', '#fb7185', '#a3e635', '#c084fc',
];
