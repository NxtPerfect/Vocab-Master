import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import moment from "moment";
import mysql from "mysql";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import jwt from "jsonwebtoken";
import { v1 as uuidv1 } from "uuid";
import bcrypt from "bcryptjs";

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
  limit: 200
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())
app.use(limiter)

app.get("/api/languages/total", (req, res) => {
  const sql =
    "SELECT language, GROUP_CONCAT(DISTINCT level ORDER BY level) as level, GROUP_CONCAT(COUNT ORDER BY level) as countTotal FROM (SELECT language, level, COUNT(*) as COUNT FROM words GROUP BY language, level) AS subquery GROUP BY language ORDER BY language;"
  db.query(sql, (err, data) => {
    if (err) return res.json({ message: err, type: "error" });
    return res.json({ message: data, type: "success" });
  });
});

// If we read the streak, we should check the last two words
// we don't want to show streak if the user lost it
app.post("/api/user", authenticateToken, (req, res) => {
  // if (req.body.username === undefined) return res.status(400)
  // const username = req.body.username
  const email = req.email
  const sql = "SELECT language, level, COUNT userProgressTotal, u.streak FROM (SELECT language, level, COUNT(*) COUNT FROM user_progress WHERE user_id = (SELECT user_id FROM users WHERE email = ?) GROUP BY language, level) subquery, users u GROUP BY language, level ORDER BY language, level;"
  db.query(sql, [email], (err, data) => {
    if (err) return res.json({ message: err, type: "error" })
    return res.json({ message: data, type: "success" })
  });
});

// TODO if user didn't progress yesterday
// set userstreak as 0
app.post("/api/user_streak", authenticateToken, (req, res) => {
  // if (req.body.username === undefined)
  //   return res.status(400).json({ message: "No username set", type: "error" })
  // const username = req.body.username
  const email = req.email
  console.log("User streak")
  const sql = "SELECT streak userStreak FROM users WHERE email = ?;"
  db.query(sql, [email], (err, data) => {
    if (err) return res.json({ message: err, type: "error" })
    // console.log(data[0])
    return res.json({ message: data[0], type: "success" })
  });
});

// TODO get words in user progress that have due_date as today
app.post("/api/:language&:level", authenticateToken, (req, res) => {
  // if (req.body.username === undefined) return res.status(400)
  // if (req.params === undefined) return res.status(400)
  const { language, level } = req.params
  // const username = req.body.username
  const email = req.email
  const sql =
    "SELECT w.* FROM words w WHERE w.language = ? AND w.level = ? AND w.word_id NOT IN (SELECT u.word_id FROM user_progress u WHERE u.user_id = (SELECT id FROM users WHERE email = ?) AND u.due > CURDATE()) LIMIT 30;";
  db.query(sql, [language, level, email], (err, data) => {
    if (err) return res.json({ message: err, type: "error" })
    return res.json({ message: data, type: "success" })
  });
});

app.post("/api/learnt", authenticateToken, (req, res) => {
  // if (req.body.username === undefined) return res.status(400)
  // const username = req.body.username
  const email = req.email
  const sql =
    "SELECT language, level, CONVERT(MAX(date), CHAR) date FROM user_progress WHERE user_id = (SELECT id FROM users WHERE email = ?) AND due > CURDATE() GROUP BY language, level ORDER BY language, level;"
  db.query(sql, [email], (err, data) => {
    if (err) return res.json({ message: err, type: "error" })

    const arr = []
    for (const date of data) {
      arr.push({ language: date.language, level: date.level, isLearntToday: date.date === moment().format('YYYY-MM-D'), due: moment().isAfter(date.due) || moment().isSame(date.due) })
    }
    return res.json({ message: arr, type: "success" })
  })
});


/*
 * Post request
  * takes in user id, word id, language and level
  * and stores it along with current server date into database
  * returns 400 if no params passed
  *
  * Should also save in streak into users
  *
  * TODO iteration and date calculation
  * we should check if word is in database
  * if it is, we update it's iteration, date and due date
  * if not, we insert it
  */
app.post("/api/save_progress", authenticateToken, (req, res) => {
  if (req.body.progressData === undefined) return res.status(400)
  const progressData = req.body.progressData;
  const email = req.email
  const queries = progressData.map((progressItem) => {
    const { _, word_id, language, level } = progressItem
    const iteration = 1
    /*
      *INSERT INTO `ALLOWANCE` (`EmployeeID`, `Year`, `Month`, `OverTime`,`Medical`,
      *`Lunch`, `Bonus`, `Allowance`) values (10000001, 2014, 4, 10.00, 10.00,
      * 10.45, 10.10, 40.55) ON DUPLICATE KEY UPDATE `EmployeeID` = 10000001
    */
    // While this query will work, i still need to have the iteration to calculate due_date
    // unless there's a way to do it in sql?
    // (x/2)^2+1
    // query untested
    let sql =
      "INSERT INTO user_progress (user_id, word_id, language, level, date, iteration, due) VALUES ((SELECT id FROM users WHERE email = ?), ?, ?, ?, STR_TO_DATE(?, '%d-%m-%Y'), ?, DATE_ADD(CURDATE(), INTERVAL 1 DAY)) ON DUPLICATE KEY UPDATE iteration = iteration + 1, due = DATE_ADD(CURDATE(), INTERVAL ((iteration / 2)*(iteration)+1) DAY), date = CURDATE();";
    return new Promise((resolve, reject) => {
      db.query(sql, [email, word_id, language, level, moment().format('D-M-YYYY'), iteration], (err, data) => {
        if (err) {
          console.log(err)
          return reject(err)
        }
        resolve(data)
      })
      sql = "SELECT CASE WHEN (SELECT datediff((SELECT date FROM user_progress ORDER BY date DESC LIMIT 1), (SELECT date dateOlder FROM user_progress ORDER BY date DESC LIMIT 1 OFFSET 1))) <= 1 THEN 1 WHEN EXISTS((SELECT date dateOlder FROM user_progress ORDER BY date DESC LIMIT 1 OFFSET 1)) THEN 1 ELSE 0 END;"
      db.query(sql, (err, data) => {
        if (err) {
          console.log(err)
          return reject(err)
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
app.post("/api/date", authenticateToken, (req, res) => {
  // if (req.body.username === undefined) return res.status(400)
  if (req.params === undefined) return res.status(400)
  // const username = req.body.username
  const email = req.email
  const sql =
    "SELECT * FROM user_progress WHERE user_id = (SELECT id FROM users WHERE email = ?);";
  db.query(sql, [username], (err, data) => {
    if (err) return res.json({ message: err, type: "error" })
    return res.json({ message: data, type: "success" })
  });
});


app.post("/login", (req, res) => {
  if (req.body.email === undefined || req.body.password === undefined) return res.status(400)
  const sql = "SELECT username, id, password FROM users WHERE email = ?;"
  const values = [req.body.email]
  db.query(sql, [...values], (err, data) => {
    if (err) return res.status(500).json({ message: "Login failed", type: "error" })
    if (data.length === 0) return res.status(401).json({ message: "User doesn't exist", type: "error" })
    if (!bcrypt.compareSync(req.body.password, data[0].password)) return res.status(401).json({ message: "Invalid credentials", type: "error" })
    const user = { id: data[0].id, email: req.body.email, username: data[0].username, password: req.body.password }
    const token = createToken({ id: user.id, email: user.email })
    return res.status(200).json({ message: "Success", username: user.username, token: token, isAuthenticated: true, type: "success" })
  });
});

// Check if email in there already, if not add
// validate email, username and password again
app.post("/register", (req, res) => {
  if (req.body === undefined) return res.status(400)
  const salt = bcrypt.genSaltSync(15) // number works, env no
  const pass = bcrypt.hashSync(req.body.password, salt) // hash password
  console.log(pass)
  const values = [uuidv1(), req.body.email, req.body.username, pass];
  const valid = "SELECT email FROM users WHERE email LIKE ?;";
  db.query(valid, [values[1]], (err, data) => {
    if (err) return res.status(500).json({ message: "Error validating", type: "error" });
    if (data.length !== 0)
      return res.status(401).json({ message: "Email address already exists", type: "error" });
    const sql = "INSERT INTO users (id, email, username, password) VALUES (?);";
    db.query(sql, [values], (err, _data) => {
      if (err) return res.status(500).json({ message: "Error registering", type: "error" });
      const token = createToken({ id: values[0], email: values[1] })
      return res.status(200).json({ message: "Success", username: req.body.username, token: token, type: "success" });
    });
  });
});

// TODO: Clear out jwt?
app.post("/logout", (req, res, next) => {
  return res.cookie("token", null)
});

// Check if token is same as generated
app.post("/auth-status", authenticateToken, (req, res) => {
  // if (req.body.token === undefined) {
  //   console.log("Unauthorized")
  //   return res.send({ isAuthenticated: false, type: "error" })
  // }
  // const token = req.body.token
  // const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
  console.log("Authorized")
  return res.send({ isAuthenticated: true, type: "success" })
});

function createToken(user) {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "14d" }
  )
}

// TODO: doesn't get the token
function authenticateToken(req, res, next) {
  const token = req.cookies["token"];

  if (token === null) return res.status(401)

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {

    if (err) {
      console.log(err)
      return res.sendStatus(403)
    }

    req.email = user.email

    next()
  })
}

app.listen(port, () => {
  console.log(`🔥Running on ${process.env.HOST}:${port}`);
});
