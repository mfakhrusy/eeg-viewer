import { useRef } from 'react';
import { useEegStore } from '@/stores/eegStore';

const SAMPLE_FILES = [
  { label: 'Subject 00', file: 's00.csv' },
  { label: 'Subject 01', file: 's01.csv' },
];

export function Toolbar() {
  const { loadCsv, loadSample, timeWindow, setTimeWindow, scrollOffset, setScrollOffset, sampleRate, channels, fileName } =
    useEegStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const maxDuration = channels.length > 0 ? channels[0].data.length / sampleRate : 0;
  const maxOffset = Math.max(0, maxDuration - timeWindow);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      loadCsv(reader.result as string, file.name);
    };
    reader.readAsText(file);
  };

  const handleSampleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const file = e.target.value;
    if (file) loadSample(file);
  };

  return (
    <div className="flex items-center gap-4 bg-zinc-900 rounded-lg border border-zinc-800 p-3 flex-wrap">
      <label className="flex items-center gap-2 text-sm text-zinc-400">
        Sample
        <select
          value={fileName && SAMPLE_FILES.some((s) => s.file === fileName) ? fileName : ''}
          onChange={handleSampleChange}
          className="bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-zinc-300 text-sm"
        >
          {SAMPLE_FILES.map((s) => (
            <option key={s.file} value={s.file}>
              {s.label}
            </option>
          ))}
        </select>
      </label>

      <button
        onClick={() => fileInputRef.current?.click()}
        className="px-4 py-1.5 bg-zinc-700 hover:bg-zinc-600 text-white text-sm font-medium rounded transition-colors"
      >
        Upload CSV
      </button>
      <input ref={fileInputRef} type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />

      {fileName && (
        <span className="text-xs text-zinc-500">
          {fileName} · {maxDuration.toFixed(1)}s · {sampleRate} Hz
        </span>
      )}

      <div className="h-6 w-px bg-zinc-700" />

      <label className="flex items-center gap-2 text-sm text-zinc-400">
        Window
        <select
          value={timeWindow}
          onChange={(e) => setTimeWindow(Number(e.target.value))}
          className="bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-zinc-300 text-sm"
        >
          {[1, 2, 5, 10].map((v) => (
            <option key={v} value={v}>
              {v}s
            </option>
          ))}
        </select>
      </label>

      {maxDuration > 0 && (
        <>
          <div className="h-6 w-px bg-zinc-700" />
          <label className="flex items-center gap-2 text-sm text-zinc-400 flex-1 min-w-48">
            Scroll
            <input
              type="range"
              min={0}
              max={maxOffset}
              step={0.1}
              value={scrollOffset}
              onChange={(e) => setScrollOffset(parseFloat(e.target.value))}
              className="flex-1 accent-blue-500"
            />
            <span className="text-zinc-500 w-12 text-right">{scrollOffset.toFixed(1)}s</span>
          </label>
        </>
      )}
    </div>
  );
}
