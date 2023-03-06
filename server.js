const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors');
const axios = require('axios');

// Load env vars
dotenv.config({ path: './config/config.env' });

const app = express();

// CORS
app.use(cors());

// Body parser
app.use(express.json());

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// axios config
axios.defaults.baseURL = process.env.S3_BASE_URL;

// Route files
const movies = require('./routes/movies');
const review = require('./routes/review');
const ticketing = require('./routes/ticketing');
const carousel = require('./routes/carousel');
const specials = require('./routes/specials');
const auth = require('./routes/auth');
const user = require('./routes/user');

// Mount routers
app.use('/api/movies', movies);
app.use('/api/review', review);
app.use('/api/ticketing', ticketing);
app.use('/api/carousel', carousel);
app.use('/api/specials', specials);
app.use('/api/auth', auth);
app.use('/api/user', user);

app.get('*', (req, res) =>
  res.sendFile(path.resolve(__dirname, 'public', 'index.html'))
);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
