import { useState, useEffect } from 'react';
import type { Comment } from '../types/demo';
import { mockComments } from '../data/mockComments';

export const useMockComments = (isActive: boolean) => {
  const [activeComments, setActiveComments] = useState<Comment[]>([]);

  useEffect(() => {
    if (!isActive) {
      setActiveComments([]);
      return;
    }

    const interval = setInterval(() => {
      const randomCommentTemplate = mockComments[Math.floor(Math.random() * mockComments.length)];
      const newComment: Comment = {
        ...randomCommentTemplate,
        id: Date.now().toString() + Math.random(),
      };
      
      setActiveComments(prev => [...prev, newComment]);

      setTimeout(() => {
        setActiveComments(prev => prev.filter(c => c.id !== newComment.id));
      }, 3000);
    }, 4000); // New comment every 4 seconds

    return () => clearInterval(interval);
  }, [isActive]);

  return { activeComments };
};
