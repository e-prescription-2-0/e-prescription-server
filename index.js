require('dotenv').config()
const dbConnector = require('./config/db');
const apiRouter = require('./router');

// const config = require('./config/config');


dbConnector()
  .then(() => {
    const config = require('./config/config');
    const app = require('express')();
    require('./config/express')(app);
    app.use('/api', apiRouter);

  

    app.listen(config.port, console.log(`Listening on port ${config.port}!`));
  })
  .catch(console.error);