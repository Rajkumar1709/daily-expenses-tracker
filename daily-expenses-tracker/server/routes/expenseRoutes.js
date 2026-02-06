const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const { authMiddleware } = require('./authRoutes');

// @route   GET api/expenses
// @desc    Get all expenses for a user (with optional filters)
// @access  Private
router.get('/', authMiddleware, async (req, res) => {
    try {
        // Basic filtering can be added here (e.g. ?date=today, ?month=current)
        // For MVP, returning all sorted by date desc
        const expenses = await Expense.find({ user: req.user.id }).sort({ date: -1 });
        res.json(expenses);
    } catch (err) {
        res.status(500).json({ msg: 'Server Error' });
    }
});

// @route   POST api/expenses
// @desc    Add a new expense
// @access  Private
router.post('/', authMiddleware, async (req, res) => {
    const { amount, category, date, paymentMode, note, type } = req.body;

    if (!amount || !category) {
        return res.status(400).json({ msg: 'Amount and Category are required' });
    }

    try {
        const newExpense = new Expense({
            user: req.user.id,
            amount,
            category,
            date: date || Date.now(),
            paymentMode,
            note,
            type: type || 'expense'
        });

        const expense = await newExpense.save();
        res.json(expense);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/expenses/:id
// @desc    Delete an expense
// @access  Private
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);

        if (!expense) return res.status(404).json({ msg: 'Expense not found' });

        // Ensure user owns expense
        if (expense.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        await expense.deleteOne();
        res.json({ msg: 'Expense removed' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
