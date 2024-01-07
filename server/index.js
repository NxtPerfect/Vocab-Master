import { Express } from "express";

const app = new Express()
const port = 6942

app.use('/api', (req, res) => {
  console.log("Yes")
})
