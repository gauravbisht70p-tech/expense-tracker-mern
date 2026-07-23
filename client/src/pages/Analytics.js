import React, { useContext, useEffect } from 'react';
import { GlobalContext } from '../context/GlobalState';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';

const COLORS = ['#2563EB', '#16A34A', '#DC2626', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1'];

export const Analytics = () => {
  const { transactions, getTransactions } = useContext(GlobalContext);

  useEffect(() => {
    getTransactions();
    // eslint-disable-next-line
  }, []);

  const expenseByCategory = transactions
    .filter(t => t.amount < 0)
    .reduce((acc, t) => {
      const cat = t.category || 'Other';
      acc[cat] = (acc[cat] || 0) + Math.abs(t.amount);
      return acc;
    }, {});

  const pieData = Object.entries(expenseByCategory).map(([name, value]) => ({ name, value }));

  const monthlyData = transactions.reduce((acc, t) => {
    const date = new Date(t.createdAt);
    const month = date.toLocaleDateString('en-IN', { month: 'short' });
    if (!acc[month]) acc[month] = { month, income: 0, expense: 0 };
    if (t.amount > 0) acc[month].income += t.amount;
    else acc[month].expense += Math.abs(t.amount);
    return acc;
  }, {});

  const barData = Object.values(monthlyData);
  const hasData = transactions.length > 0;

  return (
    <div className="analytics-page fade-in">
      <h1>Analytics</h1>
      <p>Visualize your financial data.</p>

      {!hasData ? (
        <div className="empty-state" style={{ marginTop: '40px' }}>
          <h3>No data to display</h3>
          <p>Add some transactions to see your analytics.</p>
        </div>
      ) : (
        <>
          <div className="charts-grid">
            <div className="chart-card">
              <h3>Expense by Category</h3>
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="value">
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `₹${value.toFixed(2)}`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px' }}>No expenses yet</p>
              )}
            </div>

            <div className="chart-card">
              <h3>Income vs Expense</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="month" fontSize={12} stroke="var(--text-muted)" />
                  <YAxis fontSize={12} stroke="var(--text-muted)" />
                  <Tooltip formatter={(value) => `₹${value.toFixed(2)}`} />
                  <Bar dataKey="income" fill="var(--income)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expense" fill="var(--expense)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="chart-card full-width" style={{ marginTop: '20px' }}>
            <h3>Spending Trend</h3>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" fontSize={12} stroke="var(--text-muted)" />
                <YAxis fontSize={12} stroke="var(--text-muted)" />
                <Tooltip formatter={(value) => `₹${value.toFixed(2)}`} />
                <Legend />
                <Line type="monotone" dataKey="income" stroke="var(--income)" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="expense" stroke="var(--expense)" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
};
