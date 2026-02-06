import { useState, useContext, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { ChevronLeft } from 'lucide-react';
import clsx from 'clsx';

const AddExpense = () => {
    const { token } = useContext(AuthContext);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const type = searchParams.get('type') || 'expense'; // 'expense' or 'income'
    const isIncome = type === 'income';

    const [formData, setFormData] = useState({
        amount: '',
        category: isIncome ? 'Salary' : 'Food',
        date: new Date().toISOString().split('T')[0],
        paymentMode: 'Cash',
        note: '',
        type: type
    });

    const expenseCategories = ['Food', 'Travel', 'Rent', 'Shopping', 'Health', 'Bills', 'Entertainment', 'Education', 'Other'];
    const incomeCategories = ['Salary', 'Freelance', 'Investments', 'Gifts', 'Other'];

    const categories = isIncome ? incomeCategories : expenseCategories;
    const paymentModes = ['Cash', 'UPI', 'Card', 'Bank'];

    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            type: type,
            category: isIncome ? 'Salary' : 'Food'
        }));
    }, [type, isIncome]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Combine selected date with current time
            const selectedDate = new Date(formData.date);
            const now = new Date();
            selectedDate.setHours(now.getHours(), now.getMinutes(), now.getSeconds());

            const submissionData = {
                ...formData,
                date: selectedDate.toISOString()
            };

            await axios.post('http://localhost:5000/api/expenses', submissionData, {
                headers: { 'x-auth-token': token }
            });
            navigate('/');
        } catch (err) {
            console.error("Error adding transaction");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-dark-bg text-gray-900 dark:text-dark-text p-4">
            <header className="flex items-center gap-4 mb-6">
                <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-dark-surface">
                    <ChevronLeft size={24} />
                </button>
                <h1 className="text-xl font-bold">Add {isIncome ? 'Income' : 'Expense'}</h1>
            </header>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                {/* Amount Input */}
                <div className="bg-white dark:bg-dark-surface p-6 rounded-2xl shadow-sm text-center">
                    <label className="text-sm text-gray-500 mb-2 block">Enter Amount</label>
                    <div className="flex items-center justify-center gap-1">
                        <span className="text-4xl font-bold text-gray-400">₹</span>
                        <input
                            type="number"
                            name="amount"
                            placeholder="0"
                            value={formData.amount}
                            onChange={handleChange}
                            className={clsx(
                                "text-5xl font-bold bg-transparent text-center w-40 outline-none placeholder-gray-300",
                                isIncome ? "text-green-500" : "text-red-500"
                            )}
                            autoFocus
                            required
                        />
                    </div>
                </div>

                {/* Details Section */}
                <div className="bg-white dark:bg-dark-surface p-6 rounded-2xl shadow-sm flex flex-col gap-4">

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-500">Category</label>
                        <div className="flex flex-wrap gap-2">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, category: cat })}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${formData.category === cat
                                        ? (isIncome ? 'bg-green-500 text-white' : 'bg-red-500 text-white')
                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-500">Date</label>
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800 outline-none font-medium"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-500">Payment Mode</label>
                        <select
                            name="paymentMode"
                            value={formData.paymentMode}
                            onChange={handleChange}
                            className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800 outline-none font-medium appearance-none"
                        >
                            {paymentModes.map(mode => <option key={mode} value={mode}>{mode}</option>)}
                        </select>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-500">Note (Optional)</label>
                        <textarea
                            name="note"
                            placeholder="Description..."
                            value={formData.note}
                            onChange={handleChange}
                            className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800 outline-none font-medium resize-none h-24"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className={clsx(
                        "text-white p-4 rounded-xl font-bold text-lg transition-colors shadow-lg",
                        isIncome ? "bg-green-500 hover:bg-green-600 shadow-green-500/30" : "bg-red-500 hover:bg-red-600 shadow-red-500/30"
                    )}
                >
                    Save {isIncome ? 'Income' : 'Expense'}
                </button>
            </form>
        </div>
    );
};

export default AddExpense;
