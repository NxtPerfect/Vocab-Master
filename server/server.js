import express from "express";
import dotenv from "dotenv"

dotenv.config()

const app = express()
const port = process.env.PORT || 6942

app.get('/api', (req, res) => {
  console.log("Yes")
  res.json({ message: "Got it" })
})
app.listen(port, () => {
  console.log(`Running on port ${port}`)
})
