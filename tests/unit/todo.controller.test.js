const TodoController = require("../../controllers/todo.controller");
const TodoModel = require("../../models/todo.model");
const httpMocks = require("node-mocks-http");
const newTodo = require("../mock-data/new-todo.json")
const allTodos = require("../mock-data/all-todo.json")
const todo = require("../mock-data/todo.json")


// TodoModel.create = jest.fn();
// TodoModel.find = jest.fn();
// TodoModel.findById = jest.fn();
// TodoModel.findByIdAndUpdate = jest.fn();
// TodoModel.findByIdAndDelete = jest.fn();
//아래 함수로 mocking해주면 함수마다 jset.fn() 안해줘도 된다.
jest.mock("../../models/todo.model");


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

describe("TodoController.getTodoById()",()=>{
    it("should have getTodoById() function",async ()=>{
        expect(typeof TodoController.getTodoById).toBe("function");
    });
    it("should call TodoModel.findById() with route parameters", async ()=>{
        req.params.todoId = "FHA8VLOu0Q4DsWe1etxQk";
        await TodoController.getTodoById(req,res,next);
        expect(TodoModel.findById).toBeCalledWith(req.params.todoId);
    })
    //응답확인
    //리턴으로 Todo를 돌려주는지 확인
    it("should return response with status 200 and todo", async ()=>{
        TodoModel.findById.mockReturnValue(todo);
        await TodoController.getTodoById(req,res,next);
        expect(res.statusCode).toBe(200);
        expect(res._isEndCalled()).toBeTruthy();
        expect(res._getJSONData()).toStrictEqual(todo);
    })
    //null 리턴받은 경우
    it("should return response with status 404 when result is null", async ()=>{
        TodoModel.findById.mockReturnValue(null);
        await TodoController.getTodoById(req,res,next);
        expect(res.statusCode).toBe(404);
        expect(res._isEndCalled()).toBeTruthy();
    })
    //에러 발생시의 핸들링
    it("should handle Error", async ()=>{
    //에러메세지
    const errorMessage = {message : "Something wrong"}
    //문제가 생긴 Promise 생성
    const rejectPromise = Promise.reject(errorMessage)
    //create시 문제가 생긴 Promise를 돌려받도록 함
    TodoModel.findById.mockReturnValue(rejectPromise)
    await TodoController.getTodoById(req,res,next);
    expect(next).toHaveBeenCalledWith(errorMessage);
    })
})

describe("TodoController.updateTodo()",()=>{
    beforeEach(()=>{
        req.body=newTodo;
        req.params.todoId = "FHA8VLOu0Q4DsWe1etxQk";
    });
    //1. function 있고, 호출 제대로 하는지 확인
    it("should have updateTodo() function", async ()=>{
        expect(typeof TodoController.updateTodo).toBe("function");
    });
    it("should call TodoModel.findByIdAndUpdate()", async()=>{
        TodoController.updateTodo(req, res, next);
        expect(TodoModel.findByIdAndUpdate).toBeCalledWith(req.params.todoId, newTodo, {new:true})
    });
    //2. 응답 확인
    it("should return response with status 200 and todoId", async ()=>{
        todoId = "FHA8VLOu0Q4DsWe1etxQk";
        TodoModel.findByIdAndUpdate.mockReturnValue(newTodo);
        await TodoController.updateTodo(req,res,next);
        expect(res.statusCode).toBe(200);
        expect(res._isEndCalled()).toBeTruthy();
        expect(res._getJSONData()).toStrictEqual(newTodo);
    });
    //3. 에러 핸들링
    //에러 발생시의 핸들링 - 대충 뭉뚱그려놨는데 실제로는 케이스 나눠서 확인해야됨
    it("should handle Error", async ()=>{   
        //에러메세지
        const errorMessage = {message : "Something wrong"}
        //문제가 생긴 Promise 생성
        const rejectPromise = Promise.reject(errorMessage)
        TodoModel.findByIdAndUpdate.mockReturnValue(rejectPromise)
        await TodoController.updateTodo(req,res,next);
        expect(next).toHaveBeenCalledWith(errorMessage);
    });
    it("should handle Error 404", async ()=>{
        //에러메세지
        const errorMessage = {message : "Something wrong"}
        //문제가 생긴 Promise 생성
        const rejectPromise = Promise.reject(errorMessage)
        //create시 문제가 생긴 Promise를 돌려받도록 함
        TodoModel.findByIdAndUpdate.mockReturnValue(null)
        await TodoController.updateTodo(req,res,next);
        expect(res.statusCode).toBe(404);
        expect(res._isEndCalled).toBeTruthy();
    });
});

describe("TodoController.deleteTodo()",()=>{
    beforeEach(()=>{
        req.params.todoId = "FHA8VLOu0Q4DsWe1etxQk";
    });
    //1. function 있고, 호출 제대로 하는지 확인
    it("should have deleteTodo() function", async ()=>{
        expect(typeof TodoController.deleteTodo).toBe("function");
    });
    it("should call TodoModel.findByIdAndDelete()", async()=>{
        TodoController.deleteTodo(req, res, next);
        expect(TodoModel.findByIdAndDelete).toBeCalledWith(req.params.todoId)
    });
    //2. 응답 확인
    it("should return response with status 200 and todoId", async ()=>{
        todoId = "FHA8VLOu0Q4DsWe1etxQk";
        TodoModel.findByIdAndDelete.mockReturnValue(todoId);
        await TodoController.deleteTodo(req,res,next);
        expect(res.statusCode).toBe(200);
        expect(res._isEndCalled()).toBeTruthy();
        expect(res._getJSONData()).toStrictEqual(todoId);
    });
    //3. 에러 핸들링
    //에러 발생시의 핸들링 - 대충 뭉뚱그려놨는데 실제로는 케이스 나눠서 확인해야됨
    it("should handle Error", async ()=>{
        //에러메세지
        const errorMessage = {message : "Something wrong"}
        //문제가 생긴 Promise 생성
        const rejectPromise = Promise.reject(errorMessage)
        //create시 문제가 생긴 Promise를 돌려받도록 함
        TodoModel.findByIdAndDelete.mockReturnValue(rejectPromise)
        await TodoController.deleteTodo(req,res,next);
        expect(next).toHaveBeenCalledWith(errorMessage);
    });
    it("should handle Error 404", async ()=>{
        //에러메세지
        const errorMessage = {message : "Something wrong"}
        //문제가 생긴 Promise 생성
        const rejectPromise = Promise.reject(errorMessage)
        //create시 문제가 생긴 Promise를 돌려받도록 함
        TodoModel.findByIdAndDelete.mockReturnValue(null)
        await TodoController.deleteTodo(req,res,next);
        expect(res.statusCode).toBe(404);
        expect(res._isEndCalled).toBeTruthy();
    });
});