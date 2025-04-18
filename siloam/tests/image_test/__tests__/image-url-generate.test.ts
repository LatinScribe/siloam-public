import request from 'supertest';
import { createMocks } from 'node-mocks-http';
import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import fs from 'fs';
import path from 'path';

const request = require("supertest");

const BASE_URL = `http://localhost:${process.env.PORT || 3000}`;

jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
  existsSync: jest.fn(),
  mkdirSync: jest.fn(),
  promises: {
    writeFile: jest.fn(),
  },
}));

jest.mock('../../../utils/auth', () => ({
  generateSalt: jest.fn<() => Promise<string>>().mockResolvedValue('randomSalt'),
  hashFileName: jest.fn<() => Promise<string>>().mockResolvedValue('hashedFileName'),
}));

jest.mock('../../../utils/general', () => ({
  getFileExtension: jest.fn().mockReturnValue('png'),
}));

describe('API Endpoint: /api/image-process/image-url-generate', () => {
  const customApiKey = process.env.CUSTOM_FILE_API_KEY || '843789jjeejldkeJDdjejkflrWJerjklerfjrelfre9f9FSD5223432JKFLSLKJFSDSF&&&%@#$$SFDFD#$@@#^^$#%klfjfsdlklsf#%$$%';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 401 if customAPIKey is invalid', async () => {
    const response = await request(BASE_URL)
      .post('/api/image-process/image-url-generate')
      .send({
        image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...',
        image_name: 'example.png',
        customAPIKey: 'invalid_api_key',
      });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: 'Invalid API Key' });
  });

  it('should return 400 if image is not provided', async () => {
    const response = await request(BASE_URL)
      .post('/api/image-process/image-url-generate')
      .send({
        image_name: 'example.png',
        customAPIKey: customApiKey,
      });

    expect(response.status).toBe(400);
  });

  it('should return 400 if image_name is not a string', async () => {
    const response = await request(BASE_URL)
      .post('/api/image-process/image-url-generate')
      .send({
        image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...',
        image_name: 12345,
        customAPIKey: customApiKey,
      });

    expect(response.status).toBe(400);
  });

  it('should return 200 and a valid image URL if all inputs are valid', async () => {
    (fs.existsSync as jest.Mock).mockReturnValue(false);
    const response = await request(BASE_URL)
      .post('/api/image-process/image-url-generate')
      .send({
        image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...',
        image_name: 'example.png',
        customAPIKey: customApiKey,
      });

    expect(response.status).toBe(200);
    expect(response.body.result).toHaveProperty('image_url');
  });

  it('should handle file name conflicts by appending a counter', async () => {
    (fs.existsSync as jest.Mock).mockImplementation((filePath) => {
      return filePath.includes('hashedFileName.png');
    });

    const response = await request(BASE_URL)
      .post('/api/image-process/image-url-generate')
      .send({
        image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...',
        image_name: 'example.png',
        customAPIKey: customApiKey,
      });

    expect(response.status).toBe(200);
    expect(response.body.result).toHaveProperty('image_url');
  });

  // it('should return 500 if there is an error writing the file', async () => {
  //   (fs.promises.writeFile as jest.Mock).mockRejectedValue(new Error('Write error'));

  //   const response = await request(BASE_URL)
  //     .post('/api/image-process/image-url-generate')
  //     .send({
  //       image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...',
  //       image_name: 'example.png',
  //       customAPIKey: customApiKey,
  //     });

  //   expect(response.status).toBe(500);
  //   expect(response.body).toEqual({
  //     error: 'Error writing file or creating directory:',
  //   });
  // });

  it('should return 405 if method is not POST', async () => {
    const response = await request(BASE_URL).get('/api/image-process/image-url-generate');

    expect(response.status).toBe(405);
    expect(response.body).toEqual({ error: 'Method not allowed' });
  });
});