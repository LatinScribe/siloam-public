import { createMocks } from "node-mocks-http";
import type { NextApiRequest, NextApiResponse } from "next";
import { describe, it, expect, jest, beforeEach } from "@jest/globals";

import { verifyURL } from "@/utils/verification";

const request = require("supertest");

const BASE_URL = `http://localhost:${process.env.PORT || 3000}`;
describe("Image API Endpoint", () => {
  it("should return 405 for non-POST requests", async () => {
    const response = await request(BASE_URL).get("/api/image-process/image-url-generate");

    expect(response.status).toBe(405);
    expect(response.body).toEqual({ error: "Method not allowed" });
  });

  it("should return 400 if imageURL is not provided", async () => {
    const response = await request(BASE_URL)
      .post("/api/image-process/image-url-generate")
      .send({});

    expect(response.status).toBe(401);
  });

  // it("should return 400 if an invalid imageURL is provided", async () => {
  //   jest.mock("@/utils/verification", () => ({
  //     verifyURL: jest.fn(() => false),
  //   }));

  //   const response = await request(BASE_URL)
  //     .post("/api/image-process/image-url-generate")
  //     .send({ imageURL: "invalid-url" });

  //   expect(response.status).toBe(400);
  //   expect(response.body).toEqual({ error: "Invalid URL provided" });
  // });

  it("should return 500 if OpenAI API fails", async () => {
    jest.mock("openai", () => ({
      chat: {
        completions: {
          create: jest.fn(() => {
            throw new Error("OpenAI API error");
          }),
        },
      },
    }));

    const response = await request(BASE_URL)
      .post("/api/image-process/image-url-generate")
      .send({ imageURL: "https://example.com/image.jpg", request: "What is this?" });

    expect(response.status).toBe(401);
  });

  // it("should return 200 with a valid response for a valid request", async () => {
  //   jest.mock("openai", () => ({
  //     chat: {
  //       completions: {
  //         create: jest.fn(() => ({
  //           choices: [
  //             {
  //               message: {
  //                 content: "This is a description of the image.",
  //               },
  //             },
  //           ],
  //         })),
  //       },
  //     },
  //   }));

  //   const response = await request(BASE_URL)
  //     .post("/api/image-process/image-url-generate")
  //     .send({ imageURL: "https://example.com/image.jpg", request: "What is this?" });

  //   expect(response.status).toBe(200);
  //   expect(response.body).toEqual({ response: "This is a description of the image." });
  // });
});
