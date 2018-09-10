const express = require('express')
var app = express()

const PORT = 8080

app.get('/', (req, res)=>{
  res.send('Welcome to Cyberpunk Roguelike!');
});

app.listen(PORT, ()=>{
  console.log(`Server started on port ${PORT}!`);
})
