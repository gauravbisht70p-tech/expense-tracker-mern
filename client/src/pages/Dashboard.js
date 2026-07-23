import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { GlobalContext } from '../context/GlobalState';
import { numberWithCommas } from '../utils/format';
import { Wallet, TrendingUp, TrendingDown, Plus, Minus, Trash2, Receipt } from 'lucide-react';
import { AddTransactionModal } from '../components/AddTransactionModal';

const CATEGORY_EMOJIS = {
  Food: '🍕', Travel: '✈️', Shopping: '🛍️', Salary: '💰', Bills: '📄',
  Medical: '🏥', Entertainment: '🎬', Rent: '🏠', Education: '📚', Other: '📌'
};

export const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const { transactions, getTransactions, deleteTransaction } = useContext(GlobalContext);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('income');

  useEffect(() => {
    getTransactions();
    // eslint-disable-next-line
  }, []);

  const amounts = transactions.map(t => t.amount);
  const total = amounts.reduce((acc, item) => acc + item, 0).toFixed(2);
  const income = amounts.filter(i => i > 0).reduce((acc, item) => acc + item, 0).toFixed(2);
  const expense = (amounts.filter(i => i < 0).reduce((acc, item) => acc + item, 0) * -1).toFixed(2);

  const openModal = (type) => { setModalType(type); setModalOpen(true); };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="dashboard">
      <div className="welcome-section">
        <h1>Hello, {user?.name?.split(' ')[0]} 👋</h1>
        <p>Welcome back! Here's your financial overview.</p>
      </div>

      <div className="summary-cards">
        <div className="summary-card">
          <div className="summary-card-header">
            <div className="summary-card-icon balance"><Wallet size={18} /></div>
            <span className="summary-card-label">Balance</span>
          </div>
          <p className="summary-card-amount">&#8377;{numberWithCommas(total)}</p>
        </div>
        <div className="summary-card">
          <div className="summary-card-header">
            <div className="summary-card-icon income"><TrendingUp size={18} /></div>
            <span className="summary-card-label">Income</span>
          </div>
          <p className="summary-card-amount income-color">+&#8377;{numberWithCommas(income)}</p>
        </div>
        <div className="summary-card">
          <div className="summary-card-header">
            <div className="summary-card-icon expense"><TrendingDown size={18} /></div>
            <span className="summary-card-label">Expense</span>
          </div>
          <p className="summary-card-amount expense-color">-&#8377;{numberWithCommas(expense)}</p>
        </div>
      </div>

      <div className="quick-actions">
        <button className="btn-income" onClick={() => openModal('income')}>
          <Plus size={16} /> Add Income
        </button>
        <button className="btn-expense" onClick={() => openModal('expense')}>
          <Minus size={16} /> Add Expense
        </button>
      </div>

      <div className="transactions-section">
        <div className="section-header">
          <h2 className="section-title">Recent Transactions</h2>
          {transactions.length > 0 && <span className="section-count">{transactions.length}</span>}
        </div>
        {transactions.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon"><Receipt size={24} /></div>
            <h3>No transactions yet</h3>
            <p>Add your first income or expense to get started.</p>
          </div>
        ) : (
          <ul>
            {transactions.map(t => (
              <li key={t._id} className="transaction-item fade-in">
                <div className="transaction-cat-icon">
                  {CATEGORY_EMOJIS[t.category] || '📌'}
                </div>
                <div className="transaction-details">
                  <span className="transaction-title">{t.text}</span>
                  <div className="transaction-meta">
                    <span className="transaction-category">{t.category || 'Other'}</span>
                    <span className="transaction-date">· {formatDate(t.createdAt)}</span>
                  </div>
                </div>
                <span className={`transaction-amount ${t.amount < 0 ? 'expense' : 'income'}`}>
                  {t.amount < 0 ? '-' : '+'}&#8377;{numberWithCommas(Math.abs(t.amount))}
                </span>
                <button className="btn-danger" onClick={() => deleteTransaction(t._id)} aria-label="Delete transaction">
                  <Trash2 size={16} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {modalOpen && (
        <AddTransactionModal
          type={modalType}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
};
