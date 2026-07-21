import React, { useContext } from 'react';
import { GlobalContext } from '../context/GlobalState';
import { numberWithCommas } from '../utils/format';

export const Balance = () => {
  const { transactions } = useContext(GlobalContext);

  const amounts = transactions.map(transaction => transaction.amount);

  const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);

  const balanceClass = total > 0 ? 'positive' : total < 0 ? 'negative' : 'zero';

  return (
    <div className="glass-card balance-card">
      <p className="balance-label">Your Balance</p>
      <h1 className={`balance-amount ${balanceClass}`}>
        ${numberWithCommas(total)}
      </h1>
    </div>
  )
}
