const TodoModel = require('../models/todo.model');


exports.createTodo= async (req, res, next)=>{
    try{
        const createdModel = await TodoModel.create(req.body);
        res.status(201).json(createdModel);
    }catch(err){
        next(err);
    }
    
}