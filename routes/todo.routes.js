const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todo.controller');


router.get("/:todoId", todoController.getTodoById);
router.get("/", todoController.getTodos);

router.post("/", todoController.createTodo);

router.put("/:todoId", todoController.updateTodo);
router.delete("/:todoId", todoController.deleteTodo);

module.exports = router;