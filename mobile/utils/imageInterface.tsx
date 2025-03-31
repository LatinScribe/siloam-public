// import { API_URL } from "./dataInterface";
// import { User, Session } from "./types";

const customAPIKey = "843789jjeejldkeJDdjejkflrWJerjklerfjrelfre9f9FSD5223432JKFLSLKJFSDSF&&&%@#$$SFDFD#$@@#^^$#%klfjfsdlklsf#%$$%";
// const customAPIKey = String(process.env.EXPO_PUBLIC_CUSTOM_FILE_API_KEY);// "843789jjeejldkeJDdjejkflrWJerjklerfjrelfre9f9FSD5223432JKFLSLKJFSDSF&&&%@#$$SFDFD#$@@#^^$#%klfjfsdlklsf#%$$%";
// const customAPIKey = process.env.EXPO_PUBLIC_CUSTOM_FILE_API_KEY || "NO_DEFAULT_KEY" //|| "843789jjeejldkeJDdjejkflrWJerjklerfjrelfre9f9FSD5223432JKFLSLKJFSDSF&&&%@#$$SFDFD#$@@#^^$#%klfjfsdlklsf#%$$%";
const customAPIurl = process.env.EXPO_PUBLIC_CUSTOM_FILE_API_PATH || "NO_DEFAULT_FILE_PATH"; //|| "http://68.183.202.20:81";
const serverURL = process.env.EXPO_PUBLIC_SERVER_URL || "NO_DEFAULT_SERVER_PATH";//|| "http://68.183.202.20:81";
const customAPIOutputPath = process.env.EXPO_PUBLIC_CUSTOM_FILE_OUTPUT_PATH || "NO_DEFAULT_OUTPUT_PATH"; //|| "http://68.183.202.20/public";

/**
 * Processes an image by sending its URL to the backend.
 *
 * @param {string} url - The URL of the image to be processed.
 * @returns {Promise<string>} - A promise that resolves to the processed image content.
 *
 * @throws Will throw an error if the image processing fails.
 *
 * @example

/**
 * Processes an image file by generating an image link and then processing the image. Returns the openAI description of the image.
 *
 * @param {File} image - The image file to be processed.
 * @returns {Promise<string>} - A promise that resolves to the processed image content.
 * @throws Will throw an error if there is an issue generating the image link or processing the image.
 *
 * The function performs the following steps:
 * 1. Converts the image file to a base64 encoded string.
 * 2. Sends the base64 encoded image to the backend to generate an image URL.
 * 3. Processes the generated image URL by sending it to another backend endpoint.
 *
 * The function logs the progress and errors to the console.
 */
export async function proccessImageFile(image: File): Promise<string> {
    // try to generate the image link
    var generatedImageUrl = null;
    try {
        // log that we are trying to generate a link
        console.log("Generating image link...\n");

        var based64Image = null;

        // encode the image into base 64
        const toBase64 = (file: File) => new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
        });

        based64Image = await toBase64(image);
        // console.log(based64Image);

        // send the image to the backend
        console.log("Sending image to backend...\n");

        console.log(`Using custom API key:${customAPIKey}\n`);

        console.log(`${customAPIurl}/api/image-process/image-url-generate\n`);
        const response = await fetch(`${customAPIurl}/api/image-process/image-url-generate`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ image: based64Image, image_name: image.name, customAPIKey: customAPIKey }), // send the image and the name of the image
        });
        // currently using backend for input checking!
        console.log("fetch in processimagefile recieved repsonse:", response);
        const responseData = await response.json();
        console.log("repsonsedata in processimagefile recieved responsedata:", responseData);

        if (!response.ok) {
            console.log(responseData.error);
            throw new Error(responseData.error || "Error generating image link. Did not get ok status, got: " + response.status);
        }
        console.log(responseData.result.image_url);
        generatedImageUrl = customAPIOutputPath + responseData.result.image_url;

    } catch (error) {
        console.error("An error occurred in the image interface when uploading image:", error);
        throw error;
    }

    // now that we have the url, let's process it
    try {
        console.log("Processing image...\n");
        console.log("Making request to: " + `${serverURL}/api/image-process/image`);

        const response = await fetch(`${serverURL}/api/image-process/image`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ imageURL: generatedImageUrl }),
        });
        const responseData = await response.json();
        console.log(responseData);
        if (!response.ok) {
            throw new Error("An error occurred while processing the image, did not get ok status, got: " + response.status);
        }
        return responseData.response;
    } catch (error) {
        console.error("An error occurred in image Interface while processing the image:", error);
        throw error;
    }
}