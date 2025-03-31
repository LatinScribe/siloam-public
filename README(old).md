
# Siloam (Real-time On-Demand Image Processing)
​
> _Note:_ This project was proposed and developed by students at the University of Toronto. 

## Project Overview

Siloam helps visually impaired individuals gain real-time awareness of their surroundings through audio descriptions. 
The application uses a smartphone’s camera to detect objects and events and converting this information into natural, spoken descriptions.

For instance, users can identify nearby objects such as vehicles, pedestrians, or obstacles, and ask questions like "What is in front of me?" or "Is there a bus stop nearby?"
This app aims to enhance independence and safety, making it easier for users to confidently interact with their environment.
​
## Interactive Mockup APP:
To run the interactive mockup, please click on the following file, where you will be able to demo our mockup:
https://www.figma.com/proto/tNsMMCYDSMgA0xa8K3RtkX/CSC301-D1-Figma?node-id=0-1&t=Kuo4mEe6BaJtd463-1 

![image](https://github.com/user-attachments/assets/971644fd-5ce6-4e4a-bd13-cd21c89c96eb)

Here is our figma design:
https://www.figma.com/design/tNsMMCYDSMgA0xa8K3RtkX/CSC301-D1-Figma?node-id=0-1&t=gb8ycX1rVIVuuTe9-0

## Interactive APP:
To run the app, first install expo go on your mobile device (It can run on the web as well so downloading it is not required but recommended for a better experience)

Then navigate to the mobile folder, siloam/mobile, and once there run the following:
* npm install
* npx expo start

A QR code should appear, allowing you to scan it with your phone's camera and it will launch itself in the expo go app

Once there, you will be presented with a default screen that is subject to change, click on the camera tab in the bottom right to 
use the camera and take pictures with it to recieve a TTS (text-to-speech) description of it, or to talk with an AI in real time.

## Key Features
* Ask for description of general surroundings.
* Ask for description of specific object camera is focusing on.
* Lightweight and portable across platforms.
* Friend UI that ergonomic and easy to use.
  
## Instructions
**Accessing the Application:**
 * Registration: Users are required to register an account upon first use. They can do this by providing a valid email address, username, and secure password.
 * Login: After registration, users can log in using their credentials.
 * Starting the Application: Once logged in, the application opens the camera view by default, ready for real-time object and scene detection.

**Using the Features:**
1. General Surroundings Description:
   * Point the camera at your environment.
   * Tap the "Describe Surroundings" button to receive an audio description of the scene.
2. Specific Object Focus:
   * Center the object in the camera view.
   * Tap the "Identify Object" button to get an audio description of the specific object currently being pointed at.
3. Ask Custom Questions:
   * Use the built-in voice command feature by holding the microphone icon.
   * Ask questions like "What’s in front of me?" or "Is there a bus stop nearby?"
  
**Navigation Tips:**
* Ensure the camera lens is clean and unobstructed for better detection accuracy.
* Hold the device steady while capturing surroundings.
* Use headphones for clearer audio output.
* For the best results, try ask specific questions.
* Not satisfied with a response, ask again and prompt it for more details about a specific attribute. 
 
 ## Development requirements
 **Operating System:** Any recent browser (Chrome, Firefox, etc), Android & iOS (mobile version)
### Back-end
- **Languages:** JavaScript/TypeScript
- **Frameworks:** 
  - [Next.js](https://nextjs.org/) (preferred)
  - [Express.js](https://expressjs.com/) (alternative option)

### Front-end
- **Frameworks:** [Next.js](https://nextjs.org/) + [React](https://reactjs.org/)
- **Language:** TypeScript, some CSS/HTML
- **Styling:** [TailwindCSS](https://tailwindcss.com/)
- **Note:** Mobile frontend support is planned if time allows.

### Database
- **Database Options:** PostgreSQL or SQLite
- **ORM:** [Prisma](https://www.prisma.io/)

### Image Recognition
- **Processor:** GPT-4 vision processing for advanced image recognition tasks.
- **Frameworks and Tools:**  
  - [Cordova](https://cordova.apache.org/) or [Capacitor](https://capacitorjs.com/) for building cross-platform mobile apps  
  - [TensorFlow.js](https://www.tensorflow.org/js) for object detection  
  - [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API) for audio descriptions  
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

**Deploy**
- Deploy the application using DigitalOcean Droplet for hosting both the backend and frontend.
- Run the deployment process to build and launch the application on the cloud in "deployment" mode with correct .env.

## Deployment Tools

**DigitalOcean Droplet**
- Chosen for its flexibility and reliable hosting for full-stack applications.
- DigitalOcean provides a scalable, cost-effective solution for hosting both backend and frontend services.
- It allows complete control over server configuration, making it ideal for production environments.

 ## Coding Standards and Guidelines
 * Maintain clear and concise documentation for all functions.
 * Write unit tests for critical components to ensure code reliability.
 * For JavaScript, adhere to the Airbnb JavaScript style guide.
​
 ## Licenses 
​
This project is provided under the [Apache Liscense 2.0](http://www.apache.org/licenses/). Specific details can be found in the License file. 

In short, this project is open-source, modifiable, and re-distributable, so long as the original author (Siloam) is cited and any changes properly docuemnted. 
