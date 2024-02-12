import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import moment from "moment";
import mysql from "mysql";

dotenv.config();

const app = express();
const port = 6942;

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "vocab-master",
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());

app.get("/api/languages/total", (req, res) => {
  const sql =
    "SELECT language, GROUP_CONCAT(DISTINCT level ORDER BY level) as level, GROUP_CONCAT(COUNT ORDER BY level) as countTotal FROM (SELECT language, level, COUNT(*) as COUNT FROM words GROUP BY language, level) AS subquery GROUP BY language ORDER BY language;"
  db.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

// If we read the streak, we should check the last two words
// we don't want to show streak if the user lost it
app.post("/api/user", (req, res) => {
  if (req.body.user_id === undefined) return res.status(400)
  const user_id = req.body.user_id
  const sql = "SELECT language, level, GROUP_CONCAT(COUNT ORDER BY level) userProgressTotal, u.streak FROM (SELECT language, level, COUNT(*) COUNT FROM user_progress WHERE user_id = ? GROUP BY language, level) subquery, users u GROUP BY language, level ORDER BY language, level;"
  db.query(sql, [user_id], (err, data) => {
    if (err) return res.json(err)
    return res.json(data)
  });
})

app.post("/api/:language&:level", (req, res) => {
  if (req.body.user_id === undefined) return res.status(400)
  if (req.params === undefined) return res.status(400)
  const { language, level } = req.params
  const user_id = req.body.user_id
  const sql =
    "SELECT w.* FROM words w WHERE w.language = ? AND w.level = ? AND w.word_id NOT IN (SELECT u.word_id FROM user_progress u WHERE u.user_id = ?) LIMIT 30;";
  db.query(sql, [language, level, user_id], (err, data) => {
    if (err) return res.json(err)
    return res.json(data)
  });
});

app.post("/api/:language&:level/learnt", (req, res) => {
  if (req.body.user_id === undefined) return res.status(400)
  if (req.params === undefined) return res.status(400)
  const { language, level } = req.params
  const user_id = req.body.user_id
  const sql = 
    "SELECT CONVERT(MAX(u.date), CHAR) date FROM user_progress u WHERE language = ? AND user_id = ? GROUP BY level ORDER BY date DESC;"
  db.query(sql, [language, user_id], (err, data) => {
    if (err) return res.json(err)

    // Check array and return array of bools
    const arr = []
    for (const date of data) {
      arr.push(date.date === moment().format('YYYY-MM-D'))
    }
    return res.json(arr)
  })
})


// Okay this needs to either be into two queries, with 2nd one being huge
// or some other way to not have nested queries
//
// idk what is better
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
    const { user_id, word_id, language, level } = progressItem;
    let sql =
      "INSERT INTO user_progress (user_id, word_id, language, level, date) VALUES (?, ?, ?, ?, STR_TO_DATE(?, '%d-%m-%Y'));";
    return new Promise((resolve, reject) => {
      db.query(sql, [user_id, word_id, language, level, moment().format('D-M-YYYY')], (err, data) => {
        if (err) {
          console.log(err);
          return reject(err);
        }
        resolve(data);
      });
      // This query is badly written
      sql = "SELECT CASE WHEN EXISTS(SELECT (SELECT date dateNewer FROM user_progress ORDER BY date DESC LIMIT 1), (SELECT date dateOlder FROM user_progress ORDER BY date DESC LIMIT 1 OFFSET 1) WHERE datediff(day, dateNewer, dateOlder) <= 1)THEN CAST(1 as BIT) ELSE CAST(0 as BIT) END;"
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
      res.status(200).json("Success");
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

// Query for all last learnt words
// only get the last date from each language/level
// but then for streak we need all of it
app.post("/api/date", (req, res) => {
  if (req.body.user_id === undefined) return res.status(400)
  if (req.params === undefined) return res.status(400)
  const user_id = req.body.user_id
  const sql =
    "SELECT * FROM user_progress WHERE user_id = ?;";
  db.query(sql, [user_id], (err, data) => {
    if (err) return res.json(err)
    return res.json(data)
  });
})

app.post("/login", (req, res) => {
  if (req.body.email === undefined) return res.status(400)
  const sql = "SELECT * FROM users WHERE email LIKE ?;"
  const values = [req.body.email]
  db.query(sql, [values], (err, data) => {
    if (err) return res.status(500).json("Login failed")
    if (data.length === 0) return res.status(409).json("User doesn't exist")
    return res.status(200).json({ message: "Success", user_id: data })
  });
});

// Check if email in there already, if not add
// validate email, username and password again
app.post("/register", (req, res) => {
  if (req.body === undefined) return res.status(400)
  const values = [null, req.body.email, req.body.username, req.body.password];
  const valid = "SELECT email FROM users WHERE email LIKE ?;";
  db.query(valid, [values[1]], (err, data) => {
    if (err) return res.status(500).json("Error validating");
    if (data.length !== 0)
      return res.status(409).json("Email address already exists");
    const sql = "INSERT INTO users (id, email, username, password) VALUES (?);";
    db.query(sql, [values], (err, _data) => {
      if (err) return res.status(500).json("Error registering");
      return res.status(200).json("Success");
    });
  });
});

app.listen(port, () => {
  console.log(`Running on port ${port}`);
});
