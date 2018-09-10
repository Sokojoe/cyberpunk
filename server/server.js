const express = require('express')
const path = require('path')
var app = express()

const PORT = 8080

app.use('../static', express.static(path.join(__dirname, 'static')))

app.get('/', (req, res) => {
 res.sendFile(path.join(__dirname, '../static/index.html'))
})

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}!`)
})
