const express = require('express');
const app = express();
const dotenv =require('dotenv');
const cookeparser = require('cookie-parser')
const cors = require('cors');
const bodyParser = require('body-parser');
const fileupload = require('express-fileupload');
const errormiddleware = require("./middleware/Error");

//basic environment
app.use(express.json());
app.use(cookeparser());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(fileupload())

app.use(cors())
app.set('trust proxy',1);


//config
dotenv.config({path:'./config/config.env'})
        
//Route importing
const image = require('./routes/imageRoute');
const user = require('./routes/userRoute');

app.use("/api/v1",image);
app.use("/api/v1",user);

app.get('/', (req, res) => {
    res.send('<h1>MM Image route is working now</h1>')
})

//middleware for werror
app.use(errormiddleware);


module.exports = app