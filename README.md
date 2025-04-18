# Siloam (Real-time On-Demand Image Processing)
​[![build](https://github.com/printfn/fend/workflows/build/badge.svg)](https://github.com/csc301-2025-s/project-26-siloam/actions/workflows/lint.yml)
[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

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

## Video Overview
watch the following video for a demonstration of the app in action!
https://drive.google.com/file/d/1tqM9VFntKKcGIyu1izSFndAOrjlEbxwq/view

## Table of Contents

* [How to Access and Use](#usage)
* [How to run Locally](#developer-instructions)
* [Run Mobile App Locally](#interactive-mobile-app)
* [Run Web App + Backend Locally](#web-app)
* [Run Database Locally](#database)
* [How to Deploy](#deploy)
* [Testing](#testing)
* [Privacy and Security](#privacy-and-security)
* [Coding Standards and Guidlines](#coding-standards-and-guidelines)
* [Development Requirements](#development-requirements)
* [Github Policies](#github-workflow)
* [Development Policies](#development-process)
* [Getting Started as a Developer](#getting-started-as-a-developer)
* [Licensing](#licenses)

## Usage
**Account Registration (Optional):**
 > _Note:_ Creating an account is optional, but it provides a better user-experience by leveraging conversation history.
 * Registration: Users are required to [register](https://www.siloam.henrytchen.com/register) an account upon first use. They can do this by providing a valid email address, username, and secure password. 
 * Login: After registration, users can [log in](https://www.siloam.henrytchen.com/login) using their credentials. 
 * Starting the Application: Once logged in, the application opens the camera view by default, ready for real-time object and scene detection.
 - To view or delete interaction history, when logged in, navigate to the [interaction history](https://www.siloam.henrytchen.com/interaction-history?page=1) page, which can found under the user menu by clicking on the top right of the screen.
 - Users can modify their account details, or delete their account at any time by using the "[Manage Profile](https://www.siloam.henrytchen.com/profile)" (accessed when logged in under the User Menu which is found at the top right of the site).
 
 > _Note:_ Registration and login is only implemented for the webapp as of currently.

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
4. Ask About the Weather
   * Click the weather button and app will describe the weather conditions based on user's current location

<img src="https://github.com/user-attachments/assets/ba544c52-e063-4cd5-aba3-dacfb6e5d656" alt="image" width="400"/>



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
   * Next, click the Blue Circle Button above the "Tap to speak".
   * You will likely be asked to allow permission to use your microphone, please enable it!
   * The AI assistant is now listen, ask a question, or give a prompt!
   * When you are done speaking, please wait a few moments, and the AI will provide you a response.
   * You can view the history of the current conversation's session under the voice option's and screen tab.
   * Note: to play the audio with another voice, you must press the Blue Circle button again with the newly selected voice.
  
   Example video of usage: https://drive.google.com/file/d/14mhwT99o1sc_NtlWzr1cVgYcXvQWnxb9/view?usp=sharing

  ![image](https://github.com/user-attachments/assets/a1df660e-19a3-417b-a30a-42e981d6061e)


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

  **Administrator Management:**

     > _Note:_ The default admin account is available for demonstration purposes. In any actual deployment, it should be removed!

  * [Log in](https://www.siloam.henrytchen.com/login) using the default Administrator credentials: username: **SUDOMASTER**, password: **SUDOMaSTER123$$$**
  - You can find additional Administrator functions under the User menu by clicking at the top right of the screen. You will find three different features:
  1) Admin Moderation: This is currently a stub function available for future extension. On this page, you can view any flagged content and manage it.
  2) Admin User Management: This feature allows admins to manage any account in the system. By typing in the correct username (it is case sensitive), you will be given a page to edit all details of the account. This includes modifying account emails and account permissions (i.e creating a new admin account), which is not available to the typical user.
  3) Interaction Modification: For privacy reasons, this does NOT grant admins access to other interaction histories. It simply allows admin accounts to manually add their own interactions for development purposes.


  
 
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

Common errors:
- If you get: "bash script sh cannot execute required file not found": This is likely because the text editor you opened the files with has changed the CRLF line endings. You should run "dos2unix script" where script is replaced with the relevant script name.

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

  ### Database:

  For the database and account system to function correctly, you must also have already completed the Web App set up step described above. Now, if this is a fresh deployment, you will want to rerun the startup.sh file, BUT this time enure that the lines for creating the default admin user are uncommented.

  Afterwards, you can (optionally) verify/inspect the database by running:

  ```bash
npx prisma studio
```
This will open an interactive page in your web browser to view the current state of the database (you can also use this to easily manually modify the database).

Now, if this is intended for an actual deployment, we HIGHLY recommend creating a new admin account and deleting the original default. To do this, first [create](https://www.siloam.henrytchen.com/register) a regular accoun (this will be your new admin account). Next, log in using the default admin credentials (found in the Usage Section of this readme). At the top right of the screen, click on your username to access the User Menu, underwhich select User Management. Search up your newly created account's username (be careful, this is case sensitive), and in the modifiy account menu switch the role of the new account from "User" to "Admin". Now, we highly recommend loggin in using the new account to verify that it now has administrator privledges before preceeding. Finally, while logged in as the default administrator, navigate to the User Menu again and select "Manage Profile". On this page, select the option to delete the account. All done, your new system is fully secure now!

---
### Deploy 

#### Web App and backend:

General Requirements:

- You should deploy this project on some device running Linux (Ubuntu is recommended). We recommend renting your own mini-server for this (we are using Digital Ocean droplets, but there are many alternatives!).
- This device must be accessible from a public STATIC IP address (if you are renting a server, this should already be satisfied). 
- For the website and API to be accessible, you will likely need to set up request routing (potentially a reverse proxy). We recommend using Nginx! However, this is not a Nginx guide! If you are not familiar with Nginx, we will refer you to the following guide: https://www.digitalocean.com/community/tutorials/how-to-install-nginx-on-ubuntu-20-04
- If you want to enable https access, we suggest using OpenSSH certbot, see https://docs.digitalocean.com/support/how-do-i-install-an-ssl-certificate-on-a-droplet/

Setup instructions:
> These instructions are similar to Developer Instruction - Web App.
- Once you have your own linux server up and running (see above), follow the same instructions as Developer Instruction - Web App.
- You will need to modify your .env variable to use your devices ip as the url (or whatever server name you end-up configuring in Nginx, see below). Note, there are 2 .env files you will need to modify, one under the siloam/ folder and one under the mobile/ folder. 
- We also recommend modifying the secret variables in your .env file (under siloam/), to ensure that the Salt Rounds, JWT Secret, and Custom File API key is unique to your deployment for security purposes. You will also need to sign up for an OpenAI account and register the corresponding OpenAI key in the .env file.
- Be sure the read the database section of the Developer instructions, as another reminder, do delete the old default admin credentials!
- We recommend setting up a cron job to periodically delete stale image files. See the suggested crontab file provided under the siloam/scripts/ folder. For more details on cron, see this guide: https://www.digitalocean.com/community/tutorial-collections/how-to-use-cron-to-automate-tasks
- In the .env file, you can also specify how long JWT tokens take before expriring. We use a access and refresh token system, where access tokens are short duration, and refresh tokens live longer to provide seamless access token refreshing.
- Again, to properly enable outside access to your website, you will likely need to set up routing (consider using Nginx). Please note that for the url generation functionality to work correctly, you must configure the routing to make the /siloam/public/uploaded-images folder publicly visible. The exact details of setting up routing depends on the specifics of your hosting service, so we are unfortunately unable to help any further here (please reach out to us for specific help). 
- We also highly recommend registering your own Domain, and setting up SSL certification (we recommend let's encrypt as a free option) to enable secure HTTPS connections.

#### Mobile app
> _Note:_ We are still investigating the logistic of delploying the mobile app onto an app store. But, there are many online guides to deploying an expo project on your store of choice!
- To deploy it locally, follow Developer Instruction - mobile in the readme (see above).

#### Deployment Tools (Suggestions)

**DigitalOcean Droplet**
- Chosen for its flexibility and reliable hosting for full-stack applications.
- DigitalOcean provides a scalable, cost-effective solution for hosting both backend and frontend services.
- It allows complete control over server configuration, making it ideal for production environments.

### Testing
We currently have a multitude of tests, covering all parts of our CI pipeline. Github workflows are set up to automatically run the test suite, build, and lint tests on each pull request (and sometimes on commits). The linting suites we use specifically are eslint and prettier, to ensure proper typescript usage. The build test specifically checks for any compilation errors that are present in the project. Finally, we have a comprehensive test suite spread out accross api.test.js file and the tests/ folder. These tests can be run using:

  ```bash
# In /siloam/

# if you haven't done so already, install node modules
npm i

# run linting
npm run lint

# run test suite
# IMPORTANT: In a seperate terminal, please ensure that the web app is already running

# In a seperate terminal, run the following
npm run build
npm start

# In the original terminal (seperate from the one running the server)
npm run test
```
> _Note:_ Reminder that for tests to properly pass, you must have a local version of the web app open an running, see the commands above!

## Privacy and Security

Siloam is committed to user privacy and ensuring security on the platform!

#### What we do:
* All uploaded image files are flushed automatically after 30 minutes. This ensures user privacy, and protects against brute force scannning attacks. 
* All image links are obsfuciated, with double hashing and randomised salt to protect against rainbow attacks. 
* We do not collect and store user traffic data, or other personalized meta data.
* Saving interaction history is completely optional, and is only viewable/accessible by YOU. You can view and delete your interaction history at any time under the User Menu (see Usage section of readme).
* Connection to our backend and website is secured by https with an SSL certificate.
* Account passwords are double hashed before being stored, to keep them safe no matter what happens.
* All account specific endpoints are protected by JWT token authentication (all handeled seamlessly), to ensure that your account information stays private. 
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
 > _Note:_ The following are techstacks and hardware requirements which we strongly recommend you be familiar with for developing the project.

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
- **Database Options:** PostgreSQL or SQLite (we recommend SQLite for development, but switching to postgreSQL for deployment)
- **ORM:** [Prisma](https://www.prisma.io/)

### Image Recognition
- **Processor:** GPT-4 vision processing for advanced image recognition tasks.
- **Frameworks and Tools:**  
  - [Cordova](https://cordova.apache.org/) or [Capacitor](https://capacitorjs.com/) for building cross-platform mobile apps (optional)
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

## Development Process

**Code Development**
- Write and test code locally. Local development server should be built in development mode. 
- Write comments if code might be hard to understand. 
- Before commiting/opening pull request, run build and lint tests (see testing section for compelete details). Fix any errors that appear.
```bash
npm run lint
npm run build
```
- Before commiting/opening pull request, run test suite (see testing section for compelete details) to ensure that no errors were introduced.
```bash
npm run test
```

**Create Pull Request**
- Submit a pull request from the feature branch to `main`.

**Review and Merge**
- After approval, merge the pull request into `main`.

**Tips & Tricks**
- Manually delete all node modules and reinstall them periodically to ensure that you are in synch with the package.json
- Run the development server on another window to see live results of changes.


## Getting Started (as a developer)

Read the entire readme! It might be a long read, but it provides the best exploration of our project which is crucial to effective development! For the sake of sucintness, we will not repeat previously mentioned information here, so please do read it!!

### Understanding the project flow:

![image](https://github.com/user-attachments/assets/9f072b70-e434-4535-8d59-9934f13171be)

As you can see in the image above, our project is broken down into 3 key stages. 1) the front-end, 2) the back-end, and 3) external APIs. Control flow starts in the front-end (either mobile or web), where users interact with our application. These interactions result in JSON requests being made to our backend web-server (notice how we have a RESTFUL design, where different front-ends interface with a unified back-end). The back-end handles/processes this request. If it needs to, it makes a request to external API's, and proceses the relevant response as well (the server acts as a proxy for the user). Finally, the server responds to the initial request with a JSON response. Upon recieving the relevant response, the front-end updates accordingly, and the cycle repeats! Again, our front-ends are seperate (see the /mobile and /siloam folders), but the backend is completely unified (under the /siloam folder). 

#### Running the development server:

You should install node: https://nodejs.org/en/download

Open up the project in your favourite IDE, we recommend VScode. 

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

### Authors:
- Henry "TJ" Chen
- Dereck Huynh
- Amaan Khan
- Daniel Makarov
- Andrew Xie
- James Yung

## Licenses 

 This project is provided under the [Apache Liscense 2.0](http://www.apache.org/licenses/). Specific details can be found in the License file. 

In short, this project is open-source, modifiable, and re-distributable, so long as the original author (Siloam) is cited and any changes properly documented. 
