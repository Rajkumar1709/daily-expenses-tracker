const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['expense', 'income'], // Scalability for income tracking
        default: 'expense'
    },
    color: {
        type: String // For UI customization
    },
    icon: {
        type: String // For UI customization
    }
});

module.exports = mongoose.model('Category', CategorySchema);
