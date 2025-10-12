const express = require('express');
const LoyaltyPoints = require('../models/LoyaltyPoints');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Get user's loyalty points
router.get('/my-points', authMiddleware, async (req, res) => {
  try {
    let loyalty = await LoyaltyPoints.findOne({ user: req.user.userId });

    if (!loyalty) {
      loyalty = new LoyaltyPoints({ user: req.user.userId });
      await loyalty.save();
    }

    // Remove expired points
    const now = new Date();
    let expiredPoints = 0;

    loyalty.transactions = loyalty.transactions.filter((transaction) => {
      if (transaction.type === 'earned' && transaction.expiresAt < now) {
        expiredPoints += transaction.points;
        return false;
      }
      return true;
    });

    if (expiredPoints > 0) {
      loyalty.totalPoints -= expiredPoints;
      loyalty.transactions.push({
        type: 'expired',
        points: -expiredPoints,
        description: 'Points expired',
      });
      await loyalty.save();
    }

    res.json(loyalty);
  } catch (error) {
    console.error('Get loyalty points error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get tier benefits
router.get('/tiers', async (req, res) => {
  try {
    const tiers = {
      bronze: {
        name: 'Bronze',
        minPoints: 0,
        benefits: [
          'Earn 1 point per $1 spent',
          'Birthday bonus: 50 points',
          'Early access to select movies',
        ],
        color: '#CD7F32',
      },
      silver: {
        name: 'Silver',
        minPoints: 2000,
        benefits: [
          'Earn 1.25 points per $1 spent',
          'Birthday bonus: 100 points',
          'Priority booking',
          '5% discount on tickets',
        ],
        color: '#C0C0C0',
      },
      gold: {
        name: 'Gold',
        minPoints: 5000,
        benefits: [
          'Earn 1.5 points per $1 spent',
          'Birthday bonus: 200 points',
          'VIP seating access',
          '10% discount on tickets',
          'Free small popcorn monthly',
        ],
        color: '#FFD700',
      },
      platinum: {
        name: 'Platinum',
        minPoints: 10000,
        benefits: [
          'Earn 2 points per $1 spent',
          'Birthday bonus: 500 points',
          'Complimentary seat upgrades',
          '15% discount on tickets',
          'Free medium popcorn & drink monthly',
          'Exclusive premiere invitations',
        ],
        color: '#E5E4E2',
      },
    };

    res.json(tiers);
  } catch (error) {
    console.error('Get tiers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Redeem points for discount
router.post('/redeem', authMiddleware, async (req, res) => {
  try {
    const { points } = req.body;

    if (!points || points <= 0) {
      return res.status(400).json({ message: 'Invalid points amount' });
    }

    const loyalty = await LoyaltyPoints.findOne({ user: req.user.userId });

    if (!loyalty) {
      return res.status(404).json({ message: 'Loyalty account not found' });
    }

    if (loyalty.totalPoints < points) {
      return res.status(400).json({ message: 'Insufficient points' });
    }

    // 100 points = $1 discount
    const discountAmount = points / 100;

    loyalty.redeemPoints(points, `Redeemed for $${discountAmount.toFixed(2)} discount`);
    await loyalty.save();

    res.json({
      message: 'Points redeemed successfully',
      discountAmount,
      remainingPoints: loyalty.totalPoints,
    });
  } catch (error) {
    console.error('Redeem points error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

// Get transaction history
router.get('/transactions', authMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const loyalty = await LoyaltyPoints.findOne({ user: req.user.userId });

    if (!loyalty) {
      return res.json({ transactions: [], pagination: { total: 0 } });
    }

    const transactions = loyalty.transactions
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice((page - 1) * limit, page * limit);

    res.json({
      transactions,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(loyalty.transactions.length / limit),
        total: loyalty.transactions.length,
      },
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
