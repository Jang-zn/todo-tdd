const express = require('express');
const app = express();
const todoRoutes = require('./routes/todo.routes');
const mongodb = require('./mongoDB/mongodb.connect');

//db connect
mongodb.connect();

//middleware
app.use(express.json());

//routes
app.use("/todos", todoRoutes);


app.get('/',(req, res, next)=>{
    res.send('hello tdd');
});


//에러처리
app.use((error, req, res, next)=>{
    res.status(500).json({message : error.message})
})

//통합테스트에서 사용하기 위해 export
module.exports = app;