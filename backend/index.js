const express = require('express')
const app = express()
const cors=require('cors')
require('dotenv').config()
require('./connection/db')
const UserRoute=require('./routes/UserRoute')
const AnimalRoute=require('./routes/AnimalRoute')
const DonationRoute=require('./routes/DonationRoute')
const port =process.env.PORT || 8080

app.use(cors())
app.use(express.json())
app.use('/api',UserRoute)
app.use('/api',AnimalRoute)
app.use('/api',DonationRoute)


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})