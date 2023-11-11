const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

// Use an array to store registered users
const registeredUsers = [];

// Routes
app.get('/', (req, res) => {
  res.render('index', { error: null, firstName: '', lastName: '', email: '', password: '' });
});

app.get('/welcome', (req, res) => {
  res.render('welcome');
});

app.get('/login', (req, res) => {
  res.render('login', { error: null, email: '', password: '' });
});

app.post('/register', (req, res) => {
  // Server-side validation logic
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return res.render('index', { error: 'All fields are required.', firstName, lastName, email, password });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,12}$/;

  if (!emailRegex.test(email) || !passwordRegex.test(password)) {
    return res.render('index', { error: 'Invalid email or password format.', firstName, lastName, email, password });
  }

  // Check if the email is already registered
  if (registeredUsers.some(user => user.email === email)) {
    return res.render('index', { error: 'Email is already registered.', firstName, lastName, email, password });
  }

  // Store user information in the array
  registeredUsers.push({ firstName, lastName, email, password });

  // Redirect to the welcome page
  res.render('welcome', { firstName, lastName, email });
});

app.post('/login', (req, res) => {
  // Server-side validation logic
  const { email, password } = req.body;

  if (!email || !password) {
    return res.render('login', { error: 'All fields are required.', email, password });
  }

  // Check if the email and password match a registered user
  const user = registeredUsers.find(u => u.email === email && u.password === password);

  if (!user) {
    return res.render('login', { error: 'Invalid email or password.', email, password });
  }

  // Redirect to the welcome page
  res.render('welcome', { email });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
