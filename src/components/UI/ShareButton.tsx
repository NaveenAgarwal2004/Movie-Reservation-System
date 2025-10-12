import React, { useState } from 'react';
import { ShareIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import { shareOnSocial } from '../../utils/socialShare';
import toast from 'react-hot-toast';

interface ShareButtonProps {
  title: string;
  text: string;
  url: string;
  className?: string;
}

const ShareButton: React.FC<ShareButtonProps> = ({ title, text, url, className = '' }) => {
  const [showModal, setShowModal] = useState(false);

  const shareOptions = [
    { name: 'Facebook', icon: '📘', color: 'bg-blue-600', action: () => shareOnSocial.facebook({ title, text, url }) },
    { name: 'Twitter', icon: '🐦', color: 'bg-sky-500', action: () => shareOnSocial.twitter({ title, text, url }) },
    { name: 'WhatsApp', icon: '💬', color: 'bg-green-600', action: () => shareOnSocial.whatsapp({ title, text, url }) },
    { name: 'Telegram', icon: '✈️', color: 'bg-blue-500', action: () => shareOnSocial.telegram({ title, text, url }) },
    { name: 'Email', icon: '📧', color: 'bg-gray-600', action: () => shareOnSocial.email({ title, text, url }) },
  ];

  const handleCopyLink = async () => {
    const result = await shareOnSocial.copyLink(url);
    if (result.success) {
      toast.success(result.message);
      setShowModal(false);
    } else {
      toast.error(result.message);
    }
  };

  const handleNativeShare = async () => {
    const result = await shareOnSocial.native({ title, text, url });
    if (result.success) {
      setShowModal(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className={`flex items-center space-x-2 ${className}`}
      >
        <ShareIcon className="h-5 w-5" />
        <span>Share</span>
      </button>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              className="fixed inset-0 bg-black/75"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
            />

            <motion.div
              className="bg-gray-800 rounded-lg p-6 max-w-md w-full relative z-10"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Share</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                {shareOptions.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      option.action();
                      setShowModal(false);
                    }}
                    className="flex flex-col items-center space-y-2 p-4 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
                  >
                    <div className={`w-12 h-12 rounded-full ${option.color} flex items-center justify-center text-2xl`}>
                      {option.icon}
                    </div>
                    <span className="text-white text-sm">{option.name}</span>
                  </button>
                ))}
              </div>

              <div className="space-y-3">
                {navigator.share && (
                  <button
                    onClick={handleNativeShare}
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-medium transition-colors"
                  >
                    More Options
                  </button>
                )}

                <button
                  onClick={handleCopyLink}
                  className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-medium transition-colors"
                >
                  Copy Link
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ShareButton;