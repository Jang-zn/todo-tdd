const TodoModel = require('../models/todo.model');


exports.createTodo= async (req, res, next)=>{
    try{
        const createdModel = await TodoModel.create(req.body);
        res.status(201).json(createdModel);
    }catch(err){
        next(err);
    }
}

exports.getTodos = async (req, res, next)=>{
    try{
        const result = await TodoModel.find({});
        res.status(200).json(result);
    }catch(err){
        next(err);
    }
}

exports.getTodoById = async (req, res, next)=>{
    try{
        const result = await TodoModel.findById(req.params.todoId);
        result ? res.status(200).json(result) : res.status(404).send();
    }catch(err){
        next(err);
    }
}

exports.updateTodo = async (req, res, next)=>{
    try{
        const newTodo = req.body;
        const result = await TodoModel.findByIdAndUpdate(req.params.todoId, newTodo);
        result ? res.status(200).json(result) : res.status(404).send();
    }catch(err){
        next(err);
    }
}

exports.deleteTodo = async (req, res, next)=>{
    try{
        const result = await TodoModel.findByIdAndDelete(req.params.todoId);
        result ? res.status(200).json(result) : res.status(404).send();
    }catch(err){
        next(err);
    }
}