const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  text: {
    type: String,
    trim: true,
    required: [true, 'Please add a title']
  },
  amount: {
    type: Number,
    required: [true, 'Please add an amount']
  },
  type: {
    type: String,
    enum: ['income', 'expense'],
    required: [true, 'Please specify income or expense']
  },
  category: {
    type: String,
    default: 'Other',
    enum: ['Food', 'Travel', 'Shopping', 'Salary', 'Bills', 'Medical', 'Entertainment', 'Rent', 'Education', 'Other']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Transaction', TransactionSchema);