# Siloam (Real-time On-Demand Image Processing)
​
> _Note:_ This project was proposed and developed by students at the University of Toronto. 

## Project Overview

Siloam helps visually impaired individuals gain real-time awareness of their surroundings through audio descriptions. 
The application uses a smartphone’s camera to detect objects and events and converting this information into natural, spoken descriptions.

For instance, users can identify nearby objects such as vehicles, pedestrians, or obstacles, and ask questions like "What is in front of me?" or "Is there a bus stop nearby?"
This app aims to enhance independence and safety, making it easier for users to confidently interact with their environment, especially for those with visual impairments.

## Key Features
* Ask for description of general surroundings.
* Ask for description of specific object camera is focusing on.
* Lightweight and portable across platforms.
* Friend UI that ergonomic and easy to use.
​ 
## Usage
**Accessing the Application:**
> _Note:_ Registration and login is NOT YET IMPLEMENTED and may never be depending on requirements, please ignore this section!
 * Registration: Users are required to register an account upon first use. They can do this by providing a valid email address, username, and secure password.
 * Login: After registration, users can log in using their credentials.
 * Starting the Application: Once logged in, the application opens the camera view by default, ready for real-time object and scene detection.

**Using the Features (Mobile):**
> _Note:_ There is no off the shelf mobile app yet, to try it yourself, you will need to run the project locally. See Developer instructions.
1. General Surroundings Description:
   * Switch to camera tab
   * Point the camera at your desired environment.
   * Press take photo button to take photo and recieve an audio description
2. General Awareness:
   * Wait 30 seconds (automatically takes a photo every 30 seconds)
   * Make sure camera is pointed at some area/object of interest
   * Can be disabled by pressing the stop auto capture button
3. Ask Custom Questions:
   * Press and hold anywhere on the screen to ask questions about your surroundings
   * Ask questions like "What’s in front of me?" or "Is there a bus stop nearby?"

![image](https://github.com/user-attachments/assets/b782e8c4-b682-4478-a563-e5d4b2d76859)



**Here is a video demo**
https://drive.google.com/file/d/1QHqDTwz45VfII-YA_hYVgbLSKcXVhCy4/view?usp=sharing
> _Note:_ Screen recording can not capture my voice, but I asked what am I looking at for the first prompt, and how many fingers am I holding for the second. A live demo would be better suited to show the capabilities.
  
***Navigation Tips:***
* Ensure the camera lens is clean and unobstructed for better detection accuracy.
* Hold the device steady while capturing surroundings.
* Use headphones for clearer audio output.
* For the best results, try ask specific questions.
* Not satisfied with a response, ask again and prompt it for more details about a specific attribute. 

**Using the Features (Web):**
> _Note:_ The website has been heavily updated from D2, so old instructions for D2 may no longer be relevant!
1. Describe an image (interactive)
   * Navigate to: https://www.siloam.henrytchen.com/
   * You will likely be prompted to use your camera, please enable it!
   * Select a voice which you would like the audio description to use (click/tap on a voice tile).
   * Next, click the "Analyze" Button.
   * You will likely be asked to allow permission to use your microphone, please enable it!
   * The AI assistant is now listen, ask a question, or give a prompt!
   * When you are done speaking, press the "Analyze" Button again. A photo will be taken. 
   * Wait a few moments, and the AI will provide you with assistance (visual and audio)!
   * To replay audio, click/tap "read again".
   * Note: to play the audio with another voice, you must press the "Analyze" button again with the newly selected voice.
  
   Example video of usage: https://drive.google.com/file/d/1Akzdujy_b5igDgg2tPyGSTpiXwW2l8s3/view?usp=sharing
   
  ![image](https://github.com/user-attachments/assets/c15c3e61-69c9-4768-bcfe-0649f7ffdd07)

2. Generate your own image URL:
   * If for some reason you want to use a URL instead of directly uploading your image (i.e. TA testing), you can generate your own here.
   * Navigate to: [https://www.siloam.henrytchen.com/generate-image-link](https://www.siloam.henrytchen.com/generate-image-link)
   * Under "Upload Image File", click "Choose File".
   * Select a image file of your choice (.jpeg, .png).
   * Click/tap the "Submit" button.
   * You will see on your screen the publicly available URL to your static image (copy it down now), you can then click on the link to directly view it.
3. Describe an image (url)
   * Navigate to: [https://www.siloam.henrytchen.com/process-image](https://www.siloam.henrytchen.com/process-image)
   * Under "Image URL", paste your image URL (link must be publicly accessible).
   * Select a voice which you would like the audio description to use (click/tap on a voice tile).
   * Click/tap the blue "Proccess Image" button. 
   * Wait a few moments, and your image will be described to you (visual and audio)!
   * To replay audio, click/tap "read again".
   * Note: to play the audio with another voice, you must press the "proccess image" button again with the newly selected voice.
  
4. Describe an image (legacy)
   > _Note:_ This is a legacy build (D2) of our image description service. We recommend using the current Describe Image for the best experience.

  * Navigate to: [https://www.siloam.henrytchen.com/describe-image-legacy](https://www.siloam.henrytchen.com/describe-image-legacy)
   * Under "Upload Image File", click "Choose File". Alternatively, you can also describe an image url as in 3.
   * Select a image file of your choice (.jpeg, .png).
   * Select a voice which you would like the audio description to use (click/tap on a voice tile).
   * Click/tap the blue "Proccess Image" button. 
   * Wait a few moments, and your image will be described to you (visual and audio)!
   * To replay audio, click/tap "read again".
   * Note: to play the audio with another voice, you must press the "proccess image" button again with the newly selected voice.

  <img src="https://github.com/user-attachments/assets/16bfa1e6-1f46-46f7-b73b-09af11264bc0" alt="drawing" width="500"/>

  
 
## Developer Instructions:

### Interactive Mobile APP:
> _Note:_ The backend must also already be running. To deploy the backend, see "Web APP". By default, it should connect to the backend hosted on our server, so you will not need to deploy the backend locally.

To run the app, first install expo go on your mobile device (It can run on the web as well so downloading it is not required but recommended for a better experience)

* Download the source code (extract it if nesscary).

* Open the project/root folder in linux (Ubuntu is recommended).

* You should install node: https://nodejs.org/en/download
* At this point, you should be able to run "npm help"

Then navigate to the mobile folder, `/mobile`, and once there run the following:
```bash
npm install
```
```bash
npx expo start
```

A QR code should appear, allowing you to scan it with your phone's camera and it will launch itself in the expo go app

Once there, you will be presented with a default screen that is subject to change, click on the camera tab in the bottom right to 
use the camera and take pictures with it to recieve a TTS (text-to-speech) description of it, or to talk with an AI in real time.

### Web APP

* Download the source code (extract it if nesscary).

* Open the project/root folder in linux (Ubuntu is recommended).
* Navigate to /siloam directory (you should see lots of folders, like "components", "mobile", ).

* Please verify that your /siloam/.env file looks something like this: (nano or cat it)
![image](https://github.com/user-attachments/assets/d6023e1e-1eef-4a81-aef6-ca92196a977f)

> You have two options at this point, (1) run our setup scripts or (2) setup manually.

#### Method 1. Automated (Script)
- Navigate to the siloam/scripts folder.
- Run the following scripts (you should have sudo priveledges enabled):

```bash
./startup.sh
./run.sh
```

> _Note:_ If you wish to run the app in "developer" mode for testing and development purposes, please use the developer.sh file instead of run.sh

#### Method 2. Manual

* You should install node: https://nodejs.org/en/download
* At this point, you should be able to run "npm help"

First, install dependencies (node modules):

```bash
npm i
```

Now you can build and run the project
```bash
npm run build
npm start
```
> _Note:_ If you have any build errors, or would like to run it in "developer" mode, use "npm run dev" instead.

You should see that the project is now running locally, default is: http://localhost:3000/

Navigate to that link, and voila! You should have a locally deployed version of the web app running!
  <img src="https://github.com/user-attachments/assets/e665ede2-b118-4578-86f4-a685bfe74e6b" alt="drawing" width="500"/>

---
### Deploy 

#### Web App and backend:

General Requirements:

- You should deploy this project on some device running Linux (Ubuntu is recommended).
- This device must be accessible from a public STATIC IP address.
- For the website and API to be accessible, you will likely need to set up request routing (potentially a reverse proxy). We recommend using Nginx! However, this is not a Nginx guide! If you are not familiar with Nginx, we will refer you to the following guide: https://www.digitalocean.com/community/tutorials/how-to-install-nginx-on-ubuntu-20-04
- If you want to enable https access, we suggest using OpenSSH certbot, see https://docs.digitalocean.com/support/how-do-i-install-an-ssl-certificate-on-a-droplet/

Setup instructions:
> These instructions are similar to Developer Instruction - Web App.
- Follow the same instructions as Developer Instruction - Web App. You will need to modify your .env variable to use your devices ip as the url (or whatever server name you end-up configuring in Nginx, see below)

#### Mobile app
> _Note:_ We are still investifating the logistic of delploying the mobile app onto an app store. But, there are many online guides to deploying an expo project on your store of choice!
- Follow Developer Instruction - mobile.
**Deployment Tools (Suggestions)**

#### DigitalOcean Droplet
- Chosen for its flexibility and reliable hosting for full-stack applications.
- DigitalOcean provides a scalable, cost-effective solution for hosting both backend and frontend services.
- It allows complete control over server configuration, making it ideal for production environments.

### Testing
We currently have an automated test suite called "api.test.js" that simulates api calls to our endpoints and checks for correct responses. We are currently working on migrating this test suite to properly work with our hosted backend server (not just locally). We are also investigating setting up an auto-run pipeline with Github actions. We are still working on improving overall code coverage to also test the Interfaces as well, not just the api endpoints.

## Privacy and Security

Siloam is committed to user privacy and ensuring security on the platform!

#### What we do:
* All uploaded image files are flushed automatically after 30 minutes. This ensures user privacy, and protects against brute force scannning attacks. 
* All image links are obsfuciated, with double hashing and randomised salt to protect against rainbow attacks. 
* We do not collect and store user traffic data, or other personalized meta data.
---

> _Note:_ The following sections are intended for developers and maintainers of this project. If you are only interested in deploying the project, you may skip it!

 ## Coding Standards and Guidelines
 * Maintain clear and concise documentation for all functions.
 * Write unit tests for critical components to ensure code reliability.
 * For JavaScript, adhere to the Airbnb JavaScript style guide.
 * DO NOT push node modules. DO NOT push node modules. DO NOT push node modules. 
 * Be wary of pushing your local changes to .env. Make sure no sensitive data or keys are leaked!
 * If the prisma schema is modified, npx prisma migrate dev should be run BEFORE commiting.


 ## Development requirements
 **Operating System:** Any recent browser (Chrome, Firefox, etc), Android & iOS (mobile version)
### Back-end
- **Languages:** JavaScript/TypeScript
- **Frameworks:** 
  - [Next.js](https://nextjs.org/) (preferred)

### Front-end
- **Frameworks:** [Next.js](https://nextjs.org/) + [React](https://reactjs.org/)
- **Language:** TypeScript, some CSS/HTML
- **Styling:** [TailwindCSS](https://tailwindcss.com/)
- **Mobile** React Native, with Expo

### Database
- **Database Options:** PostgreSQL or SQLite
- **ORM:** [Prisma](https://www.prisma.io/)

### Image Recognition
- **Processor:** GPT-4 vision processing for advanced image recognition tasks.
- **Frameworks and Tools:**  
  - [Cordova](https://cordova.apache.org/) or [Capacitor](https://capacitorjs.com/) for building cross-platform mobile apps  
  - [OpenAI](https://openai.com/) for object detection and for audio descriptions 
  - [Node.js](https://nodejs.org/) and NPM for development
​
## Github Workflow

**Branching Strategy**
- The main branch is `main` (protected branch). Developers create feature branches from `main`. 

**Pull Requests**
- Feature branches are merged into `main` via pull requests.
- Each pull request must be reviewed by at least one team member.

**Code Reviews**
- All pull requests are subject to code reviews to maintain code quality.
- Reviewers check for:
  - Code functionality
  - Style adherence
  - Documentation

**Merge Process**
- Only reviewers with write access can merge pull requests after approval.

## Deployment Process

**Code Development**
- Write and test code locally. Local development server should be built in development mode. 

**Create Pull Request**
- Submit a pull request from the feature branch to `main`.

**Review and Merge**
- After approval, merge the pull request into `main`.


## Getting Started (as a developer)

You should install node: https://nodejs.org/en/download

Open up the project in your favourite IDE, we recommend VScode. 

#### Running the development server:

```bash
npm i

npm i prisma

npx prisma generate

npx prisma migrate dev

npm run dev
```

#### Examining the database:

```bash
npm i # if not already done

npx prisma generate

npx prisma migrate dev

npx prisma studio
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing a dummy page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) instead of React pages.

#### Interactive Mockup APP:
To run the interactive mockup, please click on the following file, where you will be able to demo our mockup:
https://www.figma.com/proto/tNsMMCYDSMgA0xa8K3RtkX/CSC301-D1-Figma?node-id=0-1&t=Kuo4mEe6BaJtd463-1 

![image](https://github.com/user-attachments/assets/971644fd-5ce6-4e4a-bd13-cd21c89c96eb)

Here is our figma design:
https://www.figma.com/design/tNsMMCYDSMgA0xa8K3RtkX/CSC301-D1-Figma?node-id=0-1&t=gb8ycX1rVIVuuTe9-0

## Licenses 

 This project is provided under the [Apache Liscense 2.0](http://www.apache.org/licenses/). Specific details can be found in the License file. 

In short, this project is open-source, modifiable, and re-distributable, so long as the original author (Siloam) is cited and any changes properly documented. 
