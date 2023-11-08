const express = require('express');
const app = express();
const PORT = 3001;

app.use(express.json()); // JSON request body parsing middleware

require('./database')


const prescriptionsRoutes = require('./routes/prescriptions');
const userRoutes = require('./routes/users');





app.use("/api/user", userRoutes)
app.use("/api/prescription", prescriptionsRoutes)






app.listen(PORT, (error) =>{ 
    if(!error) {
        console.log("Server is Successfully Running, and App is listening on port "+ PORT) 
    }else {
        console.log("Error occurred, server can't start", error);
    }
     
    } 
);
