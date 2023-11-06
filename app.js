const express = require('express');
const app = express();
const PORT = 3001;

app.use(express.json()); // JSON request body parsing middleware

require('./database')

const User = require('./models/userModel');
const Doctor = require('./models/doctorProfileModel');
const Pharmacist = require('./models/pharmacistProfileModel');
const Patient = require('./models/patientProfileModel');


const RolesProfiles = {
  pharmacist: Pharmacist,
  doctor: Doctor,
  patient: Patient
}
app.get('/', (req, res)=>{
    res.status(200)
    res.send('Everything work just fine')
});

app.post('/', (req, res)=>{
    console.log(req.body)
    res.status(200)
    res.send(req.body)
});

app.post('/users/register', async (req, res)=>{
    const {username, email, password, role, profileInfo} = req.body
    let user, profile;
    if(username, email, password, role, profileInfo){
      user = new User({username, email, password, role})
      profile = new RolesProfiles[role](profileInfo)
    }

    try { 
        
        await user.save();
        console.log(user)
        await profile.save()
        console.log(profile)
        
        res.status(201)
        res.send(user);
      } catch (error) {
        console.log(error)
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
