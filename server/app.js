const express = require('express')
const path = require('path')
const app = express()

const parser = require('./parser')

// Serve static assets
app.use(express.static(path.resolve(__dirname, '..', 'build')))

let data = parser.getData()

app.get('/data', (req, res) => {
  return res.send({
    data,
    token: process.env.MapboxAccessToken
  })
})

// Always return the main index.html, so react-router render the route in the client
app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'))
})

module.exports = app
