const jwt = require("../utils/jwt");


const auth = async (req,res,next) => {
  const token = req.headers['x-authorization'];
  if(!token) {return res.status(401).json({ message: 'Unauthorized access' });}
  
    try {
      const decodedToken = await jwt.verifyToken(token);
      //req.user = decodedToken; - optional
      
      next();
    } catch (error) {
      res.status(401).json({ message: 'Invalid token' });
    }
  
}


module.exports = auth;
