const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/issuer', require('./routes/issuerRoutes'));
app.use('/api/user', require('./routes/userRoutes'));
app.use('/api/public', require('./routes/verifierRoutes'));

app.get('/', (req, res) => {
    res.send('Automated Document Verification System API');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
