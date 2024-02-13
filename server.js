const app = require('./app');
const connectDatabase  = require('./config/database');
const cloudinary = require('cloudinary');


//config 
require('dotenv').config({path:'./config/config.env'});

//uncaught err
process.on('uncaughtException',(err)=>{
    console.log(`Error: ${err.message}`)
    console.log(`shuuting down the server unhandles rejection`);

    server.close(()=>{
        process.exit(1);
    })

})


//connecting to a database
connectDatabase();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
})



const server = app.listen(process.env.PORT,()=>{
    console.log(`Server is running on local http://localhost:${process.env.PORT}`)
});

//unhandled rejection
process.on("unhandledRejection",err=>{
    console.log(`Error: ${err.message}`)
    console.log(`shuuting down the server unhandles rejection`);

    server.close(()=>{
        process.exit(1);
    })
})