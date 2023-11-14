
const jwt = require("../utils/jwt");




const accesRouteGuard =  (accessRole) => {
    return async (req,res,next) => {
    const token = req.headers['x-authorization'];
    if(!token) {{return res.status(401).json({ message: 'Unauthorized access' });}};
    try {
      const decodedToken = await jwt.verifyToken(token);
      if(decodedToken.role !== accessRole) {{return res.status(401).json({ message: 'You don`t have permission to access this resource!' });}};
      next()
    } catch (error) {
      res.status(401).json({ message: 'Invalid token' });
    }
  };
}

  module.exports = accesRouteGuard