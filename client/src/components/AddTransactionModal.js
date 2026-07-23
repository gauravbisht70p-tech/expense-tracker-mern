import React, { useState, useContext } from 'react';
import { GlobalContext } from '../context/GlobalState';
import { X } from 'lucide-react';

const CATEGORIES = ['Food', 'Travel', 'Shopping', 'Salary', 'Bills', 'Medical', 'Entertainment', 'Rent', 'Education', 'Other'];

export const AddTransactionModal = ({ type, onClose }) => {
  const [text, setText] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(type === 'income' ? 'Salary' : 'Food');
  const [transactionType, setTransactionType] = useState(type);

  const { addTransaction } = useContext(GlobalContext);

  const onSubmit = (e) => {
    e.preventDefault();
    if (!text.trim() || !amount) return;

    addTransaction({
      text: text.trim(),
      amount: Number(amount),
      type: transactionType,
      category
    });

    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add Transaction</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={onSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label>Type</label>
              <div className="type-toggle">
                <button
                  type="button"
                  className={`type-btn ${transactionType === 'income' ? 'active-income' : ''}`}
                  onClick={() => { setTransactionType('income'); setCategory('Salary'); }}
                >
                  Income
                </button>
                <button
                  type="button"
                  className={`type-btn ${transactionType === 'expense' ? 'active-expense' : ''}`}
                  onClick={() => { setTransactionType('expense'); setCategory('Food'); }}
                >
                  Expense
                </button>
              </div>
            </div>

            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Grocery shopping"
                value={text}
                onChange={e => setText(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div className="form-group">
              <label>Amount (₹)</label>
              <input
                type="number"
                className="form-input"
                placeholder="0.00"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                required
                min="0.01"
                step="0.01"
              />
            </div>

            <div className="form-group">
              <label>Category</label>
              <select
                className="form-select"
                value={category}
                onChange={e => setCategory(e.target.value)}
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose} style={{ flex: 1 }}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" style={{ flex: 1 }}>
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
