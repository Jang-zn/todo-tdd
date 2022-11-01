const TodoModel = require('../models/todo.model');


exports.createTodo=(req, res, next)=>{
    TodoModel.create(req.body);
}