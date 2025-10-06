import React, { useEffect, useRef, useState } from 'react';
import { mockFeedback } from '../data/mockFeedback';
import { useRealtimeScore } from '../hooks/useRealtimeScore';
import FeedbackDisplay from './FeedbackDisplay';
import InsightsModal from './InsightsModal';
import RealtimeChart from './RealtimeChart';
import WebcamView from './WebcamView';
import YouTubePlayerWrapper from './YouTubePlayerWrapper';

interface StreamerModeProps {
  onStop: () => void;
  onGoToMyPage: () => void;
}

const PauseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const PlayIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="currentColor">
        <path d="M8 5v14l11-7z"/>
    </svg>
);

const PauseVideoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="currentColor">
        <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
    </svg>
);

const SkipBackIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor">
        <path d="M11 18V6l-8.5 6 8.5 6zm.5-6l8.5 6V6l-8.5 6z"/>
    </svg>
);

const SkipForwardIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor">
        <path d="M4 18l8.5-6L4 6v12zm9-12v12l8.5-6L13 6z"/>
    </svg>
);

const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
    </svg>
  );

const StreamerMode: React.FC<StreamerModeProps> = ({ onStop, onGoToMyPage }) => {
  const [isStreaming, setIsStreaming] = useState(true);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [isInsightsOpen, setIsInsightsOpen] = useState(false);
  const { scoreData } = useRealtimeScore(isStreaming);
  const [currentFeedback, setCurrentFeedback] = useState<string | null>(mockFeedback.regular[0]);
  const youtubePlayerRef = useRef<any>(null);
  
  // シークバー関連の状態
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const progressUpdateInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isStreaming) return;
    const feedbackInterval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * mockFeedback.regular.length);
      setCurrentFeedback(mockFeedback.regular[randomIndex]);
    }, 10000);

    return () => clearInterval(feedbackInterval);
  }, [isStreaming]);
  
  const lastScore = scoreData.length > 0 ? scoreData[scoreData.length - 1] : null;

  const handlePlayerReady = (player: any) => {
    youtubePlayerRef.current = player;
    
    // 動画の総時間を取得
    const videoDuration = player.getDuration();
    setDuration(videoDuration);
    
    // 進捗を定期的に更新
    progressUpdateInterval.current = setInterval(() => {
      if (youtubePlayerRef.current && !isSeeking) {
        const time = youtubePlayerRef.current.getCurrentTime();
        setCurrentTime(time);
      }
    }, 100); // 100msごとに更新
  };

  const toggleVideoPlayback = () => {
    if (!youtubePlayerRef.current) return;
    
    if (isVideoPlaying) {
      youtubePlayerRef.current.pauseVideo();
    } else {
      youtubePlayerRef.current.playVideo();
    }
    setIsVideoPlaying(!isVideoPlaying);
  };

  const handleSeek = (time: number) => {
    if (!youtubePlayerRef.current) return;
    youtubePlayerRef.current.seekTo(time, true);
    setCurrentTime(time);
  };

  const handleSeekBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * duration;
    handleSeek(newTime);
  };

  const handleSeekBarMouseDown = () => {
    setIsSeeking(true);
  };

  const handleSeekBarMouseUp = () => {
    setIsSeeking(false);
  };

  const skipBackward = () => {
    const newTime = Math.max(0, currentTime - 5);
    handleSeek(newTime);
  };

  const skipForward = () => {
    const newTime = Math.min(duration, currentTime + 5);
    handleSeek(newTime);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // クリーンアップ
  useEffect(() => {
    return () => {
      if (progressUpdateInterval.current) {
        clearInterval(progressUpdateInterval.current);
      }
    };
  }, []);

  return (
    <div className="relative h-full w-full bg-black flex flex-col">
      <div className="h-[380px] w-full relative">
        <YouTubePlayerWrapper 
          videoId="dQw4w9WgXcQ" 
          height="380" 
          enablePlayPauseControl={false}
          onPlayerReady={handlePlayerReady}
        />
        {/* お手本動画コントロールパネル */}
        <div className="absolute bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-black/90 via-black/70 to-transparent p-4 pt-12">
          {/* シークバー */}
          <div className="mb-3">
            <div 
              className="relative h-1 bg-white/30 rounded-full cursor-pointer group"
              onClick={handleSeekBarClick}
              onMouseDown={handleSeekBarMouseDown}
              onMouseUp={handleSeekBarMouseUp}
            >
              {/* 進捗バー */}
              <div 
                className="absolute h-full bg-[#FF3B5C] rounded-full transition-all"
                style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
              />
              {/* ハンドル */}
              <div 
                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ left: `${duration > 0 ? (currentTime / duration) * 100 : 0}%`, marginLeft: '-6px' }}
              />
            </div>
            {/* 時間表示 */}
            <div className="flex justify-between text-xs text-white/70 mt-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
          
          {/* コントロールボタン */}
          <div className="flex items-center justify-center gap-4">
            <button 
              onClick={skipBackward}
              className="bg-black/50 hover:bg-black/70 p-2 rounded-full transition-colors backdrop-blur-sm"
              title="5秒戻る"
            >
              <SkipBackIcon />
            </button>
            
            <button 
              onClick={toggleVideoPlayback}
              className="bg-[#FF3B5C] hover:bg-[#FF5070] p-3 rounded-full transition-colors shadow-lg"
              title={isVideoPlaying ? 'お手本動画を一時停止' : 'お手本動画を再生'}
            >
              {isVideoPlaying ? <PauseVideoIcon /> : <PlayIcon />}
            </button>
            
            <button 
              onClick={skipForward}
              className="bg-black/50 hover:bg-black/70 p-2 rounded-full transition-colors backdrop-blur-sm"
              title="5秒進む"
            >
              <SkipForwardIcon />
            </button>
          </div>
        </div>
        
        {/* お手本動画ラベル */}
        <div className="absolute top-4 left-4 z-40 bg-black/50 px-3 py-1 rounded-full text-xs text-white/70">
          お手本動画
        </div>
      </div>
      <div className="h-[380px] w-full">
        <WebcamView />
      </div>
      
      {/* Overlay UI */}
      <div className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none">
        {/* Header */}
        <div className="flex justify-between items-start w-full pointer-events-auto">
            <button onClick={onStop} className="bg-red-500 text-white px-4 py-2 rounded-full font-bold">
                配信終了
            </button>
            <div className="bg-black/50 p-2 rounded-lg flex flex-col items-center space-y-1">
                <div className="text-xs text-red-400">● LIVE</div>
                <div className="text-xs">視聴者: 18</div>
                {/* 感情分析インジケーター */}
                <div className="flex items-center gap-1 mt-1">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                  <span className="text-xs text-green-400">{Math.floor(Math.random() * 15) + 80}%</span>
                </div>
            </div>
            <button onClick={onGoToMyPage} className="p-2">
                <UserIcon />
            </button>
        </div>
        
        {/* Footer with feedback */}
        <div className="w-full">
           <FeedbackDisplay feedback={currentFeedback} />
        </div>
      </div>
      
      {/* Side chart and pause button */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col items-center space-y-4 pointer-events-auto">
        <div className="w-24 h-48 bg-black/50 backdrop-blur-md rounded-lg p-2">
            <RealtimeChart data={scoreData} />
        </div>
        <div className="text-center text-white bg-black/50 p-2 rounded-lg">
            <p className="text-xs text-[#00D9FF]">Score</p>
            <p className="font-bold text-lg">{lastScore ? lastScore.score.toFixed(0) : 'N/A'}</p>
        </div>
        <button onClick={() => setIsStreaming(!isStreaming)} className="p-2">
          <PauseIcon />
        </button>
        <button 
          onClick={() => setIsInsightsOpen(true)} 
          className="bg-blue-600/80 hover:bg-blue-600 text-white p-2 rounded-lg text-xs font-semibold"
        >
          📊 詳細
        </button>
      </div>
      
      {/* 詳細インサイトモーダル */}
      <InsightsModal
        isOpen={isInsightsOpen}
        onClose={() => setIsInsightsOpen(false)}
        scoreData={scoreData}
        activeComments={[]}
      />
    </div>
  );
};

export default StreamerMode;
