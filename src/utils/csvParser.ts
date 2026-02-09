import type { EegChannel } from '@/types/eeg';
import { DEFAULT_CHANNEL_COLORS } from '@/types/eeg';

const CHANNEL_LABELS = [
  'Fp1', 'Fp2', 'F3', 'F4', 'F7', 'F8', 'T3', 'T4', 'C3', 'C4',
  'T5', 'T6', 'P3', 'P4', 'O1', 'O2', 'Fz', 'Cz', 'Pz',
];

export function parseCsvText(text: string): EegChannel[] {
  const lines = text.trim().split('\n');
  const numChannels = lines[0].split(',').length;

  const channels: number[][] = Array.from({ length: numChannels }, () => []);

  for (const line of lines) {
    const values = line.split(',');
    for (let ch = 0; ch < numChannels; ch++) {
      channels[ch].push(parseFloat(values[ch]));
    }
  }

  return channels.map((data, i) => ({
    label: i < CHANNEL_LABELS.length ? CHANNEL_LABELS[i] : `Ch${i + 1}`,
    data,
    color: DEFAULT_CHANNEL_COLORS[i % DEFAULT_CHANNEL_COLORS.length],
    visible: true,
    amplitude: 1,
  }));
}
