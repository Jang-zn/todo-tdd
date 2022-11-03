const request = require('supertest');
const app = require('../../app');
const TodoController = require("../../controllers/todo.controller");
const TodoModel = require("../../models/todo.model");
const httpMocks = require("node-mocks-http");
const newTodo = require("../mock-data/new-todo.json")


const endpointUrl = '/todos/';

describe(endpointUrl, ()=>{
    it("POST " +endpointUrl, async ()=>{
        const response = await request(app)
        .post(endpointUrl)
        .send(newTodo);
        expect(response.statusCode).toBe(201);
        //toStrictEqual 안쓰는 이유는 mockData 비교가 아니라 실제 값 비교할거기 때문
        expect(response.body.id).toBe(newTodo.id);
        expect(response.body.title).toBe(newTodo.title);
        expect(response.body.done).toBe(newTodo.done);
    })
    it("should return error 500 on malformed data with POST " +endpointUrl, async ()=>{
        const response = await request(app)
        .post(endpointUrl)
        .send({title:"missing done"});
        expect(response.statusCode).toBe(500);
        expect(response.body).toStrictEqual({
            message : "Todo validation failed: done: Path `done` is required."
        });
    })
    it("should return error 500 on malformed data with POST " +endpointUrl, async ()=>{
        const response = await request(app)
        .post(endpointUrl)
        .send({done:false});
        expect(response.statusCode).toBe(500);
        expect(response.body).toStrictEqual({
            message : "Todo validation failed: title: Path `title` is required."
        });
    })
})