import express from "express"
import dotenv from "dotenv"
import mysql from "mysql"

dotenv.config()

const app = express()
const port = process.env.PORT || 6942

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "vocab-master"
})

// TODO later, need to have this database setup first
app.get('/api/languages', (req, res) => {
  const sql = "SELECT * FROM languages"
  db.query(sql, (err, data) => {
    if (err) return res.json(err)
    return res.json(data)
  })
  console.log("Sent languages")
})

app.get('/api/german/a1', (req, res) => {
  const sql = "SELECT * FROM german_a1"
  db.query(sql, (err, data) => {
    if (err) return res.json(err)
    return res.json(data)
  })
  console.log("Sent words")
})
app.listen(port, () => {
  console.log(`Running on port ${port}`)
})
