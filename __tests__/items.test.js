process.env.NODE_ENV = "test";

const request = require('supertest');
const app = require('../app');
const items = require('../fakeDb');

beforeEach(() => {
  // Reset the fakeDb to a known state before each test
  items.length = 0;
  items.push({ name: "popsicle", price: 1.45 });
});

afterEach(() => {
  // Clean up the fakeDb after each test if necessary
  items.length = 0;
});

describe("GET /items", () => {
  test("Get all items", async () => {
    const res = await request(app).get('/items');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([{ name: "popsicle", price: 1.45 }]);
  });
});

describe("POST /items", () => {
  test("Add a new item", async () => {
    const newItem = { name: "cheerios", price: 3.4 };
    const res = await request(app).post('/items').send(newItem);
    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({ added: newItem });
    expect(items.length).toBe(2); // There should now be 2 items in the fakeDb
  });
});

describe("GET /items/:name", () => {
  test("Get a single item by name", async () => {
    const res = await request(app).get('/items/popsicle');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ name: "popsicle", price: 1.45 });
  });

  test("Responds with 404 if item not found", async () => {
    const res = await request(app).get('/items/nonexistent');
    expect(res.statusCode).toBe(404);
  });
});

describe("PATCH /items/:name", () => {
  test("Update an item's name and price", async () => {
    const res = await request(app)
      .patch('/items/popsicle')
      .send({ name: "new popsicle", price: 2.5 });
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ updated: { name: "new popsicle", price: 2.5 } });
  });

  test("Responds with 404 if item not found", async () => {
    const res = await request(app)
      .patch('/items/nonexistent')
      .send({ name: "doesn't matter", price: 1 });
    expect(res.statusCode).toBe(404);
  });
});

describe("DELETE /items/:name", () => {
  test("Delete an item", async () => {
    const res = await request(app).delete('/items/popsicle');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: "Deleted" });
    expect(items.length).toBe(0); // The fakeDb should now be empty
  });

  test("Responds with 404 if item not found", async () => {
    const res = await request(app).delete('/items/nonexistent');
    expect(res.statusCode).toBe(404);
  });
});
