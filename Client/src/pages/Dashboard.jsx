import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({ title: '', amount: '', category: '', date: '' });
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  const categories = ['Food', 'Transport', 'Entertainment', 'Shopping', 'Bills', 'Other'];

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/expenses', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setExpenses(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchExpenses();
  }, []);

  const data = expenses.reduce((acc, expense) => {
    const category = acc.find((item) => item.name === expense.category);
    if (category) {
      category.value += expense.amount;
    } else {
      acc.push({ name: expense.category, value: expense.amount });
    }
    return acc;
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewExpense((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/expenses',
        {
          title: newExpense.title,
          amount: parseFloat(newExpense.amount),
          category: newExpense.category,
          date: newExpense.date,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setExpenses((prev) => [...prev, response.data]);
      setNewExpense({ title: '', amount: '', category: '', date: '' }); // Reset the form
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <h2>
        Total Expenses: {expenses.reduce((sum, expense) => sum + expense.amount, 0).toFixed(2)}
      </h2>

      <form onSubmit={handleAddExpense}>
        <h3>Add New Expense</h3>
        <input
          type='text'
          name='title'
          placeholder='Title'
          value={newExpense.title}
          onChange={handleInputChange}
          required
        />
        <input
          type='number'
          name='amount'
          placeholder='Amount'
          value={newExpense.amount}
          onChange={handleInputChange}
          required
          step='0.01'
          min='0'
        />
        <select name='category' value={newExpense.category} onChange={handleInputChange} required>
          <option value='' disabled>
            Select Category
          </option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <input
          type='date'
          name='date'
          value={newExpense.date}
          onChange={handleInputChange}
          required
        />
        <button type='submit'>Add Expense</button>
      </form>

      <PieChart width={500} height={400} margin={0}>
        <Pie
          data={data}
          dataKey='value'
          nameKey='name'
          cx='50%'
          cy='50%'
          innerRadius={70}
          outerRadius={140}
          fill='#82ca9d'
          label={({ name, value }) => `${name}: ${value.toFixed(2)}`}
          paddingAngle={5}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value) => `${value.toFixed(2)}`}
          labelFormatter={(label) => `Category: ${label}`}
          contentStyle={{
            backgroundColor: '#f1f1f1',
            borderRadius: '5px',
            border: '1px solid #ddd',
          }}
          itemStyle={{
            color: '#333',
          }}
        />
        <Legend
          verticalAlign='bottom'
          height={36}
          formatter={(value) => (
            <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#555' }}>{value}</span>
          )}
          wrapperStyle={{
            paddingTop: '20px',
          }}
        />
      </PieChart>
    </div>
  );
};

export default Dashboard;
