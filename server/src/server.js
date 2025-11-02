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

app.set('trust proxy', 1);

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
        secret: process.env.SESSION_SECRET, // Use the variable from your .env
        resave: false,
        saveUninitialized: false,
        cookie: {
            // secure: true is required for sameSite: 'none'.
            // It means the cookie will only be sent over HTTPS.
            secure: process.env.NODE_ENV === 'production', 
            
            // httpOnly: true is a security best practice.
            // It prevents client-side JS from accessing the cookie.
            httpOnly: true, 

            // sameSite: 'none' is required to send the cookie cross-domain.
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',

            maxAge: 24 * 60 * 60 * 1000 // e.g., 1 day
        }
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