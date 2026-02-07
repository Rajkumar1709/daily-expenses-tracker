import { useState, useEffect, useContext, useMemo } from 'react';
import axios from 'axios';
import StorageService from '../services/StorageService';
import AuthContext from '../context/AuthContext';
import { format, isToday, isYesterday, isSameMonth, parseISO, subMonths } from 'date-fns';
import { ArrowUpRight, ArrowDownCircle, Filter, ChevronDown, Wallet, X, CreditCard, Check } from 'lucide-react';
import clsx from 'clsx';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [expenses, setExpenses] = useState([]);
    const [selectedExpense, setSelectedExpense] = useState(null);

    // Filter States
    const [selectedMonth, setSelectedMonth] = useState(new Date());
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedPaymentModes, setSelectedPaymentModes] = useState([]);

    // Dropdown Visibility States
    const [activeDropdown, setActiveDropdown] = useState(null);

    const categoriesList = ['Food', 'Travel', 'Rent', 'Shopping', 'Health', 'Bills', 'Entertainment', 'Education', 'Other'];
    const paymentModesList = ['Cash', 'UPI', 'Card', 'Bank'];
    const monthsList = Array.from({ length: 12 }, (_, i) => subMonths(new Date(), i));

    // Initial Fetch
    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                const data = await StorageService.getExpenses();
                setExpenses(data);
            } catch (err) {
                console.error("Error fetching expenses");
            }
        };
        fetchExpenses();
    }, []);

    // 1. Month Scope Data (For Summary Card)
    // Filter expenses ONLY by the selected month. 
    // This dataset drives the top summary card.
    const monthExpenses = useMemo(() => {
        return expenses.filter(expense =>
            isSameMonth(parseISO(expense.date), selectedMonth)
        );
    }, [expenses, selectedMonth]);

    // 2. View Scope Data (For Transaction List)
    // Start with monthExpenses and apply remaining filters (Category, Payment).
    // This dataset drives the list view below the card.
    const filteredExpenses = useMemo(() => {
        let filtered = monthExpenses;

        if (selectedCategories.length > 0) {
            filtered = filtered.filter(expense => selectedCategories.includes(expense.category));
        }

        if (selectedPaymentModes.length > 0) {
            filtered = filtered.filter(expense => selectedPaymentModes.includes(expense.paymentMode));
        }

        return filtered;
    }, [monthExpenses, selectedCategories, selectedPaymentModes]);


    // DERIVED SUMMARY: Calculated from MONTH Data
    // This ensures the summary ignores category/payment filters, as requested.
    const summary = useMemo(() => {
        const income = monthExpenses
            .filter(item => item.type === 'income')
            .reduce((acc, curr) => acc + curr.amount, 0);

        const expense = monthExpenses
            .filter(item => item.type === 'expense' || !item.type)
            .reduce((acc, curr) => acc + curr.amount, 0);

        return {
            income,
            expense,
            balance: income - expense
        };
    }, [monthExpenses]);


    const toggleSelection = (item, list, setList) => {
        setList(prev =>
            prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
        );
    };

    // Grouping Logic for the List
    const groupedExpenses = useMemo(() => {
        const groups = {};
        filteredExpenses.forEach(expense => {
            const dateObj = parseISO(expense.date);
            const dateKey = format(dateObj, 'yyyy-MM-dd');
            if (!groups[dateKey]) {
                groups[dateKey] = {
                    date: dateObj,
                    expenses: []
                };
            }
            groups[dateKey].expenses.push(expense);
        });
        return Object.values(groups).sort((a, b) => b.date - a.date);
    }, [filteredExpenses]);


    const getDateLabel = (date) => {
        if (isToday(date)) return 'Today';
        if (isYesterday(date)) return 'Yesterday';
        return format(date, 'dd MMM yyyy');
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-black px-4 py-6 relative font-sans pb-24" onClick={() => setActiveDropdown(null)}>
            {/* Header / Summary Card */}
            <div className="bg-purple-700 text-white p-6 rounded-3xl shadow-xl mb-6 relative overflow-hidden">
                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-purple-200 text-sm font-medium">Total Balance</p>
                            {/* Shows MONTH Balance */}
                            <h1 className="text-4xl font-bold mt-1">₹{summary.balance.toLocaleString()}</h1>
                        </div>
                        <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-xl font-bold">
                            {user?.name?.charAt(0)}
                        </div>
                    </div>
                    <div className="flex gap-6">
                        <div>
                            <p className="text-purple-300 text-xs uppercase tracking-wider mb-1">Income</p>
                            {/* Shows MONTH Income */}
                            <p className="text-lg font-bold">₹{summary.income.toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="text-purple-300 text-xs uppercase tracking-wider mb-1">Expense</p>
                            {/* Shows MONTH Expense */}
                            <p className="text-lg font-bold">₹{summary.expense.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-500 rounded-full opacity-30 blur-2xl"></div>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent opacity-50"></div>
            </div>

            {/* Filters */}
            <div className="relative z-30 flex flex-wrap gap-3 mb-6">

                {/* Month Picker */}
                <div className="relative">
                    <button
                        onClick={(e) => { e.stopPropagation(); setActiveDropdown(activeDropdown === 'month' ? null : 'month'); }}
                        className={clsx(
                            "flex items-center gap-2 px-4 py-2 rounded-full shadow-sm text-sm font-medium whitespace-nowrap border transition-colors relative z-10",
                            activeDropdown === 'month' ? "bg-purple-100 border-purple-200 text-purple-700 dark:bg-purple-900/30 dark:border-purple-800 dark:text-purple-300" : "bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800"
                        )}
                    >
                        {format(selectedMonth, 'MMMM yyyy')} <ChevronDown size={14} />
                    </button>

                    {activeDropdown === 'month' && (
                        <div className="absolute top-0 left-0 min-w-[200px] bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-gray-100 dark:border-zinc-800 py-2 z-50 max-h-64 overflow-y-auto">
                            {monthsList.map(month => (
                                <button
                                    key={month.toString()}
                                    onClick={(e) => { e.stopPropagation(); setSelectedMonth(month); setActiveDropdown(null); }}
                                    className={clsx(
                                        "w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-zinc-800 flex justify-between items-center transition-colors",
                                        isSameMonth(month, selectedMonth) ? "text-purple-600 font-bold bg-purple-50 dark:bg-purple-900/10" : "text-gray-700 dark:text-gray-300"
                                    )}
                                >
                                    {format(month, 'MMMM yyyy')}
                                    {isSameMonth(month, selectedMonth) && <Check size={14} />}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Category Picker */}
                <div className="relative">
                    <button
                        onClick={(e) => { e.stopPropagation(); setActiveDropdown(activeDropdown === 'category' ? null : 'category'); }}
                        className={clsx(
                            "flex items-center gap-2 px-4 py-2 rounded-full shadow-sm text-sm font-medium whitespace-nowrap border transition-colors relative z-10",
                            (activeDropdown === 'category' || selectedCategories.length > 0) ? "bg-purple-100 border-purple-200 text-purple-700 dark:bg-purple-900/30 dark:border-purple-800 dark:text-purple-300" : "bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-gray-500"
                        )}
                    >
                        {selectedCategories.length > 0 ? `${selectedCategories.length} Categories` : 'Categories'} <ChevronDown size={14} />
                    </button>

                    {activeDropdown === 'category' && (
                        <div className="absolute top-0 left-0 min-w-[220px] bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-gray-100 dark:border-zinc-800 py-2 z-50">
                            <div className="px-4 py-2 border-b border-gray-100 dark:border-zinc-800 mb-1 flex justify-between items-center">
                                <span className="text-xs font-bold text-gray-500 uppercase">Filter Categories</span>
                                {selectedCategories.length > 0 && (
                                    <button onClick={(e) => { e.stopPropagation(); setSelectedCategories([]); }} className="text-xs text-purple-600 font-bold hover:underline">Clear</button>
                                )}
                            </div>
                            <div className="max-h-64 overflow-y-auto">
                                {categoriesList.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={(e) => { e.stopPropagation(); toggleSelection(cat, selectedCategories, setSelectedCategories); }}
                                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-zinc-800 flex justify-between items-center text-gray-700 dark:text-gray-300"
                                    >
                                        {cat}
                                        {selectedCategories.includes(cat) && <Check size={14} className="text-purple-600" />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Payment Mode Picker (The 'Filters' button) */}
                <div className="relative">
                    <button
                        onClick={(e) => { e.stopPropagation(); setActiveDropdown(activeDropdown === 'filter' ? null : 'filter'); }}
                        className={clsx(
                            "flex items-center gap-2 px-4 py-2 rounded-full shadow-sm text-sm font-medium whitespace-nowrap border transition-colors relative z-10",
                            (activeDropdown === 'filter' || selectedPaymentModes.length > 0) ? "bg-purple-100 border-purple-200 text-purple-700 dark:bg-purple-900/30 dark:border-purple-800 dark:text-purple-300" : "bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-gray-500"
                        )}
                    >
                        {selectedPaymentModes.length > 0 ? `${selectedPaymentModes.length} Filters` : 'Filters'} <Filter size={14} />
                    </button>
                    {activeDropdown === 'filter' && (
                        <div className="absolute top-0 left-0 min-w-[220px] bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-gray-100 dark:border-zinc-800 py-2 z-50">
                            <div className="px-4 py-2 border-b border-gray-100 dark:border-zinc-800 mb-1 flex justify-between items-center">
                                <span className="text-xs font-bold text-gray-500 uppercase">By Payment Mode</span>
                                {selectedPaymentModes.length > 0 && (
                                    <button onClick={(e) => { e.stopPropagation(); setSelectedPaymentModes([]); }} className="text-xs text-purple-600 font-bold hover:underline">Clear</button>
                                )}
                            </div>
                            <div className="max-h-64 overflow-y-auto">
                                {paymentModesList.map(mode => (
                                    <button
                                        key={mode}
                                        onClick={(e) => { e.stopPropagation(); toggleSelection(mode, selectedPaymentModes, setSelectedPaymentModes); }}
                                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-zinc-800 flex justify-between items-center text-gray-700 dark:text-gray-300"
                                    >
                                        {mode}
                                        {selectedPaymentModes.includes(mode) && <Check size={14} className="text-purple-600" />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Transactions List */}
            <div className="flex flex-col gap-6 relative z-10">
                {groupedExpenses.length === 0 ? (
                    <div className="text-center py-10 text-gray-400">
                        <p>No transactions found for this period.</p>
                    </div>
                ) : (
                    groupedExpenses.map((group) => (
                        <div key={format(group.date, 'yyyy-MM-dd')}>
                            <h3 className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider mb-3 ml-2">
                                {getDateLabel(group.date)}
                            </h3>
                            <div className="flex flex-col gap-3">
                                {group.expenses.map(expense => (
                                    <div
                                        key={expense._id}
                                        onClick={(e) => { e.stopPropagation(); setSelectedExpense(expense); }}
                                        className="bg-white dark:bg-zinc-900 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 flex justify-between items-start cursor-pointer active:scale-[0.98] transition-transform"
                                    >
                                        <div className="flex gap-4">
                                            <div className={clsx(
                                                "w-12 h-12 rounded-full flex items-center justify-center shrink-0",
                                                expense.type === 'income'
                                                    ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                                                    : "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
                                            )}>
                                                {expense.type === 'income' ? <ArrowDownCircle size={20} /> : <ArrowUpRight size={20} />}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900 dark:text-gray-100 text-base">{expense.category}</h4>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">{expense.note || (expense.type === 'income' ? 'Income Received' : `Payment for ${expense.category}`)}</p>
                                                <p className="text-xs text-gray-400 mt-1">{format(parseISO(expense.date), 'dd MMM yyyy, hh:mm a')}</p>
                                            </div>
                                        </div>
                                        <div className="text-right flex flex-col items-end gap-1">
                                            <p className={clsx(
                                                "font-bold text-lg",
                                                expense.type === 'income' ? "text-green-600 dark:text-green-400" : "text-gray-900 dark:text-gray-100"
                                            )}>
                                                {expense.type === 'income' ? '+' : ''}₹{expense.amount.toLocaleString()}
                                            </p>
                                            <div className="flex items-center gap-1 text-[10px] bg-gray-100 dark:bg-zinc-800 px-2 py-1 rounded-full text-gray-500">
                                                <span>{expense.type === 'income' ? 'Credited to' : 'Debited from'}</span>
                                                <CreditCard size={10} />
                                                <span className="font-bold uppercase">{expense.paymentMode}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Expense Details Overlay - CENTERED */}
            {selectedExpense && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-zinc-900 w-full max-w-md p-6 rounded-3xl shadow-2xl animate-in zoom-in-95 duration-200 relative border border-gray-200 dark:border-zinc-800">
                        <button
                            onClick={() => setSelectedExpense(null)}
                            className="absolute top-4 right-4 p-2 bg-gray-100 dark:bg-zinc-800 rounded-full text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                        >
                            <X size={20} />
                        </button>

                        <div className="text-center mb-8">
                            <div className={clsx(
                                "w-20 h-20 rounded-full flex items-center justify-center text-4xl mx-auto mb-4",
                                selectedExpense.type === 'income'
                                    ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                                    : "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
                            )}>
                                {selectedExpense.type === 'income' ? <ArrowDownCircle size={40} /> : <ArrowUpRight size={40} />}
                            </div>
                            <p className="text-gray-500 text-sm mb-1">{selectedExpense.type === 'income' ? 'Received from' : 'Payment to'}</p>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{selectedExpense.category}</h2>
                            <p className={clsx(
                                "text-3xl font-bold mt-2",
                                selectedExpense.type === 'income' ? "text-green-600 dark:text-green-400" : "text-gray-900 dark:text-gray-100"
                            )}>
                                {selectedExpense.type === 'income' ? '+' : ''}₹{selectedExpense.amount.toLocaleString()}
                            </p>
                            <div className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-500 bg-gray-100 dark:bg-zinc-800 py-1 px-3 rounded-full w-max mx-auto">
                                <span className={clsx("w-2 h-2 rounded-full", "bg-green-500")}></span>
                                Successful
                            </div>
                        </div>

                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between py-3 border-b border-gray-100 dark:border-zinc-800">
                                <span className="text-gray-500 text-sm">Date & Time</span>
                                <span className="font-medium text-gray-900 dark:text-gray-100 text-sm">{format(parseISO(selectedExpense.date), 'dd MMM yyyy, hh:mm a')}</span>
                            </div>
                            <div className="flex justify-between py-3 border-b border-gray-100 dark:border-zinc-800">
                                <span className="text-gray-500 text-sm">Payment Mode</span>
                                <span className="font-medium text-gray-900 dark:text-gray-100 text-sm flex items-center gap-2">
                                    <CreditCard size={16} /> {selectedExpense.paymentMode}
                                </span>
                            </div>
                            {selectedExpense.note && (
                                <div className="flex justify-between py-3 border-b border-gray-100 dark:border-zinc-800 flex-col gap-2">
                                    <span className="text-gray-500 text-sm">Note</span>
                                    <span className="font-medium text-gray-900 dark:text-gray-100 text-sm">{selectedExpense.note}</span>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={() => setSelectedExpense(null)}
                            className={clsx(
                                "w-full py-4 rounded-xl font-bold text-white transition-colors shadow-lg",
                                selectedExpense.type === 'income'
                                    ? "bg-green-600 hover:bg-green-700 shadow-green-500/30"
                                    : "bg-purple-600 hover:bg-purple-700 shadow-purple-500/30"
                            )}
                        >
                            Done
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
