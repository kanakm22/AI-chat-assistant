import { jest, describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import chatRoutes from './routes/chat.js';
import Thread from './models/Thread.js';

let mongoServer;
const app = express();
app.use(express.json());
app.use('/api', chatRoutes);

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await Thread.deleteMany({});
});

describe('Chat Routes', () => {
  it('POST /api/test', async () => {
    const res = await request(app).post('/api/test');
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Success');
  });

  it('GET /api/thread', async () => {
    const thread = new Thread({ threadId: '1', title: 'Thread 1' });
    await thread.save();

    const res = await request(app).get('/api/thread');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
  });

  it('GET /api/thread/:threadId - success', async () => {
    const thread = new Thread({
      threadId: 'xyz',
      title: 'Title',
      messages: [{ role: 'user', content: 'Hi' }]
    });
    await thread.save();

    const res = await request(app).get('/api/thread/xyz');
    expect(res.statusCode).toBe(200);
    expect(res.body[0].content).toBe('Hi');
  });

  it('GET /api/thread/:threadId - 404', async () => {
    const res = await request(app).get('/api/thread/missing');
    expect(res.statusCode).toBe(404);
  });

  it('DELETE /api/thread/:threadId', async () => {
    const thread = new Thread({ threadId: 'abc', title: 'Title' });
    await thread.save();

    const res = await request(app).delete('/api/thread/abc');
    expect(res.statusCode).toBe(200);
  });

  it('POST /api/chat - 400 validation error', async () => {
    const res = await request(app).post('/api/chat').send({});
    expect(res.statusCode).toBe(400);
  });
});