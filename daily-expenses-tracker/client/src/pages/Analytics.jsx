import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import StorageService from '../services/StorageService';
import AuthContext from '../context/AuthContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const Analytics = () => {
    const { token } = useContext(AuthContext);
    const [expenses, setExpenses] = useState([]);
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        fetchExpenses();
    }, []);

    const fetchExpenses = async () => {
        try {
            const data = await StorageService.getExpenses();
            setExpenses(data);
            processData(data);
        } catch (err) {
            console.error("Error fetching data");
        }
    };

    const processData = (data) => {
        // Filter out income, only show expenses in the breakdown
        const expenseData = data.filter(item => item.type === 'expense' || !item.type);

        const categoryMap = {};

        expenseData.forEach(item => {
            if (categoryMap[item.category]) {
                categoryMap[item.category] += item.amount;
            } else {
                categoryMap[item.category] = item.amount;
            }
        });

        const processed = Object.keys(categoryMap).map(key => ({
            name: key,
            value: categoryMap[key]
        }));

        setChartData(processed);
    };

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF4560'];

    return (
        <div className="min-h-screen px-4 py-8 pb-24">
            <h1 className="text-2xl font-bold mb-6 dark:text-gray-100">Spending Analysis</h1>

            <div className="bg-white dark:bg-dark-surface p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 mb-6">
                <h2 className="text-lg font-bold mb-4 text-center dark:text-gray-200">Category Breakdown</h2>
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="bg-white dark:bg-dark-surface p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                <h2 className="text-lg font-bold mb-4 dark:text-gray-200">Top Categories</h2>
                <div className="flex flex-col gap-4">
                    {chartData.sort((a, b) => b.value - a.value).map((item, index) => (
                        <div key={item.name} className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                                <span className="font-medium text-gray-700 dark:text-gray-300">{item.name}</span>
                            </div>
                            <span className="font-bold text-gray-900 dark:text-gray-100">₹{item.value.toLocaleString()}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Analytics;
