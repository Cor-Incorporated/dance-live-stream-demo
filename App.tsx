import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import Dashboard from './components/Dashboard';
import MyPage from './components/MyPage';
import StreamerMode from './components/StreamerMode';
import ViewerMode from './components/ViewerMode';
import type { AppMode } from './types/demo';

const pageVariants = {
  initial: { opacity: 0, x: 300 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -300 },
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.5,
};

function App() {
  const [mode, setMode] = useState<AppMode>('dashboard');
  const [selectedStreamId, setSelectedStreamId] = useState<string | null>(null);

  const handleStartStream = () => setMode('streamer');
  const handleSelectStream = (id: string) => {
    setSelectedStreamId(id);
    setMode('viewer');
  };
  const handleNextStream = (id: string) => {
    setSelectedStreamId(id);
    // modeは既にviewerなので変更不要、streamIdだけ更新
  };
  const handleGoToMyPage = () => setMode('mypage');
  const handleGoToDashboard = () => setMode('dashboard');

  const renderContent = () => {
    switch (mode) {
      case 'dashboard':
        return (
          <motion.div
            key="dashboard"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            transition={pageTransition}
          >
            <Dashboard
              onStartStream={handleStartStream}
              onSelectStream={handleSelectStream}
              onGoToMyPage={handleGoToMyPage}
            />
          </motion.div>
        );
      case 'streamer':
        return (
          <motion.div
            key="streamer"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            transition={pageTransition}
          >
            <StreamerMode onStop={handleGoToDashboard} onGoToMyPage={handleGoToMyPage} />
          </motion.div>
        );
      case 'viewer':
        return (
          <motion.div
            key={`viewer-${selectedStreamId}`}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            transition={pageTransition}
          >
            <ViewerMode 
              streamId={selectedStreamId!} 
              onExit={handleGoToDashboard}
              onNextStream={handleNextStream}
            />
          </motion.div>
        );
      case 'mypage':
        return (
          <motion.div
            key="mypage"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            transition={pageTransition}
          >
            <MyPage onBack={handleGoToDashboard} />
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-black text-white font-sans overflow-hidden antialiased" style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      <div className="mx-auto" style={{ width: '390px', height: '844px' }}>
          <AnimatePresence mode="wait">
            {renderContent()}
          </AnimatePresence>
      </div>
    </div>
  );
}

export default App;
