import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { Comment } from '../types/demo';

interface CommentPopupProps {
  comment: Comment;
}

const CommentPopup: React.FC<CommentPopupProps> = ({ comment }) => {
  const [position, setPosition] = useState({ top: '50%', left: '50%' });

  useEffect(() => {
    const top = Math.random() * 50 + 25; // 25% to 75% from top
    const left = Math.random() * 50 + 20; // 20% to 70% from left
    setPosition({ top: `${top}%`, left: `${left}%` });
  }, []);

  const emotionColor = {
    positive: 'text-[#00FF87]',
    neutral: 'text-white',
    negative: 'text-red-500',
  }[comment.emotion];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.5, y: -20 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      style={position}
      className="absolute bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg"
    >
      <p className={`text-sm font-semibold ${emotionColor}`}>
        <span className="font-normal text-gray-300">{comment.username}: </span>
        {comment.text}
      </p>
    </motion.div>
  );
};

export default CommentPopup;
