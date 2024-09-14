const express = require('express');
const app = express();


require('dotenv').config();
const CookieParser = require('cookie-parser');

const Cors = require('cors');
const Router = require('./Routers/AuthRouter');
const DataBase = require('./Config/Database');
const RouterEmploy = require('./Routers/EmployRouter');




app.use(CookieParser());
app.use(express.json());
app.use(Cors());




app.use('/API/V1', Router);
app.use('/API/V2', RouterEmploy);




DataBase().then(() => {
    app.listen(process.env.PORT, (req, res) => {
        console.log("app are raning")
    })
}).catch((error) => {
    console.log("data bade connection failed", error)

})