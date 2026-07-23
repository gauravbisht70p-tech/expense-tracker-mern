const express = require('express');
const router = express.Router();
const { getTransactions, addTransaction, deleteTransaction } = require('../controllers/transactions');
const { protect } = require('../middleware/auth');

router
  .route('/')
  .get(protect, getTransactions)
  .post(protect, addTransaction);

router
  .route('/:id')
  .delete(protect, deleteTransaction);

module.exports = router;