const app = require('./app')

const PORT = process.env.PORT || 8020

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`)
})
