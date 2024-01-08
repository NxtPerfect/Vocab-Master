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

app.post('/login', (req, res) => {
  const sql = `SELECT * FROM users WHERE username LIKE ?;`
  const values = [
    req.body.username
  ]
  console.log('requesting fr')
  db.query(sql, [values], (err, data) => {
    if (err) return res.json('Login failed')
    if (data.length == 0) return res.json('User doesn\'t exist')
    console.log('got data')
    return res.json('Success')
  })
})

// Doesn't work just yet
app.post('/register', (req, res) => {
  const sql = `INSERT INTO users (id, username, password) VALUES (?);`
  const values = [
    req.body.username,
    req.body.password
  ]
  console.log('requesting fr')
  db.query(sql, [values], (err, data) => {
    if (err) return res.json('Error registering')
    return res.json('Success')
  })
})

app.listen(port, () => {
  console.log(`Running on port ${port}`)
})
