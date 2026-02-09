import type { ChannelConfig, EegChannel, EegConfig } from '@/types/eeg';
import { DEFAULT_CHANNEL_COLORS } from '@/types/eeg';

export function generateSignal(config: ChannelConfig, sampleRate: number, duration: number): number[] {
  const numSamples = sampleRate * duration;
  const data = new Array<number>(numSamples);

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    let value = 0;

    for (const band of config.frequencies) {
      value += band.amplitude * Math.sin(2 * Math.PI * band.frequency * t);
    }

    value += (Math.random() - 0.5) * 2 * config.noiseLevel;
    data[i] = value;
  }

  return data;
}

export function generateEegData(config: EegConfig): EegChannel[] {
  return config.channels.map((ch, i) => ({
    label: ch.label,
    data: generateSignal(ch, config.sampleRate, config.duration),
    color: DEFAULT_CHANNEL_COLORS[i % DEFAULT_CHANNEL_COLORS.length],
    visible: true,
    amplitude: 1,
  }));
}

export const DEFAULT_EEG_CONFIG: EegConfig = {
  sampleRate: 256,
  duration: 10,
  channels: [
    {
      label: 'Fp1',
      frequencies: [
        { name: 'alpha', frequency: 10, amplitude: 20 },
        { name: 'beta', frequency: 20, amplitude: 5 },
      ],
      noiseLevel: 3,
    },
    {
      label: 'Fp2',
      frequencies: [
        { name: 'alpha', frequency: 10.5, amplitude: 18 },
        { name: 'beta', frequency: 22, amplitude: 6 },
      ],
      noiseLevel: 3,
    },
    {
      label: 'F3',
      frequencies: [
        { name: 'theta', frequency: 6, amplitude: 15 },
        { name: 'alpha', frequency: 9, amplitude: 25 },
      ],
      noiseLevel: 4,
    },
    {
      label: 'F4',
      frequencies: [
        { name: 'theta', frequency: 5.5, amplitude: 14 },
        { name: 'alpha', frequency: 9.5, amplitude: 22 },
      ],
      noiseLevel: 4,
    },
    {
      label: 'C3',
      frequencies: [
        { name: 'alpha', frequency: 11, amplitude: 30 },
        { name: 'beta', frequency: 18, amplitude: 8 },
      ],
      noiseLevel: 2,
    },
    {
      label: 'C4',
      frequencies: [
        { name: 'alpha', frequency: 10, amplitude: 28 },
        { name: 'beta', frequency: 19, amplitude: 7 },
      ],
      noiseLevel: 2,
    },
    {
      label: 'O1',
      frequencies: [
        { name: 'alpha', frequency: 10, amplitude: 40 },
        { name: 'delta', frequency: 2, amplitude: 10 },
      ],
      noiseLevel: 5,
    },
    {
      label: 'O2',
      frequencies: [
        { name: 'alpha', frequency: 10.2, amplitude: 38 },
        { name: 'delta', frequency: 1.5, amplitude: 12 },
      ],
      noiseLevel: 5,
    },
  ],
};
