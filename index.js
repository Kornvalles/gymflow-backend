const express = require('express')
const app = express()
require('dotenv')
const port = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/login', (req, res) => {
    console.log(req.body)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})