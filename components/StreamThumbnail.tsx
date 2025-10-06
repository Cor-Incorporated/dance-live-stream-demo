import React from 'react';
import type { StreamData } from '../types/demo';

interface StreamThumbnailProps {
  stream: StreamData;
  onClick: (id: string) => void;
}

const StreamThumbnail: React.FC<StreamThumbnailProps> = ({ stream, onClick }) => {
  return (
    <div 
      className="relative rounded-lg overflow-hidden cursor-pointer transform transition-transform duration-300 hover:scale-105"
      onClick={() => onClick(stream.id)}
    >
      <img src={stream.thumbnail} alt={stream.title} className="w-full h-64 object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
      
      <div className="absolute top-2 left-2 bg-[#FF3B5C] text-white px-2 py-1 text-xs font-bold rounded">
        LIVE
      </div>
      
      <div className="absolute bottom-2 left-2 text-white">
        <h3 className="font-bold text-sm">{stream.title}</h3>
        <p className="text-xs text-gray-300">{stream.viewerCount} viewers</p>
      </div>
    </div>
  );
};

export default StreamThumbnail;
