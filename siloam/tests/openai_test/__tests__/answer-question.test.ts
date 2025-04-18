import { createMocks } from "node-mocks-http";
import handler from "../../../pages/api/openai/answer-question";
import { describe, it, expect, jest, beforeEach, afterEach } from "@jest/globals";
import OpenAI from "openai"; // Ensure OpenAI is installed and imported correctly

jest.mock("openai"); // Mock the OpenAI module

describe("POST /api/openai/answer-question", () => {
    let mockCreateChatCompletion: jest.Mock;

    beforeEach(() => {
        mockCreateChatCompletion = jest.fn();
        (OpenAI as jest.Mock).mockImplementation(() => ({
            createChatCompletion: mockCreateChatCompletion,
        }));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should return 405 if method is not POST", async () => {
        const { req, res } = createMocks({
            method: "GET",
        });

        await handler(req, res);

        expect(res._getStatusCode()).toBe(405);
        expect(res._getJSONData()).toEqual({ error: "Method not allowed" });
    });

    it("should return 400 if imageUrl or question is missing", async () => {
        const { req, res } = createMocks({
            method: "POST",
            body: { question: "What is this?" },
        });

        await handler(req, res);

        expect(res._getStatusCode()).toBe(400);
        expect(res._getJSONData()).toEqual({ error: "Image URL and question are required" });
    });

    // it("should return 200 and a result if valid input is provided", async () => {
    //     const mockResponse = {
    //         choices: [
    //             {
    //                 message: {
    //                     content: "This is a mock response.",
    //                 },
    //             },
    //         ],
    //     };

    //     mockCreateChatCompletion.mockResolvedValue(mockResponse);

    //     const { req, res } = createMocks({
    //         method: "POST",
    //         body: {
    //             question: "What is this?",
    //             imageUrl: "https://example.com/image.jpg",
    //         },
    //     });

    //     await handler(req, res);

    //     expect(res._getStatusCode()).toBe(200);
    //     expect(res._getJSONData()).toEqual({ result: "This is a mock response." });
    // });

    it("should return 500 if an error occurs", async () => {
        mockCreateChatCompletion.mockRejectedValue(new Error("Mock error"));

        const { req, res } = createMocks({
            method: "POST",
            body: {
                question: "What is this?",
                imageUrl: "https://example.com/image.jpg",
            },
        });

        await handler(req, res);

        expect(res._getStatusCode()).toBe(500);
        expect(res._getJSONData()).toEqual({ error: "An error occurred while processing the question" });
    });
});
