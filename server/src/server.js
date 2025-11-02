require('dotenv').config({ path: './.env' });
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');
const connectDB = require('./config/db');

// Passport config
require('./config/passport')(passport);

const app = express();
connectDB();

// Middleware
app.use(cors({
    origin: process.env.REACT_BASE_URL,
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Session middleware
app.use(
    session({
        secret: 'keyboard cat', // Replace with a real secret in production
        resave: false,
        saveUninitialized: false,
    })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/weather', require('./routes/weather'));
app.use('/auth', require('./routes/auth'));
app.use('/api/user', require('./routes/user'));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});