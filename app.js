const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const authRoutes = require('./routes/auth'); // Pastikan ini diekspor dengan benar
const path = require('path');
const kapalRouter = require('./routes/kapal'); // Pastikan pathnya benar


const app = express();

// Set EJS sebagai template engine
app.set('view engine', 'ejs');
app.set('views', './views');

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  secret: 'yourSecretKey', // Ganti dengan kunci rahasia yang kuat
  resave: false,
  saveUninitialized: true
}));

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Middleware untuk memeriksa status login
app.use((req, res, next) => {
  const isLoggedIn = !!req.session.user;

  if (!isLoggedIn && !['/auth/login', '/auth/register'].includes(req.path)) {
    return res.redirect('/auth/login');
  }
  
  if (isLoggedIn && req.path === '/') {
    return res.redirect('/auth/profile');
  }
  
  next();
});

// Routes
app.use('/auth', authRoutes);

app.get('/', (req, res) => {
  if (req.session.user) {
    return res.redirect('/auth/profile');
  } else {
    return res.redirect('/auth/login');
  }
});


app.use('/kapal', kapalRouter);


// Menjalankan Server
app.listen(3000, () => {
  console.log('Server running on port 3000');
});
