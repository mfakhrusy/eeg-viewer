import { useEffect } from 'react';
import { WaveformViewer } from '@/components/WaveformViewer';
import { ChannelControls } from '@/components/ChannelControls';
import { Toolbar } from '@/components/Toolbar';
import { useEegStore } from '@/stores/eegStore';

function App() {
  const generate = useEegStore((s) => s.generate);

  useEffect(() => {
    generate();
  }, [generate]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="border-b border-zinc-800 px-6 py-4">
        <h1 className="text-xl font-bold tracking-tight">EEG Visualizer</h1>
        <p className="text-sm text-zinc-500 mt-1">Multi-channel electroencephalography signal viewer</p>
      </header>

      <main className="max-w-7xl mx-auto p-6 space-y-4">
        <Toolbar />
        <div className="grid grid-cols-[1fr_200px] gap-4">
          <WaveformViewer />
          <ChannelControls />
        </div>
      </main>
    </div>
  );
}

export default App;
