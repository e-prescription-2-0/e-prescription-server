const trimReqBody = (req, res, next) => {
    Object.keys(req.body).forEach((key) => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = req.body[key].trim();
      }
    });
    next();
  };


 module.exports = trimReqBody