
const bcrypt = require('bcrypt')
const { createToken } = require('../utils/jwt');
const {userTokenName} = require('../config/app-config');




const UserTypes = {
  doctor: require("../models/doctorsModel"),
  pharmacist: require("../models/pharmacistModel"),
  patient: require("../models/patitentModel"),
  user : require('../models/userModel')
};



const register = async (firstName, lastName, username, email, password, role, profileInfo) => {
  const model = UserTypes[role]
  const existing = await model.findOne({email}).collation({locale :'en', strength: 2})
  if(existing) {
    throw new Error ('Email is already exist')
}
      
    const createdUser = await model.create( {
      firstName, lastName, username, email, password, role, ...profileInfo})
      
      
      const user = createdUser.toObject()
      const token = createSession(user);

     return Object.assign(token,user ) 
};

const login = async (email, password) => {
    

 let user =  await UserTypes.user.findOne({ email }).collation({locale:'en', strength:2});

      if(!user) {throw new Error('Email doesnt exist or password is incorrect!')};
      const passwordCheck = await bcrypt.compare(password, user.password);  
      if(!passwordCheck)  {throw new Error('Email doesnt exist or password is incorrect!')};
    
      user = user.toObject();
      const token = createSession(user);

      return Object.assign(token,user ) 
};











  const createSession = ({_id,email, role}) => {
    const payload = {_id,email, role};
    
    return {[userTokenName]:createToken(payload) } ;
    
    };


const removePassword = (data) => {
    const { password, __v, ...userData } = data;
    return userData
};


    module.exports = {
      register,
      login,
      
    }