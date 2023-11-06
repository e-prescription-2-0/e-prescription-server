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

app.post('/user/add', async (req, res)=>{
    const user = new User(req.body)
    const newUser = await user.save()
    try {
        await user.save();
        res.status(201)
        res.send(user);
      } catch (error) {
        res.status(500).send('Not created');
      }
});

app.get("/users", async (request, response) => {
    const users = await User.find({});
    try {
      response.send(users);
    } catch (error) {
      response.status(500).send('Not created');
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
