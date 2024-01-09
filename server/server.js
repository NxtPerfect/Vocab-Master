import express from "express"
import dotenv from "dotenv"
import mysql from "mysql"
import bodyParser from 'body-parser'
import cors from 'cors'

dotenv.config()

const app = express()
const port = process.env.PORT || 6942

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "vocab-master"
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors())
app.use(express.json())

// TODO later, need to have this database setup first
app.post('/api/languages', (req, res) => {
  const sql = `SELECT * FROM languages;`
  db.query(sql, (err, data) => {
    if (err) return res.json(err)
    return res.json(data)
  })
  console.log("Sent languages")
})

app.get('/api/german/a1', (req, res) => {
  const sql = `SELECT * FROM german_a1;`
  db.query(sql, (err, data) => {
    if (err) return res.json(err)
    return res.json(data)
  })
  console.log("Sent words")
})

// This needs to get user_id from the database
// using the email
// then use that user_id for the insert query
app.post('/api/german/a1/save', (req, res) => {
  const progressData = req.body.progressData
  const queries = progressData.map((progressItem) => {
    let sql = `SELECT * FROM users WHERE email LIKE ?;`
    const { email, word_id, language, level } = progressItem
    sql = `INSERT INTO user_progress (user_id, word_id, language, level) VALUES (?);`
    const values = [user_id, word_id, language, level]
    return new Promise((resolve, reject) => {
      db.query(sql, [values], (err, data) => {
        console.log(sql)
        console.log(values)
        if (err) {
          console.log(err)
          return reject(err)
        }
        console.log('saved progress')
        resolve(data)
      })
    })
  });
  Promise.all(queries)
    .then(() => {
      res.status(200).json("Success")
    })
    .catch((err) => {
      res.status(500).json(err)
    })
})

app.post('/login', (req, res) => {
  const sql = `SELECT * FROM users WHERE email LIKE ?;`
  const values = [
    req.body.email
  ]
  console.log('requesting fr')
  db.query(sql, [values], (err, data) => {
    if (err) return res.status(500).json('Login failed')
    if (data.length == 0) return res.status(409).json('User doesn\'t exist')
    console.log('got data')
    return res.status(200).json('Success')
  })
})

// Check if email in there already, if not add
// validate email, username and password again
app.post('/register', (req, res) => {
  const values = [
    null,
    req.body.email,
    req.body.username,
    req.body.password
  ]
  console.log("validating")
  const valid = `SELECT email FROM users WHERE email LIKE ?;`
  db.query(valid, [values[1]], (err, data) => {
    if (err) return res.status(500).json("Error validating")
    if (data.length !== 0) return res.status(409).json("Email address already exists")
    const sql = `INSERT INTO users (id, email, username, password) VALUES (?);`
    console.log('registering')
    db.query(sql, [values], (err, data) => {
      if (err) return res.status(500).json('Error registering')
      return res.status(200).json('Success')
    })
  })
})

app.listen(port, () => {
  console.log(`Running on port ${port}`)
})
