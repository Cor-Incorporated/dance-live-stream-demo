import { useState, useEffect, useCallback } from 'react';
import type { ScoreData } from '../types/demo';

const MAX_DATA_POINTS = 12; // 12 points * 5s = 60s of data

export const useRealtimeScore = (isActive: boolean) => {
  const [scoreData, setScoreData] = useState<ScoreData[]>([]);

  useEffect(() => {
    if (!isActive) {
        setScoreData([]); // Reset when inactive
        return;
    }

    const initialData: ScoreData = {
        timestamp: Date.now(),
        score: 75,
        donationAmount: 0,
        commentCount: 0,
        emotionAvg: 0.7,
      };
    setScoreData([initialData]);

    const interval = setInterval(() => {
      setScoreData(prev => {
        const lastData = prev[prev.length - 1] || initialData;
        const newScore: ScoreData = {
          timestamp: Date.now(),
          score: Math.min(100, lastData.score + (Math.random() * 6 - 3)), // Fluctuate score
          donationAmount: lastData.donationAmount,
          commentCount: lastData.commentCount + Math.floor(Math.random() * 3),
          emotionAvg: Math.min(1.0, Math.max(0, lastData.emotionAvg + (Math.random() * 0.1 - 0.05))), // 0.7-1.0
        };
        return [...prev, newScore].slice(-MAX_DATA_POINTS);
      });
    }, 5000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive]);

  const addDonation = useCallback((amount: number, bonusScore: number) => {
    setScoreData(prev => {
      if (prev.length === 0) return [];
      const lastData = { ...prev[prev.length - 1] };
      lastData.donationAmount += amount;
      lastData.score = Math.min(100, lastData.score + bonusScore);
      return [...prev.slice(0, -1), lastData];
    });
  }, []);

  return { scoreData, addDonation };
};
