import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDonate: (amount: 100 | 500 | 1000) => void;
}

const Coin: React.FC = () => (
    <motion.div
      initial={{ y: 0, scale: 0, opacity: 0 }}
      animate={{ y: -300, scale: [1, 1.5, 1], rotate: 720, opacity: [1, 1, 0] }}
      transition={{ duration: 1.2, ease: "circOut" }}
      className="text-6xl absolute"
    >
      💰
    </motion.div>
);


const DonationModal: React.FC<DonationModalProps> = ({ isOpen, onClose, onDonate }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const amounts: (100 | 500 | 1000)[] = [100, 500, 1000];

  const handleDonate = (amount: 100 | 500 | 1000) => {
    setIsAnimating(true);
    setTimeout(() => {
      onDonate(amount);
      setIsAnimating(false);
      onClose();
    }, 1200);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 50 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-[#2a2a2a] p-8 rounded-2xl w-80 text-center relative"
          >
            {isAnimating && <Coin />}
            <h2 className="text-xl font-bold mb-6">投げ銭で応援！</h2>
            <div className="grid grid-cols-3 gap-4">
              {amounts.map((amount) => (
                <button
                  key={amount}
                  onClick={() => handleDonate(amount)}
                  disabled={isAnimating}
                  className="bg-[#FFD700] text-black font-bold py-4 rounded-lg transform transition-transform hover:scale-110 disabled:opacity-50"
                >
                  ¥{amount}
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DonationModal;
