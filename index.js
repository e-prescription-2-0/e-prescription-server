const dbConnector = require('./config/db');




dbConnector()
.then(() => {
    const apiRouter = require('./router');
    const cors = require('cors');
    const config = require('./config/config')
    const errorHandler = require('./utils/errorHandler');
    const app = require('express')();
    require('./config/express')(app);
    
    app.use(cors({
      origin:config.origin,
      credentials:true,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  }));
    app.use('/api', apiRouter);
    app.use(errorHandler);
    app.listen(config.port, console.log(`Listening on port ${config.port}!`));
  })
  .catch(console.error);