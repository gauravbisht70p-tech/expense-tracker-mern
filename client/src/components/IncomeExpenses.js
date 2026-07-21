import React, { useContext } from 'react';
import { GlobalContext } from '../context/GlobalState';
import { numberWithCommas } from '../utils/format';

export const IncomeExpenses = () => {
  const { transactions } = useContext(GlobalContext);

  const amounts = transactions.map(transaction => transaction.amount);

  const income = amounts
    .filter(item => item > 0)
    .reduce((acc, item) => (acc += item), 0)
    .toFixed(2);

  const expense = (
    amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) *
    -1
  ).toFixed(2);

  return (
    <div className="inc-exp-container">
      <div className="glass-card stat-card income">
        <div className="stat-indicator">
          <span className="stat-dot green"></span>
          <span className="stat-label">Income</span>
        </div>
        <p className="stat-amount income-text">+${numberWithCommas(income)}</p>
      </div>
      <div className="glass-card stat-card expense">
        <div className="stat-indicator">
          <span className="stat-dot red"></span>
          <span className="stat-label">Expense</span>
        </div>
        <p className="stat-amount expense-text">-${numberWithCommas(expense)}</p>
      </div>
    </div>
  )
}
