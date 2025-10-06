import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';

interface InsightsModalProps {
  isOpen: boolean;
  onClose: () => void;
  scoreData: any[];
  activeComments: any[];
}

const InsightsModal: React.FC<InsightsModalProps> = ({ isOpen, onClose, scoreData, activeComments }) => {
  const lastScore = scoreData.length > 0 ? scoreData[scoreData.length - 1] : null;
  const totalDonations = lastScore?.donationAmount || 0;
  const avgScore = scoreData.length > 0 
    ? (scoreData.reduce((sum, d) => sum + d.score, 0) / scoreData.length).toFixed(1)
    : 'N/A';
  
  // 感情分析の計算（モック）
  const positiveComments = activeComments.filter(c => c.emotion === 'positive').length;
  const totalComments = activeComments.length;
  const positiveRate = totalComments > 0 ? Math.round((positiveComments / totalComments) * 100) : 85;

  const insights = [
    {
      title: 'パフォーマンス分析',
      items: [
        `平均スコア: ${avgScore}点`,
        `最高スコア: ${Math.max(...scoreData.map(d => d.score))}点`,
        `安定度: ${Math.floor(Math.random() * 20) + 75}%`,
      ]
    },
    {
      title: '視聴者エンゲージメント',
      items: [
        `ポジティブ率: ${positiveRate}%`,
        `総投げ銭: ¥${totalDonations.toLocaleString()}`,
        `コメント数: ${totalComments}件`,
      ]
    },
    {
      title: 'AIアドバイス',
      items: [
        positiveRate > 80 ? '視聴者の反応が絶好調！この調子で続けよう' : 'もう少し視聴者とのやり取りを増やそう',
        totalDonations > 500 ? '投げ銭が順調！感謝の気持ちを伝えよう' : '投げ銭の呼びかけタイミングを意識しよう',
        parseFloat(avgScore) > 85 ? 'スキルが向上中！自信を持ってパフォーマンスしよう' : '基本動作を意識して精度を上げよう',
      ]
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gray-900 rounded-2xl p-6 max-w-sm w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* ヘッダー */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">📊 詳細インサイト</h2>
              <button
                onClick={onClose}
                className="text-white/70 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* インサイト内容 */}
            <div className="space-y-6">
              {insights.map((section, index) => (
                <div key={index} className="bg-gray-800/50 rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-white mb-3">{section.title}</h3>
                  <ul className="space-y-2">
                    {section.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="text-sm text-gray-300 flex items-start">
                        <span className="text-blue-400 mr-2">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* アクションボタン */}
            <div className="mt-6 pt-4 border-t border-gray-700">
              <button
                onClick={onClose}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors"
              >
                閉じる
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InsightsModal;
