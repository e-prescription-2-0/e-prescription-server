const express = require('express');
const app = express();
const PORT = 3001;

app.use(express.json()); // JSON request body parsing middleware

require('./database')

const User = require('./models/userModel');

app.get('/', (req, res)=>{
    res.status(200)
    res.send('Everything work just fine')
});

app.post('/', (req, res)=>{
    console.log(req.body)
    res.status(200)
    res.send(req.body)
});

app.post('/users/add', async (req, res)=>{
    const user = new User(req.body)
    try {
        await user.save();
        res.status(201)
        res.send(user);
      } catch (error) {
        res.status(500).send(error);
      }
});

app.get("/users", async (request, response) => {
    const users = await User.find({});
    try {
      response.send(users);
    } catch (error) {
      response.status(500).send(error);
    }
  });







app.listen(PORT, (error) =>{ 
    if(!error) {
        console.log("Server is Successfully Running, and App is listening on port "+ PORT) 
    }else {
        console.log("Error occurred, server can't start", error);
    }
     
    } 
);
