import { useEegStore } from '@/stores/eegStore';

export function ChannelControls() {
  const { channels, toggleChannel, setAmplitude, selectChannel, selectedChannel } = useEegStore();

  if (channels.length === 0) return null;

  return (
    <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-4">
      <h3 className="text-sm font-semibold text-zinc-300 mb-3">Channels</h3>
      <div className="space-y-2">
        {channels.map((ch) => (
          <div
            key={ch.label}
            className={`flex items-center gap-3 p-2 rounded cursor-pointer transition-colors ${
              selectedChannel === ch.label ? 'bg-zinc-800' : 'hover:bg-zinc-800/50'
            }`}
            onClick={() => selectChannel(selectedChannel === ch.label ? null : ch.label)}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleChannel(ch.label);
              }}
              className={`w-3 h-3 rounded-full border-2 transition-colors ${
                ch.visible ? 'border-transparent' : 'border-zinc-600 bg-transparent'
              }`}
              style={{ backgroundColor: ch.visible ? ch.color : 'transparent' }}
            />
            <span className="text-sm text-zinc-300 flex-1">{ch.label}</span>
            <input
              type="range"
              min="0.1"
              max="5"
              step="0.1"
              value={ch.amplitude}
              onChange={(e) => setAmplitude(ch.label, parseFloat(e.target.value))}
              onClick={(e) => e.stopPropagation()}
              className="w-16 accent-zinc-500"
              title="Amplitude"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
