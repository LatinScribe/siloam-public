import { createMocks } from "node-mocks-http";
import type { NextApiRequest, NextApiResponse } from "next";
import handler from "../../../pages/api/audio/transcribe-audio";
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

describe("POST /api/audio/transcribe-audio", () => {
  it("should return 405 if method is not POST", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "GET",
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(405);
    expect(res._getJSONData()).toEqual({ error: "Method Not Allowed" });
  });

  it("should return 500 if transcription fails", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "POST",
      body: {
        file: "invalid_base64_string",
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(res._getJSONData()).toEqual({ error: "Failed to transcribe audio" });
  });

  // it("should return 200 and transcription text on success", async () => {
  //   const mockTranscriptionText = "This is a test transcription.";
  //   jest.spyOn(openai.audio.speech, "create").mockResolvedValue({
  //     text: mockTranscriptionText,
  //   });

  //   const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
  //     method: "POST",
  //     body: {
  //       file: Buffer.from("test audio file").toString("base64"),
  //     },
  //   });

  //   await handler(req, res);

  //   expect(res._getStatusCode()).toBe(200);
  //   expect(res._getJSONData()).toEqual({ text: mockTranscriptionText });
  // });
});
