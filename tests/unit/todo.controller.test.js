const TodoController = require("../../controllers/todo.controller");
const TodoModel = require("../../models/todo.model");
const httpMocks = require("node-mocks-http");
const newTodo = require("../mock-data/new-todo.json")

TodoModel.create = jest.fn()

describe("TodoController.createTodo",()=>{
    it("should have a createTodo function",()=>{
        expect(typeof TodoController.createTodo).toBe("function")
    })
    it("should call TodoModel.create",()=>{
        //node-mocks-http 이용하여 요청, 응답객체 생성
        let req, res, next;
        req=httpMocks.createRequest();
        res=httpMocks.createResponse();
        next = null;

        //mockData를 req.body에 넣어줌
        req.body=newTodo;

        TodoController.createTodo(req, res, next);
        expect(TodoModel.create).toBeCalledWith(newTodo);
    })
})