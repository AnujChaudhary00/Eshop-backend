const express=require("express");
const app=express();
const morgan=require('morgan');
const mongoose= require('mongoose');
const cors=require('cors');
const authJwt = require('./helper/jwt');
const errorHandler = require('./helper/error-handlers');

//Middlewares
app.use(express.json());
app.use(morgan('tiny'));
app.use(cors());
app.use('*',cors());
// app.use(authJwt());
app.use(errorHandler);
app.use('/public/upload',express.static(__dirname + '/public/upload'));
//Routers
const productRouter=require('./routers/products');
const orderRouter=require('./routers/orders');
const categoryRouter=require('./routers/categories');
const userRouter=require('./routers/users');

//enviromental varaibles
const api=process.env.API_URL;
require('dotenv/config');

//Cloud Database connection
mongoose.connect(process.env.CONNECTION_URL,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    dbName:'eshop'
})
.then(()=>{
    console.log("Connected to database");
}) 
.catch((error)=>{
    console.log(error); 
});    

//Routes 
app.use(`${api}/products`,productRouter);
app.use(`${api}/categories`, categoryRouter);  
app.use(`${api}/users`, userRouter);
app.use(`${api}/orders`, orderRouter);
//server
app.listen(3000,()=>{
    console.log("Server connected");
})