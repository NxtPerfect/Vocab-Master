import express from "express"
import dotenv from "dotenv"
import mysql from "mysql"
import bodyParser from 'body-parser'

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

app.post('/api/login', (req, res) => {
  const { username, password } = req.body
  const sql = `SELECT * FROM users WHERE username LIKE '${username}';`
  console.log('requesting fr')
  console.log(sql)
  db.query(sql, (err, data) => {
    console.log(data)
    if (err) {
      res.send('Login failed')
      return
    }
    if (data[0]['password'] == password) {
      console.log("Got the login correct")
      res.send('Login successful')
      return data
    }
  })
})

app.listen(port, () => {
  console.log(`Running on port ${port}`)
})
