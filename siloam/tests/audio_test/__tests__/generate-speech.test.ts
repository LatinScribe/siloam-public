import handler from '../../../pages/api/audio/generate-speech';
import { createMocks } from 'node-mocks-http';
import { describe, it, expect, jest, beforeEach } from "@jest/globals";
const openai = require('openai');

jest.mock('openai', () => {
  return jest.fn().mockImplementation(() => ({
    audio: {
      speech: {
        create: jest.fn().mockResolvedValue({
          arrayBuffer: jest.fn().mockResolvedValue(new ArrayBuffer(8)),
        } as { arrayBuffer: jest.Mock<Promise<ArrayBuffer>> }),
      },
    },
  }));
});

describe('POST /api/audio/generate-speech', () => {
  it('should return 405 if method is not POST', async () => {
    const { req, res } = createMocks({
      method: 'GET',
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(405);
    expect(res._getJSONData()).toEqual({ error: 'Method not allowed' });
  });

  it('should return 400 if text is not provided', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {},
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(res._getJSONData()).toEqual({ error: 'Text is required' });
  });

  it('should return audio data if valid text is provided', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: { text: 'Hello world', voice: 'alloy' },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getHeaders()['content-type']).toBe('audio/mpeg');
    expect(res._getData()).toBeInstanceOf(Buffer);
  });

  // it('should return 500 if OpenAI API fails', async () => {
  //   const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  //   openai.mockImplementationOnce(() => ({
  //     audio: {
  //       speech: {
  //         create: jest.fn().mockRejectedValue(new Error('API Error')),
  //       },
  //     },
  //   }));

  //   const { req, res } = createMocks({
  //     method: 'POST',
  //     body: { text: 'Hello world', voice: 'alloy' },
  //   });

  //   await handler(req, res);

  //   expect(res._getStatusCode()).toBe(500);
  //   expect(res._getJSONData()).toEqual({ error: 'Error generating speech' });
  //   consoleErrorSpy.mockRestore();
  // });
});