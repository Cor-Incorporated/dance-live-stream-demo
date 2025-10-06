import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FeedbackDisplayProps {
  feedback: string | null;
}

const FeedbackDisplay: React.FC<FeedbackDisplayProps> = ({ feedback }) => {
  return (
    <div className="h-16 flex items-center justify-center p-2">
      <AnimatePresence mode="wait">
        <motion.div
          key={feedback}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="bg-black/50 backdrop-blur-md text-white text-center text-sm font-semibold px-6 py-3 rounded-full"
        >
          {feedback}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default FeedbackDisplay;
