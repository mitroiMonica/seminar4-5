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
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const wellKeptSecret = "Mos Craciun NU exista!"

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
    bcrypt.hash(user.password, 10, (err, hash)=>{
        let nextId = users[users.length-1].id + 1
        user.id = nextId
        user.password = hash
        users.push(user)
        console.log("DB has been updated!", users)
        res.send('Successfully added!')
    })
  }
});

app.post('/login', (req, res) => {
  let user = req.body
  console.log('trying to login with: ', user)
  const filterdUsers = users.filter(u=>u.email===user.email)
  if(!filterdUsers.length){
    res.status(400).json({message: "user doesn't exist!"});
  }else{
    let dbHash = filterdUsers[0].password
    bcrypt.compare(user.password, dbHash, (err, result)=>{
        if(result) {
            const token = jwt.sign({email: user.email},wellKeptSecret)
            let response = {token, success : true}
            res.status(200).json(response)
        }else{
            res.status(400).json({message: "password mismatch!"});
        }
    })
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
});