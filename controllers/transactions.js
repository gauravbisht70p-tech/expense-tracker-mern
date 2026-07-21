const Transaction = require('../models/Transaction');
const { isInMemoryMode } = require('../config/db');

// In-memory store for when MongoDB is not available
let inMemoryTransactions = [];
let nextId = 1;

// @desc    Get all transactions
// @route   GET /api/v1/transactions
// @access  Public
exports.getTransactions = async (req, res, next) => {
  try {
    if (isInMemoryMode()) {
      return res.status(200).json({
        success: true,
        count: inMemoryTransactions.length,
        data: inMemoryTransactions
      });
    }

    const transactions = await Transaction.find();

    return res.status(200).json({
      success: true,
      count: transactions.length,
      data: transactions
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
}

// @desc    Add transaction
// @route   POST /api/v1/transactions
// @access  Public
exports.addTransaction = async (req, res, next) => {
  try {
    const { text, amount } = req.body;

    if (isInMemoryMode()) {
      if (!text || text.trim() === '') {
        return res.status(400).json({
          success: false,
          error: ['Please add some text']
        });
      }
      if (amount === undefined || amount === null || isNaN(amount)) {
        return res.status(400).json({
          success: false,
          error: ['Please add a positive or negative number']
        });
      }

      const newTransaction = {
        _id: String(nextId++),
        text,
        amount: Number(amount),
        createdAt: new Date()
      };
      inMemoryTransactions.push(newTransaction);

      return res.status(201).json({
        success: true,
        data: newTransaction
      });
    }

    const transaction = await Transaction.create(req.body);
  
    return res.status(201).json({
      success: true,
      data: transaction
    }); 
  } catch (err) {
    if(err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);

      return res.status(400).json({
        success: false,
        error: messages
      });
    } else {
      return res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  }
}

// @desc    Delete transaction
// @route   DELETE /api/v1/transactions/:id
// @access  Public
exports.deleteTransaction = async (req, res, next) => {
  try {
    if (isInMemoryMode()) {
      const index = inMemoryTransactions.findIndex(t => t._id === req.params.id);
      if (index === -1) {
        return res.status(404).json({
          success: false,
          error: 'No transaction found'
        });
      }
      inMemoryTransactions.splice(index, 1);

      return res.status(200).json({
        success: true,
        data: {}
      });
    }

    const transaction = await Transaction.findById(req.params.id);

    if(!transaction) {
      return res.status(404).json({
        success: false,
        error: 'No transaction found'
      });
    }

    await Transaction.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      data: {}
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
}