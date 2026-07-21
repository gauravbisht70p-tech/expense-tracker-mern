import React, { useContext, useEffect } from 'react';
import { Transaction } from './Transaction';

import { GlobalContext } from '../context/GlobalState';

export const TransactionList = () => {
  const { transactions, getTransactions } = useContext(GlobalContext);

  useEffect(() => {
    getTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="history-section">
      <div className="section-header">
        <h3 className="section-title">History</h3>
        {transactions.length > 0 && (
          <span className="section-count">{transactions.length} item{transactions.length !== 1 ? 's' : ''}</span>
        )}
      </div>
      <ul className="list">
        {transactions.length > 0 ? (
          transactions.map(transaction => (
            <Transaction key={transaction._id} transaction={transaction} />
          ))
        ) : (
          <div className="empty-state">
            <span className="empty-icon">📋</span>
            <p className="empty-text">No transactions yet</p>
            <p className="empty-subtext">Add your first transaction below</p>
          </div>
        )}
      </ul>
    </div>
  )
}
