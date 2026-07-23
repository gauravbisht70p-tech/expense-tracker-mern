const Transaction = require('../models/Transaction');
const { isInMemoryMode } = require('../config/db');

// In-memory store for when MongoDB is not available
let inMemoryTransactions = [];
let nextId = 1;

// @desc    Get all transactions for a user
// @route   GET /api/v1/transactions
// @access  Private
exports.getTransactions = async (req, res, next) => {
  try {
    if (isInMemoryMode()) {
      const userTransactions = inMemoryTransactions.filter(t => t.user === req.user.id);
      return res.status(200).json({
        success: true,
        count: userTransactions.length,
        data: userTransactions
      });
    }

    const transactions = await Transaction.find({ user: req.user.id }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: transactions.length,
      data: transactions
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Server Error' });
  }
}

// @desc    Add transaction
// @route   POST /api/v1/transactions
// @access  Private
exports.addTransaction = async (req, res, next) => {
  try {
    const { text, amount, type, category } = req.body;

    if (isInMemoryMode()) {
      if (!text || text.trim() === '') {
        return res.status(400).json({ success: false, error: 'Please add a title' });
      }
      if (amount === undefined || amount === null || isNaN(amount)) {
        return res.status(400).json({ success: false, error: 'Please add an amount' });
      }
      if (!type || !['income', 'expense'].includes(type)) {
        return res.status(400).json({ success: false, error: 'Please specify income or expense' });
      }

      const finalAmount = type === 'expense' ? -Math.abs(Number(amount)) : Math.abs(Number(amount));

      const newTransaction = {
        _id: String(nextId++),
        text: text.trim(),
        amount: finalAmount,
        type,
        category: category || 'Other',
        user: req.user.id,
        createdAt: new Date()
      };
      inMemoryTransactions.push(newTransaction);

      return res.status(201).json({ success: true, data: newTransaction });
    }

    const finalAmount = type === 'expense' ? -Math.abs(Number(amount)) : Math.abs(Number(amount));

    const transaction = await Transaction.create({
      text,
      amount: finalAmount,
      type,
      category: category || 'Other',
      user: req.user.id
    });

    return res.status(201).json({ success: true, data: transaction });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({ success: false, error: messages.join(', ') });
    }
    return res.status(500).json({ success: false, error: 'Server Error' });
  }
}

// @desc    Delete transaction
// @route   DELETE /api/v1/transactions/:id
// @access  Private
exports.deleteTransaction = async (req, res, next) => {
  try {
    if (isInMemoryMode()) {
      const index = inMemoryTransactions.findIndex(t => t._id === req.params.id && t.user === req.user.id);
      if (index === -1) {
        return res.status(404).json({ success: false, error: 'No transaction found' });
      }
      inMemoryTransactions.splice(index, 1);
      return res.status(200).json({ success: true, data: {} });
    }

    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ success: false, error: 'No transaction found' });
    }

    if (transaction.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: 'Not authorized' });
    }

    await Transaction.findByIdAndDelete(req.params.id);

    return res.status(200).json({ success: true, data: {} });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Server Error' });
  }
}