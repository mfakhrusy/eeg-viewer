import { useRef } from 'react';
import { useEegStore } from '@/stores/eegStore';

export function Toolbar() {
  const { generate, loadCsv, timeWindow, setTimeWindow, scrollOffset, setScrollOffset, sampleRate, channels, dataSource, fileName } =
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

  const handleLoadSample = async () => {
    const res = await fetch('/data/s00.csv');
    const text = await res.text();
    loadCsv(text, 's00.csv');
  };

  return (
    <div className="flex items-center gap-4 bg-zinc-900 rounded-lg border border-zinc-800 p-3 flex-wrap">
      <div className="flex items-center gap-2">
        <button
          onClick={generate}
          className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded transition-colors"
        >
          Synthetic
        </button>
        <button
          onClick={handleLoadSample}
          className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded transition-colors"
        >
          Sample Data
        </button>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-4 py-1.5 bg-zinc-700 hover:bg-zinc-600 text-white text-sm font-medium rounded transition-colors"
        >
          Upload CSV
        </button>
        <input ref={fileInputRef} type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
      </div>

      {fileName && (
        <span className="text-xs text-zinc-500">
          {dataSource === 'csv' ? fileName : 'Synthetic'} · {maxDuration.toFixed(1)}s · {sampleRate} Hz
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
