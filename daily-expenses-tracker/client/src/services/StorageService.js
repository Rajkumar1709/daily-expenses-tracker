import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEYS = {
    USER: 'expense_tracker_user',
    TOKEN: 'expense_tracker_token',
    EXPENSES: 'expense_tracker_expenses'
};

const StorageService = {
    // --- USER / AUTH ---
    saveUser: (user) => {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
        // Generate a fake token for session persistence check
        localStorage.setItem(STORAGE_KEYS.TOKEN, 'offline-session-token');
    },

    getUser: () => {
        const user = localStorage.getItem(STORAGE_KEYS.USER);
        return user ? JSON.parse(user) : null;
    },

    clearSession: () => {
        // Only remove the token, keep the user data (DB) for next login
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
    },

    isAuthenticated: () => {
        return !!localStorage.getItem(STORAGE_KEYS.TOKEN);
    },

    // --- EXPENSES ---
    getExpenses: async () => {
        // Simulate network delay for realistic feel
        await new Promise(resolve => setTimeout(resolve, 300));

        const data = localStorage.getItem(STORAGE_KEYS.EXPENSES);
        return data ? JSON.parse(data) : [];
    },

    addExpense: async (expenseData) => {
        await new Promise(resolve => setTimeout(resolve, 300));

        const expenses = await StorageService.getExpenses();

        const newExpense = {
            _id: uuidv4(), // Generate client-side ID
            ...expenseData,
            date: expenseData.date || new Date().toISOString(),
            createdAt: new Date().toISOString()
        };

        expenses.unshift(newExpense); // Add to top
        localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
        return newExpense;
    },

    deleteExpense: async (id) => {
        await new Promise(resolve => setTimeout(resolve, 200));

        let expenses = await StorageService.getExpenses();
        expenses = expenses.filter(exp => exp._id !== id);

        localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
        return { success: true };
    },

    // --- UTILS ---
    clearAllData: () => {
        localStorage.clear();
    }
};

export default StorageService;
