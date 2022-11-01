const express = require('express');
const app = express();

app.get('/',(req, res, next)=>{
    res.send('hello tdd');
});

app.listen(3000, ()=>{
    console.log('Server is now running')
})