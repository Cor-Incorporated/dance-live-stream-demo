import React from 'react';

interface MyPageProps {
  onBack: () => void;
}

const BackIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
);

const MyPage: React.FC<MyPageProps> = ({ onBack }) => {
  const pastStreams = [
    { id: 1, title: 'ヒップホップ練習', score: 88, donations: 1500 },
    { id: 2, title: 'K-POPチャレンジ', score: 92, donations: 3200 },
    { id: 3, title: 'フリースタイル', score: 85, donations: 800 },
  ];

  const totalDonations = pastStreams.reduce((acc, stream) => acc + stream.donations, 0);
  const averageScore = pastStreams.reduce((acc, stream) => acc + stream.score, 0) / pastStreams.length;

  return (
    <div className="h-full w-full bg-[#1a1a1a] flex flex-col text-white">
      <header className="h-[60px] flex items-center px-4 bg-black relative">
        <button onClick={onBack} className="absolute left-4 p-2">
          <BackIcon />
        </button>
        <h1 className="text-xl font-bold text-center w-full">マイページ</h1>
      </header>
      
      <main className="flex-grow overflow-y-auto p-6 space-y-8">
        <section className="bg-[#2a2a2a] p-6 rounded-xl text-center">
            <img src="https://picsum.photos/seed/user/100" alt="User" className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-[#FF3B5C]" />
            <h2 className="text-2xl font-bold">Dancer_01</h2>
            <p className="text-gray-400">プロダンサー志望</p>
        </section>

        <section className="grid grid-cols-2 gap-4">
            <div className="bg-[#2a2a2a] p-4 rounded-xl text-center">
                <p className="text-sm text-gray-400">総獲得投げ銭</p>
                <p className="text-2xl font-bold text-[#FFD700]">¥{totalDonations.toLocaleString()}</p>
            </div>
            <div className="bg-[#2a2a2a] p-4 rounded-xl text-center">
                <p className="text-sm text-gray-400">平均スコア</p>
                <p className="text-2xl font-bold text-[#00D9FF]">{averageScore.toFixed(1)}</p>
            </div>
        </section>

        <section>
          <h3 className="text-lg font-bold mb-4">過去の配信履歴</h3>
          <div className="space-y-3">
            {pastStreams.map(stream => (
              <div key={stream.id} className="bg-[#2a2a2a] p-4 rounded-lg flex justify-between items-center">
                <div>
                  <p className="font-semibold">{stream.title}</p>
                  <p className="text-sm text-gray-400">スコア: <span className="text-[#00D9FF]">{stream.score}</span></p>
                </div>
                <p className="text-base font-semibold text-[#FFD700]">¥{stream.donations.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default MyPage;
