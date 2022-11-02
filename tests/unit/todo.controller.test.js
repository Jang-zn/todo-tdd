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
    beforeEach(()=>{
        req.body=newTodo;
    });

    it("should have a createTodo function",()=>{
        expect(typeof TodoController.createTodo).toBe("function")
    });
    it("should call TodoModel.create",()=>{
        //mockData를 req.body에 넣어줌
        //createTodo 이후 TodoModel.create가 데이터인 newTodo를 파라미터로 넣고 호출되는지 확인
        TodoController.createTodo(req, res, next);
        expect(TodoModel.create).toBeCalledWith(newTodo);
    });

    //응답처리
    it("should return 201 response code", async ()=>{
        await TodoController.createTodo(req,res,next);
        expect(res.statusCode).toBe(201);
        //_isEndCalled의 T/F 검증 toBeTruthy-> 실제로 응답을 send() 또는 return 했는지 확인, F면 통과 못함
        expect(res._isEndCalled()).toBeTruthy();
    });
    //리턴하는 값이 우리가 원하는 모델과 데이터 형태가 일치하는지 확인
    it("should return json body in response", async ()=>{
        //비교할 값
        TodoModel.create.mockReturnValue(newTodo);
        await TodoController.createTodo(req,res,next);
        //객체를 toBe로 비교하면 값 같아도 주소값이 달라서 안됨
        //toStrictEqual() 이용
        expect(res._getJSONData()).toStrictEqual(newTodo);
    })
})