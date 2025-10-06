import React, { useEffect, useRef, useState } from 'react';
import type { YouTubeProps } from 'react-youtube';
import YouTube from 'react-youtube';

interface YouTubePlayerWrapperProps {
  videoId: string;
  height: string;
  enablePlayPauseControl?: boolean; // 再生/一時停止コントロールを有効にするか（デフォルト: true）
  onPlayerReady?: (player: any) => void; // プレイヤーが準備完了したときのコールバック
}

// YouTube Player States
const YT_PLAYER_STATE = {
  UNSTARTED: -1,
  ENDED: 0,
  PLAYING: 1,
  PAUSED: 2,
  BUFFERING: 3,
  CUED: 5,
};

const YouTubePlayerWrapper: React.FC<YouTubePlayerWrapperProps> = ({ 
  videoId, 
  height, 
  enablePlayPauseControl = true,
  onPlayerReady
}) => {
  const [error, setError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showPlayPauseIcon, setShowPlayPauseIcon] = useState(false);
  const playerRef = useRef<any>(null);

  useEffect(() => {
    console.log('YouTubePlayerWrapper mounted with videoId:', videoId);
  }, [videoId]);

  const opts: YouTubeProps['opts'] = {
    height: height,
    width: '100%',
    playerVars: {
      autoplay: 1,
      controls: 0, // コントロールを非表示にしてカスタム制御を使用
      loop: 1,
      playlist: videoId,
      modestbranding: 1,
      rel: 0,
      origin: window.location.origin,
      enablejsapi: 1,
      iv_load_policy: 3,
      fs: 0,
      disablekb: 1, // キーボードコントロールを無効化
    },
  };

  const onReady = (event: any) => {
    console.log('YouTube Player Ready:', event);
    playerRef.current = event.target;
    setIsReady(true);
    // 自動再生を試みる
    event.target.playVideo();
    // 親コンポーネントにプレイヤーを渡す
    if (onPlayerReady) {
      onPlayerReady(event.target);
    }
  };

  const onError = (event: any) => {
    console.error('YouTube Player Error:', event);
    const errorMessages: { [key: number]: string } = {
      2: 'リクエストに無効なパラメータが含まれています',
      5: 'HTML5プレーヤーのエラー',
      100: '動画が見つかりません',
      101: '動画の所有者が埋め込みを許可していません',
      150: '動画の所有者が埋め込みを許可していません',
    };
    const errorCode = event.data;
    setError(errorMessages[errorCode] || `エラーコード: ${errorCode}`);
  };

  const onStateChange = (event: any) => {
    console.log('YouTube Player State:', event.data);
    const state = event.data;
    setIsPlaying(state === YT_PLAYER_STATE.PLAYING);
  };

  const togglePlayPause = () => {
    if (!playerRef.current) return;

    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }

    // アイコンを表示して1秒後に非表示
    setShowPlayPauseIcon(true);
    setTimeout(() => setShowPlayPauseIcon(false), 800);
  };

  return (
    <div className="w-full bg-black relative" style={{ height: height + 'px' }}>
      {/* 再生/一時停止用のオーバーレイ（enablePlayPauseControlがtrueの時のみ） */}
      {enablePlayPauseControl && isReady && !error && (
        <div 
          className="absolute inset-0 z-10 cursor-pointer"
          onClick={togglePlayPause}
        />
      )}

      {/* エラー表示 */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-900/80 text-white p-4 text-center pointer-events-none z-20">
          <div>
            <p className="font-bold mb-2">お手本動画の読み込みに失敗しました</p>
            <p className="text-xs mt-2 opacity-70">Video ID: {videoId}</p>
            <p className="text-xs mt-1 opacity-50">{error}</p>
          </div>
        </div>
      )}

      {/* 読み込み中表示 */}
      {!isReady && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 text-white pointer-events-none z-20">
          <div className="text-center">
            <div className="animate-pulse mb-2">読み込み中...</div>
            <p className="text-xs">Video ID: {videoId}</p>
          </div>
        </div>
      )}

      {/* 再生/一時停止アイコンのフィードバック */}
      {enablePlayPauseControl && showPlayPauseIcon && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
          <div className="bg-black/70 rounded-full p-6 animate-pulse">
            {isPlaying ? (
              // 再生アイコン（一時停止から再生に変わった時）
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
              </svg>
            ) : (
              // 一時停止アイコン（再生から一時停止に変わった時）
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
              </svg>
            )}
          </div>
        </div>
      )}

      {/* YouTube プレイヤー */}
      <div className="pointer-events-none">
        <YouTube 
          videoId={videoId} 
          opts={opts} 
          onReady={onReady}
          onError={onError}
          onStateChange={onStateChange}
          className="w-full h-full"
        />
      </div>
    </div>
  );
};

export default YouTubePlayerWrapper;
