import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import moment from "moment";
import mysql from "mysql";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import jwt from "jsonwebtoken";
import session from "express-session";

const config = dotenv.config()
const app = express();
const port = process.env.PORT;

const db = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.DBUSER,
  password: process.env.DBPASSWORD,
  database: process.env.DBNAME
});

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true
}

const limiter = rateLimit({
  windowMs: 15 * 60 * 10000, // 15 minutes
  limit: 100
})

const sess = {
  secret: process.env.ACCESS_TOKEN_SECRET,
  resave: false,
  saveUninitialized: true
}

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())
app.use(limiter)
app.use(session(sess))

app.get("/api/languages/total", (req, res) => {
  const sql =
    "SELECT language, GROUP_CONCAT(DISTINCT level ORDER BY level) as level, GROUP_CONCAT(COUNT ORDER BY level) as countTotal FROM (SELECT language, level, COUNT(*) as COUNT FROM words GROUP BY language, level) AS subquery GROUP BY language ORDER BY language;"
  db.query(sql, (err, data) => {
    if (err) return res.json({ message: err, type: "error" });
    return res.json({ message: data, type: "error" });
  });
});

// If we read the streak, we should check the last two words
// we don't want to show streak if the user lost it
app.post("/api/user", (req, res) => {
  if (req.body.username === undefined) return res.status(400)
  const username = req.body.username
  const sql = "SELECT language, level, GROUP_CONCAT(COUNT ORDER BY level) userProgressTotal, u.streak FROM (SELECT language, level, COUNT(*) COUNT FROM user_progress WHERE user_id = (SELECT user_id FROM users WHERE username = ?) GROUP BY language, level) subquery, users u GROUP BY language, level ORDER BY language, level;"
  db.query(sql, [username], (err, data) => {
    if (err) return res.json({ message: err, type: "error" })
    return res.json({ message: data, type: "success" })
  });
});

// TODO: session isn't recognized
app.post("/api/user_streak", (req, res) => {
  if (req.body.username === undefined)
    return res.status(400).json({ message: "No session/username set", type: "error" })
  const username = req.body.username
  console.log("Username:", username)
  const sql = "SELECT streak userStreak FROM users WHERE username = ?;"
  db.query(sql, [username], (err, data) => {
    if (err) return res.json({ message: err, type: "error" })
    return res.json({ message: data[0], type: "success" })
  });
});

app.post("/api/:language&:level", (req, res) => {
  if (req.body.username === undefined) return res.status(400)
  if (req.params === undefined) return res.status(400)
  const { language, level } = req.params
  const username = req.body.username
  const sql =
    "SELECT w.* FROM words w WHERE w.language = ? AND w.level = ? AND w.word_id NOT IN (SELECT u.word_id FROM user_progress u WHERE u.user_id = (SELECT id FROM users WHERE username = ?)) LIMIT 30;";
  db.query(sql, [language, level, username], (err, data) => {
    if (err) return res.json({ message: err, type: "success" })
    return res.json({ message: data, type: "success" })
  });
});

app.post("/api/learnt", (req, res) => {
  if (req.body.username === undefined) return res.status(400)
  const username = req.body.username
  const sql =
    "SELECT language, level, CONVERT(MAX(u.date), CHAR) date FROM user_progress u WHERE user_id = (SELECT id FROM users WHERE username = ?) GROUP BY language, level ORDER BY language, level;"
  db.query(sql, [username], (err, data) => {
    if (err) return res.json({ message: err, type: "error" })

    const arr = []
    for (const date of data) {
      arr.push({ language: date.language, level: date.level, isLearnt: date.date === moment().format('YYYY-MM-D') })
    }
    return res.json({ message: arr, type: "error" })
  })
});


/*
 * Post request
  * takes in user id, word id, language and level
  * and stores it along with current server date into database
  * returns 400 if no params passed
  *
  * Should also save in streak into users
  */
app.post("/api/save_progress", (req, res) => {
  if (req.body.progressData === undefined) return res.status(400)
  const progressData = req.body.progressData;
  const queries = progressData.map((progressItem) => {
    const { username, word_id, language, level } = progressItem;
    let sql =
      "INSERT INTO user_progress (user_id, word_id, language, level, date) VALUES ((SELECT id FROM users WHERE username = ?), ?, ?, ?, STR_TO_DATE(?, '%d-%m-%Y'));";
    return new Promise((resolve, reject) => {
      db.query(sql, [username, word_id, language, level, moment().format('D-M-YYYY')], (err, data) => {
        if (err) {
          console.log(err);
          return reject(err);
        }
        resolve(data);
      });
      sql = "SELECT CASE WHEN (SELECT datediff((SELECT date FROM user_progress ORDER BY date DESC LIMIT 1), (SELECT date dateOlder FROM user_progress ORDER BY date DESC LIMIT 1 OFFSET 1))) <= 1 THEN 1 WHEN EXISTS((SELECT date dateOlder FROM user_progress ORDER BY date DESC LIMIT 1 OFFSET 1)) THEN 1 ELSE 0 END;"
      db.query(sql, (err, data) => {
        if (err) {
          console.log(err);
          return reject(err);
        }
        sql = "UPDATE users SET streak = 1;"
        if (data === 1)
          sql = "UPDATE users SET streak = streak + 1;"
        db.query(sql, (err, data) => {
          if (err) {
            console.log(err);
            return reject(err);
          }
          resolve(data);
        })
      });
    });
  });
  Promise.all(queries)
    .then(() => {
      res.status(200).json({ message: "Success", type: "success" });
    })
    .catch((err) => {
      res.status(500).json({ message: err, type: "error" });
    });
});

// Query for all last learnt words
// only get the last date from each language/level
// but then for streak we need all of it
app.post("/api/date", (req, res) => {
  if (req.body.username === undefined) return res.status(400)
  if (req.params === undefined) return res.status(400)
  const username = req.body.username
  const sql =
    "SELECT * FROM user_progress WHERE user_id = (SELECT id FROM users WHERE username = ?);";
  db.query(sql, [username], (err, data) => {
    if (err) return res.json(err)
    return res.json(data)
  });
});


// Creates session correctly
app.post("/login", (req, res) => {
  if (req.body.email === undefined || req.body.password === undefined) return res.status(400)
  const sql = "SELECT username FROM users WHERE email = ? AND password = ?;"
  const values = [req.body.email, req.body.password]
  db.query(sql, [...values], (err, data) => {
    if (err) return res.status(500).json({ message: "Login failed", type: "error" })
    if (data.length === 0) return res.status(401).json({ message: "User doesn't exist", type: "error" })
    const user = { email: req.body.email, username: data[0].username, password: req.body.password }
    return res.status(200).json({ message: "Success", username: req.session.user.username, isAuthenticated: true, type: "success" })
  });
});

// Check if email in there already, if not add
// validate email, username and password again
// TODO: Add session
app.post("/register", (req, res) => {
  if (req.body === undefined) return res.status(400)
  const values = [null, req.body.email, req.body.username, req.body.password];
  const valid = "SELECT email FROM users WHERE email LIKE ?;";
  db.query(valid, [values[1]], (err, data) => {
    if (err) return res.status(500).json({ message: "Error validating", type: "error" });
    if (data.length !== 0)
      return res.status(401).json({ message: "Email address already exists", type: "error" });
    const sql = "INSERT INTO users (id, email, username, password) VALUES (?);";
    db.query(sql, [values], (err, _data) => {
      if (err) return res.status(500).json({ message: "Error registering", type: "error" });
      console.log("User user created")
      return res.status(200).json({ message: "Success", type: "success" });
    });
  });
});

app.post("/logout", (req, res, next) => {
  return res.cookie("")
});

// TODO: Temporairly always authenticates
// Check if token is same as session
app.get("/auth-status", (req, res) => {
  if (req.session.user) return res.send({ isAuthenticated: true })
  return res.send({ isAuthenticated: false, type: "error" })
});

// Creates jwt token for 14 days
function createToken(username) {
  console.log(`Creating token for user ${username}...`)
  return jwt.sign({ username }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: 60 * 60 * 24 * 14,
  })
}

app.listen(port, () => {
  console.log(`🔥Running on ${process.env.HOST}:${port}`);
});
