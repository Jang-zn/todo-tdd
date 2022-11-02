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

app.listen(3000, ()=>{
    console.log('Server is now running')
})

//통합테스트에서 사용하기 위해 export
module.exports = app;