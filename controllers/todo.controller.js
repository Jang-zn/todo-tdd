const TodoModel = require('../models/todo.model');


exports.createTodo=()=>{
    TodoModel.create();
}