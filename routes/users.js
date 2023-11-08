const express = require('express');
const router = express.Router();


const User = require('../models/userModel')
const UserTypes = {
  doctor: require('../models/doctorProfileModel'),
  pharmacist:  require('../models/pharmacistProfileModel'),
  patient: require('../models/patientProfileModel')
}

app.post('/register', async (req, res)=>{
    const {username, email, password, role, profileInfo} = req.body
    let user;
    if(username, email, password, role, profileInfo){
      user = new UserTypes[role]({username, email, password, role, ...profileInfo})
    }

    try { 
        
        await user.save();
        res.status(201)
        res.send(user);

      } catch (error) {
        res.status(500).send(error);
      }
});

app.get("/", async (request, response) => {
    const users = await User.find({});
    try {
      response.send(users);
    } catch (error) {
      response.status(500).send(error);
    }
  });

  router.delete('/:userId/delete', async (req, res) => {
    const userId = req.params.userId;
  
    try {
      // Find and delete the user by their ID
      const user = await User.findByIdAndRemove(userId);

  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
        const profile = await RolesProfiles[user.role].findOneAndRemove({ userId: userId });
  
      res.json({ message: 'User and profile deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting user and profile', error: error.message });
    }
  });
  
module.exports = router;
