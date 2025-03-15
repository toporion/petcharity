const express = require('express')
const app = express()
const cors=require('cors')
require('dotenv').config()
require('./connection/db')
const port =process.env.PORT || 8080

app.use(cors())
app.use(express.json())


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})