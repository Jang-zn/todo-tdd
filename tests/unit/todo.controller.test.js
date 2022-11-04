const TodoController = require("../../controllers/todo.controller");
const TodoModel = require("../../models/todo.model");
const httpMocks = require("node-mocks-http");
const newTodo = require("../mock-data/new-todo.json")
const allTodos = require("../mock-data/all-todo.json")

TodoModel.create = jest.fn()
TodoModel.find = jest.fn()

let req, res, next;

beforeEach(()=>{
    //node-mocks-http 이용하여 요청, 응답객체 생성
    req=httpMocks.createRequest();
    res=httpMocks.createResponse();
    //next가 다음 액션이 될 fn 처리되어야 함
    next = jest.fn();
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
    //에러 발생시의 핸들링
    it("should handle Error", async ()=>{
        //에러메세지
        const errorMessage = {message : "Required Property is Missing"}
        //문제가 생긴 Promise 생성
        const rejectPromise = Promise.reject(errorMessage)
        //create시 문제가 생긴 Promise를 돌려받도록 함
        TodoModel.create.mockReturnValue(rejectPromise)
        await TodoController.createTodo(req,res,next);
        expect(next).toBeCalledWith(errorMessage);
    })
})

describe("TodoController.getTodos",()=>{
    //기능 체크
    it("should have a getTodos() function",()=>{
        expect(typeof TodoController.getTodos).toBe("function")
    });
    //model.find({})로 document 모두 가져오도록 함
    //toHaveBeenCalledWith()<- 여기에 들어간 파라미터가 앞에 호출한 함수의 파라미터인지를 확인하는것
    it("should call TodoModel.find()",async ()=>{
        await TodoController.getTodos(req,res,next);
        expect(TodoModel.find).toHaveBeenCalledWith({})
    });
    //응답확인
    //리턴으로 Todo List를 돌려주는지 확인
    it("should return response with status 200 and all Todos", async ()=>{
        TodoModel.find.mockReturnValue(allTodos);
        await TodoController.getTodos(req,res,next);
        expect(res.statusCode).toBe(200);
        expect(res._isEndCalled()).toBeTruthy();
        expect(res._getJSONData()).toStrictEqual(allTodos);
    })
   //에러 발생시의 핸들링
   it("should handle Error", async ()=>{
    //에러메세지
    const errorMessage = {message : "Something wrong"}
    //문제가 생긴 Promise 생성
    const rejectPromise = Promise.reject(errorMessage)
    //create시 문제가 생긴 Promise를 돌려받도록 함
    TodoModel.find.mockReturnValue(rejectPromise)
    await TodoController.getTodos(req,res,next);
    expect(next).toHaveBeenCalledWith(errorMessage);
})
})