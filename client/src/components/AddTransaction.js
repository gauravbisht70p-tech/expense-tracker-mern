import React, { useState, useContext } from 'react'
import { GlobalContext } from '../context/GlobalState';

export const AddTransaction = () => {
  const [text, setText] = useState('');
  const [amount, setAmount] = useState(0);

  const { addTransaction } = useContext(GlobalContext);

  const onSubmit = e => {
    e.preventDefault();

    const newTransaction = {
      text,
      amount: +amount
    }

    addTransaction(newTransaction);

    setText('');
    setAmount(0);
  }

  return (
    <div className="add-transaction-section">
      <div className="section-header">
        <h3 className="section-title">Add Transaction</h3>
      </div>
      <div className="glass-card form-card">
        <form onSubmit={onSubmit}>
          <div className="form-control">
            <label htmlFor="text">Description</label>
            <input
              type="text"
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="e.g. Salary, Groceries, Rent..."
            />
          </div>
          <div className="form-control">
            <label htmlFor="amount">
              Amount
              <span className="label-hint">Negative for expense, positive for income</span>
            </label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 500 or -200"
            />
          </div>
          <button className="btn">Add Transaction</button>
        </form>
      </div>
    </div>
  )
}
