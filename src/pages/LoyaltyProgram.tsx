import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  SparklesIcon,
  TrophyIcon,
  GiftIcon,
  ArrowPathIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const LoyaltyProgram = () => {
  const [selectedTier, setSelectedTier] = useState<string | null>(null);

  const { data: loyaltyData, isLoading } = useQuery({
    queryKey: ['loyalty', 'points'],
    queryFn: async () => {
      const response = await axios.get('/api/loyalty/my-points', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      return response.data;
    },
  });

  const { data: tiers } = useQuery({
    queryKey: ['loyalty', 'tiers'],
    queryFn: async () => {
      const response = await axios.get('/api/loyalty/tiers');
      return response.data;
    },
  });

  const tierColors: Record<string, string> = {
    bronze: 'from-orange-400 to-orange-600',
    silver: 'from-gray-300 to-gray-500',
    gold: 'from-yellow-300 to-yellow-500',
    platinum: 'from-purple-300 to-purple-500',
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
      </div>
    );
  }

  const currentTierData = tiers?.[loyaltyData?.tier];
  const nextTier =
    loyaltyData?.tier === 'bronze'
      ? 'silver'
      : loyaltyData?.tier === 'silver'
        ? 'gold'
        : loyaltyData?.tier === 'gold'
          ? 'platinum'
          : null;
  const nextTierData = nextTier ? tiers?.[nextTier] : null;
  const pointsToNext = nextTierData ? nextTierData.minPoints - loyaltyData?.lifetimePoints : 0;

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <SparklesIcon className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-white mb-4">CineMax Loyalty Program</h1>
          <p className="text-xl text-gray-400">
            Earn points with every booking and unlock exclusive rewards
          </p>
        </motion.div>

        {/* Current Status Card */}
        <motion.div
          className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg p-8 mb-12 border border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Your Status: {currentTierData?.name}
              </h2>
              <p className="text-gray-400">
                {loyaltyData?.totalPoints.toLocaleString()} points available
              </p>
            </div>
            <div
              className={`w-24 h-24 rounded-full bg-gradient-to-br ${tierColors[loyaltyData?.tier]} flex items-center justify-center`}
            >
              <TrophyIcon className="h-12 w-12 text-white" />
            </div>
          </div>

          {nextTierData && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Progress to {nextTierData.name}</span>
                <span className="text-sm text-gray-400">
                  {pointsToNext.toLocaleString()} points to go
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <motion.div
                  className="bg-gradient-to-r from-red-500 to-red-600 h-3 rounded-full"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${((loyaltyData?.lifetimePoints - currentTierData.minPoints) / (nextTierData.minPoints - currentTierData.minPoints)) * 100}%`,
                  }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
            </div>
          )}
        </motion.div>

        {/* How to Earn Section */}
        <motion.div
          className="bg-gray-800 rounded-lg p-8 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
            <GiftIcon className="h-6 w-6 mr-2" />
            How to Earn Points
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-red-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">1x</span>
              </div>
              <h4 className="text-white font-semibold mb-2">Book Tickets</h4>
              <p className="text-gray-400 text-sm">Earn points for every dollar spent</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">2x</span>
              </div>
              <h4 className="text-white font-semibold mb-2">Write Reviews</h4>
              <p className="text-gray-400 text-sm">Get bonus points for sharing your thoughts</p>
            </div>
            <div className="text-center">
              <div className="bg-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">3x</span>
              </div>
              <h4 className="text-white font-semibold mb-2">Refer Friends</h4>
              <p className="text-gray-400 text-sm">
                Earn when your friends make their first booking
              </p>
            </div>
          </div>
        </motion.div>

        {/* Tiers Section */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-white mb-6">Membership Tiers</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tiers &&
              Object.entries(tiers).map(([key, tier]: [string, any], index) => (
                <motion.div
                  key={key}
                  className={`bg-gray-800 rounded-lg p-6 border-2 cursor-pointer transition-all ${
                    loyaltyData?.tier === key
                      ? 'border-red-500 shadow-lg shadow-red-500/50'
                      : selectedTier === key
                        ? 'border-gray-600'
                        : 'border-gray-700 hover:border-gray-600'
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  onClick={() => setSelectedTier(key)}
                >
                  <div
                    className={`w-16 h-16 rounded-full bg-gradient-to-br ${tierColors[key]} flex items-center justify-center mx-auto mb-4`}
                  >
                    <TrophyIcon className="h-8 w-8 text-white" />
                  </div>

                  <h4 className="text-xl font-bold text-white text-center mb-2">{tier.name}</h4>

                  <p className="text-gray-400 text-sm text-center mb-4">
                    {tier.minPoints === 0
                      ? 'Starting tier'
                      : `${tier.minPoints.toLocaleString()}+ points`}
                  </p>

                  {loyaltyData?.tier === key && (
                    <div className="flex items-center justify-center mb-4">
                      <CheckCircleIcon className="h-5 w-5 text-green-400 mr-2" />
                      <span className="text-green-400 text-sm font-medium">Your Current Tier</span>
                    </div>
                  )}

                  <ul className="space-y-2">
                    {tier.benefits.map((benefit: string, idx: number) => (
                      <li key={idx} className="text-gray-300 text-sm flex items-start">
                        <span className="text-green-400 mr-2">✓</span>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
          </div>
        </div>

        {/* Recent Transactions */}
        {loyaltyData?.transactions && loyaltyData.transactions.length > 0 && (
          <motion.div
            className="bg-gray-800 rounded-lg p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
              <ArrowPathIcon className="h-6 w-6 mr-2" />
              Recent Activity
            </h3>
            <div className="space-y-4">
              {loyaltyData.transactions.slice(0, 10).map((transaction: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        transaction.type === 'earned'
                          ? 'bg-green-600'
                          : transaction.type === 'redeemed'
                            ? 'bg-red-600'
                            : transaction.type === 'bonus'
                              ? 'bg-blue-600'
                              : 'bg-gray-600'
                      }`}
                    >
                      {transaction.type === 'earned'
                        ? '+'
                        : transaction.type === 'redeemed'
                          ? '-'
                          : transaction.type === 'bonus'
                            ? '★'
                            : '•'}
                    </div>
                    <div>
                      <p className="text-white font-medium">{transaction.description}</p>
                      <p className="text-gray-400 text-sm">
                        {new Date(transaction.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`text-lg font-bold ${
                      transaction.points > 0 ? 'text-green-400' : 'text-red-400'
                    }`}
                  >
                    {transaction.points > 0 ? '+' : ''}
                    {transaction.points}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Redeem Section */}
        <motion.div
          className="bg-gradient-to-r from-red-600 to-red-700 rounded-lg p-8 mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <h3 className="text-2xl font-bold text-white mb-4">Ready to Redeem Your Points?</h3>
          <p className="text-white/90 mb-6">
            100 points = $1 discount • Minimum 500 points to redeem
          </p>
          <button
            disabled={loyaltyData?.totalPoints < 500}
            className="bg-white hover:bg-gray-100 text-red-600 font-bold px-8 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Redeem Points
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default LoyaltyProgram;
