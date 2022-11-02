const TodoController = require("../../controllers/todo.controller");
const TodoModel = require("../../models/todo.model");
const httpMocks = require("node-mocks-http");
const newTodo = require("../mock-data/new-todo.json")

TodoModel.create = jest.fn()

let req, res, next;

beforeEach(()=>{
    //node-mocks-http 이용하여 요청, 응답객체 생성
    req=httpMocks.createRequest();
    res=httpMocks.createResponse();
    next = null;
});

describe("TodoController.createTodo",()=>{
    it("should have a createTodo function",()=>{
        expect(typeof TodoController.createTodo).toBe("function")
    });
    it("should call TodoModel.create",()=>{
        //mockData를 req.body에 넣어줌
        req.body=newTodo;
        TodoController.createTodo(req, res, next);
        expect(TodoModel.create).toBeCalledWith(newTodo);

    });
    //응답처리
    it("should return 201 response code",()=>{
        req.body = newTodo;
        TodoController.createTodo(req,res,next);
        expect(res.statusCode).toBe(201);
        //_isEndCalled의 T/F 검증 -> 실제로 응답을 send() 또는 return 했는지 확인
        expect(res._isEndCalled()).toBeTruthy();
    });
})