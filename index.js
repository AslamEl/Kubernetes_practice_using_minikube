const express = require('express');
const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
const app = express();
const port = process.env.PORT || 8080;

const mongoUser = process.env.MONGO_USER || "mongouser";
const mongoPass = process.env.MONGO_PASSWORD || "mypassword123";
const mongoHost = process.env.MONGO_HOST || "mongo-service";
const mongoPort = process.env.MONGO_PORT || "27017";

const uri = `mongodb://${mongoUser}:${mongoPass}@${mongoHost}:${mongoPort}/?authSource=admin`;
const client = new MongoClient(uri);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Signup page (GET)
app.get('/signup', (req, res) => {
  res.send(`
    <form method="POST" action="/signup">
      <input name="username" placeholder="Username" required />
      <input name="password" type="password" placeholder="Password" required />
      <button type="submit">Sign Up</button>
    </form>
  `);
});

// Signup handler (POST)
app.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.send('Missing fields');
  try {
    await client.connect();
    const db = client.db('testdb');
    const users = db.collection('users');
    const existing = await users.findOne({ username });
    if (existing) return res.send('User already exists');
    const hash = await bcrypt.hash(password, 10);
    await users.insertOne({ username, password: hash });
    res.send('Signup successful');
  } catch (err) {
    res.status(500).send('Error: ' + err.message);
  } finally {
    await client.close();
  }
});

// Login page (GET)
app.get('/login', (req, res) => {
  res.send(`
    <form method="POST" action="/login">
      <input name="username" placeholder="Username" required />
      <input name="password" type="password" placeholder="Password" required />
      <button type="submit">Login</button>
    </form>
  `);
});

// Login handler (POST)
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.send('Missing fields');
  try {
    await client.connect();
    const db = client.db('testdb');
    const users = db.collection('users');
    const user = await users.findOne({ username });
    if (!user) return res.send('Invalid credentials');
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      res.send('Login successful');
    } else {
      res.send('Invalid credentials');
    }
  } catch (err) {
    res.status(500).send('Error: ' + err.message);
  } finally {
    await client.close();
  }
});

app.listen(port, () => console.log(`Listening on ${port}`));