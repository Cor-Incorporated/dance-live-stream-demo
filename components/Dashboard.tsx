import React from 'react';
import { mockStreams } from '../data/mockStreams';
import StreamThumbnail from './StreamThumbnail';

interface DashboardProps {
  onStartStream: () => void;
  onSelectStream: (id: string) => void;
  onGoToMyPage: () => void;
}

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
  </svg>
);

const CameraIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
);


const Dashboard: React.FC<DashboardProps> = ({ onStartStream, onSelectStream, onGoToMyPage }) => {
  return (
    <div className="h-full w-full bg-[#1a1a1a] flex flex-col">
      <header className="h-[60px] flex justify-between items-center px-4 bg-black">
        <h1 className="text-xl font-bold">Live Dance</h1>
        <button onClick={onGoToMyPage} className="p-2">
          <UserIcon />
        </button>
      </header>
      
      <main className="flex-grow overflow-y-auto p-4">
        <div className="grid grid-cols-2 gap-4">
          {mockStreams.map(stream => (
            <StreamThumbnail key={stream.id} stream={stream} onClick={onSelectStream} />
          ))}
        </div>
      </main>
      
      <footer className="h-[80px] flex items-center justify-center p-4 bg-black">
        <button 
          onClick={onStartStream}
          className="w-full h-14 bg-[#FF3B5C] text-white font-bold rounded-full flex items-center justify-center text-lg shadow-lg transform transition-transform hover:scale-105"
        >
          <CameraIcon />
          配信開始
        </button>
      </footer>
    </div>
  );
};

export default Dashboard;
