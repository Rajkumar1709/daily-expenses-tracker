const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    paymentMode: {
        type: String,
        enum: ['Cash', 'UPI', 'Card', 'Bank'],
        default: 'Cash'
    },
    type: {
        type: String,
        enum: ['expense', 'income'],
        default: 'expense',
        required: true
    },
    note: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Expense', ExpenseSchema);
