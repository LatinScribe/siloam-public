# 26 - Siloam

> _Note:_ This document is meant to be written during (or shortly after) your review meeting, which should happen fairly close to the due date.  
>  
> _Suggestion:_ Have your review meeting a day or two before the due date. This way you will have some time to go over (and edit) this document, and all team members should have a chance to make their contribution.

## Iteration 03 - Review & Retrospect

* When: March 4, 2025  
* Where: Online Via Zoom  

## Process - Reflection

### Q1. What worked well

List **process-related** (i.e. team organization and how you work) decisions and actions that worked well.

* Our team followed a structured and efficient workflow that contributed to our success. We used Discord for regular sync meetings to plan next steps and define tasks. Work was divided so that team members could contribute in parallel (while avoiding conflicts), maximizing productivity. If anyone faced blockers or had questions, we quickly resolved them through Discord messages or calls, ensuring smooth progress.

* To streamline development, we organized into subteams:  
  - **Mobile Development** focused on the mobile front-end.  
  - **Web Infrastructure & Media Processing** handled media hosting and integration.  
  - **AI & Audio Processing** implemented text-to-speech and vision processing.  
  This structure kept work organized and efficient.

* One of our most important decisions was selecting a well-defined tech stack early on. We used TypeScript with Next.js and React for the front end, TailwindCSS for styling, and React Native with Expo for mobile. The backend relied on JavaScript/TypeScript with Next.js or Express.js, while PostgreSQL or SQLite was used for the database with Prisma as the ORM. This setup provided clarity and ensured smooth integration across components. Moreover, team members with prior experience with this tech stack were able to quickly get the rest of the team up to speed, reducing the overall learning curve.

### Q2. What did not work well

List **process-related** (i.e. team organization and how you work) decisions and actions that did not work well.

* **Delegation of work**  
  - This caused some issues while developing the app. When working within subteams, tasks were sometimes split in a way where one team member's work depended on another's completion first (e.g., UI and UX testing for the mobile app requiring certain features to be implemented beforehand).  
  - We didn’t have this issue across subteams since we only needed to know what the API endpoints expected and returned.

* **Jira**  
  - Jira was not really required for this project, as we worked independently and discussed our plans frequently on Discord.  
  - Each person understood their tasks and deadlines, so updating Jira tickets ended up being unnecessary and a waste of time.

### Q3(a). Planned changes

List any **process-related** (i.e. team organization and/or how you work) changes you are planning to make (if there are any).

* **Audio feature for the mobile app**  
  - The mobile app currently displays large text and large buttons for the visually impaired.  
  - To improve accessibility, we plan to add an audio guide that explains how to use the app upon launch, removing the need for users to read any text.

* **Conversation Context**  
  - We discussed enhancing our app by allowing interaction history with the user.  
  - This would involve improving insights based on past descriptions or images.  
  - Implementing this would require infrastructure updates to manage per-user sessions and determine where to store session history.

* **Experimenting With Real-time API**  
  - OpenAI offers low-latency, end-to-end audio-based APIs.  
  - Our current critical path (transcription → image description → speech) takes ~10 seconds.  
  - Using the real-time API should speed this up, making our app more responsive.

* **More Refined Scope for D4**  
  - Since the D4 deadline is fast approaching we will make sure to have a coordinated sprint meeting to scope out individually what we need to deliver at a high level. This will ensure we are able to make efficient and measured progress to complete the final delivery of this project. 

* **Automated garbage collection on the server**  
  - Currently, any uploaded image is stored permanently.  
  - This is both a privacy risk, and also a resource hog. We should develop an automated system to periodically delete these images to reduce memory pollution

* **Create Tests**  
  - Outside of manually testing if the app works, we need to create additional unit tests to make sure the app still works across other variables and for deployment validation. We have already developed many unit tests, so this is a lower priority now. 

### Q3(b). Integration & Next steps

Each sub-team developed their respective features, and we merged the code without any major conflicts. The assignment was helpful as it ensured all our work was consolidated and up to date on the main branch.

## Product - Review

### Q4. How was your product demo?

* **How did you prepare your demo?**  
The demo was prepared by creating a working application version to demonstrate its capabilities. We performed a demo with two frontend mediums, the first being the webapp

* **What did you manage to demo to your partner?**  

We showed a working version to our TA (since we don't have a partner) where given that the user turns on their camera (for the web app version) by pressing one large button, they can ask any questions about their environment, and our platform will give them an answer.

* **Did your partner accept the features? And were there change requests?**  
Our TA (we don't have a partner) accepted the features and has really liked our product so far. In terms of change requests, there weren't any other than the idea of potentially testing our application outdoors or in another setting other than an office/library (since we were using a webcam on our desktops to run it). As of this deliverable we should be equipped to move forward with a live demo outdoors as our mobile application’s features have matured substantially.

* **What were your learnings through this process?**  
One key learning from this process was the importance of handling sensitive data securely. Since we work with multiple keys in the .env file, there was an instance where we accidentally pushed our OpenAI API key to GitHub. Fortunately, our repository was private, but we still took the precaution of generating a new key to ensure security. Moving forward, we will be more vigilant when pushing code and adopt safer practices, such as always including the .env file in the .gitignore file to prevent accidental exposure.
