import { AnimatePresence, motion } from 'framer-motion';
import React, { useRef, useState } from 'react';
import { mockFeedback } from '../data/mockFeedback';
import { mockStreams } from '../data/mockStreams';
import { useMockComments } from '../hooks/useMockComments';
import { useRealtimeScore } from '../hooks/useRealtimeScore';
import CommentPopup from './CommentPopup';
import DonationModal from './DonationModal';
import FeedbackDisplay from './FeedbackDisplay';
import InsightsModal from './InsightsModal';
import RealtimeChart from './RealtimeChart';
import YouTubePlayerWrapper from './YouTubePlayerWrapper';

interface ViewerModeProps {
  streamId: string;
  onExit: () => void;
  onNextStream?: (streamId: string) => void;
}

const BackIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
);

const ViewerMode: React.FC<ViewerModeProps> = ({ streamId, onExit, onNextStream }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInsightsOpen, setIsInsightsOpen] = useState(false);
  const { scoreData, addDonation } = useRealtimeScore(true);
  const { activeComments } = useMockComments(true);
  const [feedback, setFeedback] = useState<string | null>(null);
  
  // スワイプ関連の状態
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const stream = mockStreams.find(s => s.id === streamId) || mockStreams[0];
  const currentIndex = mockStreams.findIndex(s => s.id === streamId);

  const handleDonate = (amount: 100 | 500 | 1000) => {
    const bonusScore = amount === 1000 ? 50 : amount === 500 ? 25 : 10;
    addDonation(amount, bonusScore);
    
    const extraFeedback = amount === 100 ? mockFeedback.extra[2] : (amount === 500 ? mockFeedback.extra[0] : mockFeedback.extra[1]);
    setFeedback(extraFeedback);
    setTimeout(() => setFeedback(null), 5000);
  };

  // スワイプ処理
  const minSwipeDistance = 50; // 最小スワイプ距離

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart({ x: e.targetTouches[0].clientX, y: e.targetTouches[0].clientY });
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!touchStart) return;
    const currentY = e.targetTouches[0].clientY;
    const diff = currentY - touchStart.y;
    setSwipeOffset(diff);
    setTouchEnd({ x: e.targetTouches[0].clientX, y: currentY });
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) {
      setSwipeOffset(0);
      return;
    }

    const distanceY = touchStart.y - touchEnd.y;
    const distanceX = Math.abs(touchStart.x - touchEnd.x);
    const isVerticalSwipe = Math.abs(distanceY) > distanceX;

    if (isVerticalSwipe && Math.abs(distanceY) > minSwipeDistance) {
      if (distanceY > 0) {
        // 上スワイプ → ダッシュボードに戻る
        onExit();
      } else {
        // 下スワイプ → 次の配信へ
        const nextIndex = (currentIndex + 1) % mockStreams.length;
        const nextStream = mockStreams[nextIndex];
        if (onNextStream) {
          onNextStream(nextStream.id);
        }
      }
    }

    setSwipeOffset(0);
    setTouchStart(null);
    setTouchEnd(null);
  };

  return (
    <motion.div 
      ref={containerRef}
      className="relative h-full w-full bg-black flex flex-col"
      style={{ y: swipeOffset }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* スワイプヒントインジケーター */}
      {swipeOffset !== 0 && (
        <div className="absolute inset-0 pointer-events-none z-50 flex items-center justify-center">
          {swipeOffset < -50 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0.8, scale: 1 }}
              className="bg-white/20 backdrop-blur-md rounded-full p-6"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </motion.div>
          )}
          {swipeOffset > 50 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0.8, scale: 1 }}
              className="bg-white/20 backdrop-blur-md rounded-full p-6"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </motion.div>
          )}
        </div>
      )}

      <header className="h-[250px] relative">
        <YouTubePlayerWrapper videoId={stream.youtubeVideoId} height="250" />
        <div className="absolute top-4 left-4 z-50">
            <button 
              onClick={onExit} 
              className="bg-black/50 p-2 rounded-full hover:bg-black/70 transition-colors pointer-events-auto"
            >
                <BackIcon />
            </button>
        </div>
        
        {/* スワイプガイドとインサイトボタン */}
        <div className="absolute top-4 right-4 z-40 flex flex-col gap-2">
          <button 
            onClick={() => setIsInsightsOpen(true)}
            className="bg-blue-600/80 hover:bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold"
          >
            📊 インサイト
          </button>
          <div className="bg-black/50 px-3 py-1 rounded-full text-xs text-white/70">
            上下スワイプ
          </div>
        </div>
      </header>

      <main className="flex-grow relative overflow-hidden">
        <div className="absolute inset-0">
            <AnimatePresence>
                {activeComments.map(comment => (
                    <CommentPopup key={comment.id} comment={comment} />
                ))}
            </AnimatePresence>
        </div>
        
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-4/5 h-40 opacity-70 pointer-events-none">
          <RealtimeChart data={scoreData} />
        </div>

        {/* 感情分析インジケーター */}
        <div className="absolute top-4 right-16 z-40 bg-black/50 backdrop-blur-md rounded-full px-3 py-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-green-400">{Math.floor(Math.random() * 20) + 70}%</span>
            </div>
            <div className="text-white/70">感情</div>
          </div>
        </div>

        {feedback && (
          <div className="absolute bottom-32 w-full pointer-events-none">
            <FeedbackDisplay feedback={feedback} />
          </div>
        )}
      </main>

      <footer className="h-[80px] flex items-center justify-center p-4 bg-black z-40">
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full h-14 bg-[#FFD700] text-black font-bold rounded-full flex items-center justify-center text-lg shadow-lg hover:bg-[#FFC700] transition-colors pointer-events-auto"
        >
          💰 投げ銭する
        </button>
      </footer>
      
      <DonationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onDonate={handleDonate}
      />
      
      {/* 詳細インサイトモーダル */}
      <InsightsModal
        isOpen={isInsightsOpen}
        onClose={() => setIsInsightsOpen(false)}
        scoreData={scoreData}
        activeComments={activeComments}
      />
    </motion.div>
  );
};

export default ViewerMode;
