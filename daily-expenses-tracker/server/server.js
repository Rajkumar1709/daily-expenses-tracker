const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Database Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/daily_expenses_tracker', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));

// Routes (Placeholders for now)
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/expenses', require('./routes/expenseRoutes'));
// app.use('/api/stats', require('./routes/statsRoutes')); // To be implemented

app.get('/', (req, res) => {
    res.send('Expense Tracker API is running');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
