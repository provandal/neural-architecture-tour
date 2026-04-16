import { useEffect } from 'react';
import { useStore } from './store';
import Landing from './components/Landing';
import TourView from './components/TourView';

function App() {
  const mode = useStore((s) => s.mode);
  const initDarkMode = useStore((s) => s.initDarkMode);

  useEffect(() => {
    initDarkMode();
  }, [initDarkMode]);

  return (
    <div className="min-h-dvh">
      {mode === 'landing' && <Landing />}
      {mode === 'tour' && <TourView />}
    </div>
  );
}

export default App;
