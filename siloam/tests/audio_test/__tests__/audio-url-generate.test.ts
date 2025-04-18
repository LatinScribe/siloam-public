// Test for the audio-url-generate API handler
import handler from "../../../pages/api/audio/audio-url-generate";
import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { NextApiRequest, NextApiResponse } from "next";

describe("audio-url-generate API handler", () => {
  const mockWriteFile = jest.spyOn(require("fs").promises, "writeFile");
  const mockExistsSync = jest.spyOn(require("fs"), "existsSync");
  const mockMkdirSync = jest.spyOn(require("fs"), "mkdirSync");

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 405 if method is not POST", async () => {
    const req = { method: "GET" } as NextApiRequest;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as NextApiResponse;

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(405);
    expect(res.json).toHaveBeenCalledWith({ error: "Method not allowed" });
  });

  it("should return 401 if API key is invalid", async () => {
    const req = {
      method: "POST",
      body: { customAPIKey: "invalid_key" },
    } as NextApiRequest;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as NextApiResponse;

    process.env.CUSTOM_FILE_API_KEY = "valid_key";
    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Invalid API Key" });
  });

  // it("should return 401 if audio is not provided", async () => {
  //   const req = {
  //     method: "POST",
  //     body: { customAPIKey: "843789jjeejldkeJDdjejkflrWJerjklerfjrelfre9f9FSD5223432JKFLSLKJFSDSF&&&%@#$$SFDFD#$@@#^^$#%klfjfsdlklsf#%$$%" },
  //   } as NextApiRequest;
  //   const res = {
  //     status: jest.fn().mockReturnThis(),
  //     json: jest.fn(),
  //   } as unknown as NextApiResponse;

  //   process.env.CUSTOM_FILE_API_KEY = "843789jjeejldkeJDdjejkflrWJerjklerfjrelfre9f9FSD5223432JKFLSLKJFSDSF&&&%@#$$SFDFD#$@@#^^$#%klfjfsdlklsf#%$$%";
  //   await handler(req, res);

  //   expect(res.status).toHaveBeenCalledWith(401);
  //   expect(res.json).toHaveBeenCalledWith({
  //     error: "Please provide audio in base 64 format",
  //   });
  // });

  // it("should return 401 if audio or audio_name is not a string", async () => {
  //   const req = {
  //     method: "POST",
  //     body: {
  //       customAPIKey: "843789jjeejldkeJDdjejkflrWJerjklerfjrelfre9f9FSD5223432JKFLSLKJFSDSF&&&%@#$$SFDFD#$@@#^^$#%klfjfsdlklsf#%$$%",
  //       audio: 123,
  //       audio_name: 456,
  //     },
  //   } as NextApiRequest;
  //   const res = {
  //     status: jest.fn().mockReturnThis(),
  //     json: jest.fn(),
  //   } as unknown as NextApiResponse;

  //   process.env.CUSTOM_FILE_API_KEY = "843789jjeejldkeJDdjejkflrWJerjklerfjrelfre9f9FSD5223432JKFLSLKJFSDSF&&&%@#$$SFDFD#$@@#^^$#%klfjfsdlklsf#%$$%";
  //   await handler(req, res);

  //   expect(res.status).toHaveBeenCalledWith(401);
  //   expect(res.json).toHaveBeenCalledWith({
  //     error: "Please provide valid audio and audio_name as strings",
  //   });
  // });

  // it("should save the audio file and return the URL", async () => {
  //   const req = {
  //     method: "POST",
  //     body: {
  //       customAPIKey: "843789jjeejldkeJDdjejkflrWJerjklerfjrelfre9f9FSD5223432JKFLSLKJFSDSF&&&%@#$$SFDFD#$@@#^^$#%klfjfsdlklsf#%$$%",
  //       audio: "data:audio/wav;base64,SGVsbG8sIFdvcmxkIQ==",
  //       audio_name: "test.wav",
  //     },
  //   } as NextApiRequest;
  //   const res = {
  //     status: jest.fn().mockReturnThis(),
  //     json: jest.fn(),
  //   } as unknown as NextApiResponse;

  //   process.env.CUSTOM_FILE_API_KEY = "843789jjeejldkeJDdjejkflrWJerjklerfjrelfre9f9FSD5223432JKFLSLKJFSDSF&&&%@#$$SFDFD#$@@#^^$#%klfjfsdlklsf#%$$%";
  //   mockExistsSync.mockReturnValue(false);
  //   mockWriteFile.mockResolvedValue(undefined);

  //   await handler(req, res);

  //   expect(mockWriteFile).toHaveBeenCalled();
  //   expect(res.status).toHaveBeenCalledWith(200);
  //   expect(res.json).toHaveBeenCalledWith({
  //     result: { audio_url: "/uploaded-audio/test.wav" },
  //   });
  // });

  // it("should create directories if they do not exist", async () => {
  //   const req = {
  //     method: "POST",
  //     body: {
  //       customAPIKey: "843789jjeejldkeJDdjejkflrWJerjklerfjrelfre9f9FSD5223432JKFLSLKJFSDSF&&&%@#$$SFDFD#$@@#^^$#%klfjfsdlklsf#%$$%",
  //       audio: "data:audio/wav;base64,SGVsbG8sIFdvcmxkIQ==",
  //       audio_name: "test.wav",
  //     },
  //   } as NextApiRequest;
  //   const res = {
  //     status: jest.fn().mockReturnThis(),
  //     json: jest.fn(),
  //   } as unknown as NextApiResponse;

  //   process.env.CUSTOM_FILE_API_KEY = "valid_key";
  //   mockExistsSync.mockImplementation((path) => path !== "public/uploaded-audio");
  //   mockMkdirSync.mockImplementation(() => {});
  //   mockWriteFile.mockResolvedValue(undefined);

  //   await handler(req, res);

  //   expect(mockMkdirSync).toHaveBeenCalledWith("public/uploaded-audio", {
  //     recursive: true,
  //   });
  //   expect(res.status).toHaveBeenCalledWith(200);
  // });
});
