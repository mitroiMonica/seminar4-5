let users = [
    {
        id: 1,
        name: "Mihai",
        email: "mihai.gheorghe@csie.ase.ro",
        password: "Mihai1!"
    },
    {
        id: 2,
        name: "Elena",
        email: "elena@gmail.com",
        password: "Elena1!"
    },
]

//server app
const express = require('express');
const app = express();
const logger = require('morgan');
const cors = require('cors');
const port = 3000;

app.use(logger('dev'));
app.use(cors()) //see more at https://www.npmjs.com/package/cors
app.use(express.urlencoded({ extended: false }))
app.use(express.json()) //we expect JSON data to be sent as payloads

app.get('/', (req, res) => {
  res.send('Hello Monik!')
});

app.post('/register', (req, res) => {
  let user = req.body
  console.log('trying to post the following data: ', user)
  const filterdUsers = users.filter(u=>u.email===user.email)
  if(filterdUsers.length!==0){
    res.status(400).json({message: "user already exists!"});
  }else{
    let nextId = users[users.length-1].id + 1
    user.id = nextId
    users.push(user)
    console.log("DB has been updated!", users)
    res.send('Successfully added!')
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
});