const request = require('supertest');
const app = require('../../app');
const TodoController = require("../../controllers/todo.controller");
const TodoModel = require("../../models/todo.model");
const httpMocks = require("node-mocks-http");
const newTodo = require("../mock-data/new-todo.json")


const endpointUrl = '/todos/';

let firstTodo;

describe(endpointUrl, ()=>{
    //GET /todos
    test("GET "+endpointUrl, async()=>{
        const response = await request(app).get(endpointUrl);
        expect(response.statusCode).toBe(200);
        //res.body에 array 형태 result 반환하는지 확인
        expect(Array.isArray(response.body)).toBeTruthy();
        //res.body가 반환한 array의 항목에 property가 정의되어있는지 확인
        expect(response.body[0].title).toBeDefined();
        expect(response.body[0].done).toBeDefined();
        firstTodo = response.body[0];
    })


    //GET /todos/:todoId
    test("GET by Id"+endpointUrl+":todoId", async()=>{
        const response = await request(app).get(endpointUrl+firstTodo._id);
        expect(response.statusCode).toBe(200);
        expect(response.body.title).toBe(firstTodo.title);
        expect(response.body.done).toBe(firstTodo.done);
    })
    test("GET by Id doesn't exist"+endpointUrl+":todoId", async()=>{
        let nullId = '63632d8cef21e7c2d03fdce';
        const response = await request(app).get(endpointUrl+nullId);
        //mongoose가 404가 아니라 id가 없으면 그냥 500을 던진다
        expect(response.statusCode).toBe(500);
    })


    //POST /todos
    test("POST " +endpointUrl, async ()=>{
        const response = await request(app)
        .post(endpointUrl)
        .send(newTodo);
        expect(response.statusCode).toBe(201);
        //toStrictEqual 안쓰는 이유는 mockData 비교가 아니라 실제 값 비교할거기 때문
        expect(response.body.id).toBe(newTodo.id);
        expect(response.body.title).toBe(newTodo.title);
        expect(response.body.done).toBe(newTodo.done);
    })
    test("should return error 500 on malformed data with POST " +endpointUrl, async ()=>{
        const response = await request(app)
        .post(endpointUrl)
        .send({title:"missing done"});
        expect(response.statusCode).toBe(500);
        expect(response.body).toStrictEqual({
            message : "Todo validation failed: done: Path `done` is required."
        });
    })
    test("should return error 500 on malformed data with POST " +endpointUrl, async ()=>{
        const response = await request(app)
        .post(endpointUrl)
        .send({done:false});
        expect(response.statusCode).toBe(500);
        expect(response.body).toStrictEqual({
            message : "Todo validation failed: title: Path `title` is required."
        });
    })

    //PUT /todos/:todoId
    test("PUT updateTodo"+endpointUrl+":todoId", async()=>{
        const response = await request(app).put(endpointUrl+firstTodo._id).send(newTodo);
        expect(response.statusCode).toBe(200);
        expect(response.body.id).toBe(firstTodo.id);
        expect(response.body.title).toBe(firstTodo.title);
        expect(response.body.done).toBe(firstTodo.done);
    })
    test("PUT by Id doesn't exist"+endpointUrl+":todoId", async()=>{
        let nullId = '63632d8cef21e7c2d03fdce';
        const response = await request(app).put(endpointUrl+nullId).send(newTodo);
        //mongoose가 404가 아니라 id가 없으면 그냥 500을 던진다
        expect(response.statusCode).toBe(500);
    })

    //DELETE /todos/:todoId
    test("DELETE deleteTodo"+endpointUrl+":todoId", async()=>{
        const response = await request(app).delete(endpointUrl+firstTodo._id);
        expect(response.statusCode).toBe(200);
    })
    test("DELETE by Id doesn't exist"+endpointUrl+":todoId", async()=>{
        let nullId = '63632d8cef21e7c2d03fdce';
        const response = await request(app).delete(endpointUrl+nullId);
        //mongoose가 404가 아니라 id가 없으면 그냥 500을 던진다
        expect(response.statusCode).toBe(500);
    })
})

describe(endpointUrl,()=>{
    
})