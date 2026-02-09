# note: this is an ai-generated documentation for me (Fahru) to understand EEG

# EEG Primer for Developers

## What is EEG?

**Electroencephalography (EEG)** records electrical activity from the brain using small electrodes placed on the scalp. Neurons communicate via electrical impulses, and when large groups fire together, the combined signal is strong enough to detect from outside the skull.

Think of it like a microphone on a stadium roof — you can't hear individual conversations, but you can tell when the crowd roars.

## The Signal

An EEG signal is a **voltage over time**, typically measured in **microvolts (µV)**. A single electrode produces a continuous waveform — like audio, but much slower (most interesting activity is 0.5–100 Hz, compared to audio at 20–20,000 Hz).

```
         µV
    50 ┤  ╱╲      ╱╲
     0 ┤╱    ╲  ╱    ╲──
   -50 ┤      ╲╱
        └──────────────── time (seconds)
```

**Sample rate**: How many data points per second. Clinical EEG typically uses **256 Hz** (256 samples/second). Our app uses this as the default.

## Frequency Bands

The key concept in EEG is that the raw signal is a **mix of oscillations at different frequencies**. These are separated into named bands, each associated with different brain states:

| Band  | Frequency   | Associated With                        | In Our App                |
|-------|-------------|----------------------------------------|---------------------------|
| Delta | 0.5–4 Hz   | Deep sleep, unconsciousness            | `EEG_BANDS.delta`         |
| Theta | 4–8 Hz     | Drowsiness, light sleep, meditation    | `EEG_BANDS.theta`         |
| Alpha | 8–13 Hz    | Relaxed, eyes closed, calm wakefulness | `EEG_BANDS.alpha`         |
| Beta  | 13–30 Hz   | Active thinking, focus, anxiety        | `EEG_BANDS.beta`          |
| Gamma | 30–100 Hz  | High-level processing, perception      | `EEG_BANDS.gamma`         |

**Alpha waves** are the most recognizable — close your eyes and relax, and the back of your head produces strong ~10 Hz oscillations. This is why our synthetic data emphasizes alpha in occipital channels (O1, O2).

## Electrode Placement (The 10-20 System)

Electrodes are placed at standardized positions on the scalp, named by brain region and hemisphere:

```
        Nasion (nose)
            |
      Fp1 ──── Fp2        ← Frontopolar (forehead)
     /                \
   F3 ──── Fz ──── F4     ← Frontal
   |                  |
   C3 ──── Cz ──── C4     ← Central (top of head)
   |                  |
   P3 ──── Pz ──── P4     ← Parietal
     \                /
      O1 ──── O2           ← Occipital (back of head)
            |
        Inion (bump at back)
```

**Naming convention:**
- **Letter** = brain region (F=Frontal, C=Central, P=Parietal, O=Occipital, T=Temporal)
- **Odd numbers** = left hemisphere
- **Even numbers** = right hemisphere
- **z** = midline

Our app generates 8 channels: `Fp1, Fp2, F3, F4, C3, C4, O1, O2` — a simplified but realistic subset.

## Multi-Channel Display

Clinical EEG shows **multiple channels stacked vertically**, each scrolling left-to-right over time. This is exactly what our `WaveformViewer` renders:

```
Fp1  ─────/\──/\──/\──/\──────
Fp2  ───/\──/\──/\──/\────────
F3   ──/\/\/\/\/\/\/\/\/──────
F4   ─/\/\/\/\/\/\/\/\/\/─────
C3   ──────/\──/\──/\────────
C4   ─────/\──/\──/\─────────
O1   ─/\─/\─/\─/\─/\─/\──────   ← Strong alpha here
O2   ─/\─/\─/\─/\─/\─/\──────
      |_________________________|
      0s                      5s
```

**Amplitude scaling** controls how "tall" each channel's waveform appears. The slider in `ChannelControls` adjusts this per channel.

## How Our Synthetic Data Works

Since we can't use real patient data, `eegGenerator.ts` creates realistic-looking signals by:

1. **Summing sine waves** at specific frequencies (e.g., 10 Hz alpha + 20 Hz beta)
2. **Adding random noise** to simulate biological variability
3. **Varying parameters per channel** to mimic how different brain regions produce different activity

```
signal(t) = Σ amplitude × sin(2π × frequency × t) + noise
```

This is a simplification — real EEG is non-stationary and far more complex — but it produces visually convincing waveforms for a portfolio demo.

## Key Concepts for Future Features

### Power Spectral Density (PSD)
Use FFT (Fast Fourier Transform) to decompose a signal into its frequency components. Shows "how much alpha, how much beta" etc. as a bar chart or line plot.

### Spectrogram
A heatmap of frequency power over time. X-axis = time, Y-axis = frequency, color = power. Reveals how brain rhythms change dynamically.

### Topographic Map (Scalp Map)
A 2D head outline with colors showing signal power at each electrode location. Interpolates between electrodes to create a smooth heatmap over the whole scalp.

### Montage
How channels are referenced. **Referential** = each electrode vs. a common reference. **Bipolar** = difference between adjacent electrodes (e.g., Fp1-F3). Changes how the waveforms look.

### Artifacts
Non-brain signals that contaminate EEG: eye blinks (big spikes in Fp1/Fp2), muscle tension, electrical interference. Detecting and removing these is a core EEG processing challenge.

## Further Reading

- [OpenBCI Learning Pages](https://docs.openbci.com/GettingStarted/Boards/CytonGS/) — Beginner-friendly EEG hardware/software docs
- [MNE-Python Tutorials](https://mne.tools/stable/auto_tutorials/index.html) — Gold standard EEG analysis library (Python, but concepts transfer)
- [Niedermeyer's Electroencephalography](https://en.wikipedia.org/wiki/Niedermeyer%27s_Electroencephalography) — The clinical EEG reference textbook
