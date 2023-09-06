## Hi there 👋 Welcome to:

# [MentorUp] - Class Management App

Introducing the Ultimate Class Management App: Streamlining Education Like Never Before!

<div>
<img src="" alt="class-management"  />
</div>

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Getting Started](#getting-started)
- [Installation](#installation)
- [Usage](#usage)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [Support](#support)
- [License](#license)

## Introduction

Whether you're an administrator overseeing multiple classes, a mentor guiding students on their academic journey, or a student seeking to stay organized, our cutting-edge Class Management App has you covered. Powered by Express, TypeScript, and React, this application offers a seamless user experience while integrating the convenience of Google OAuth and Slack.

## Features

- **Tailored roles:** Our app caters to the diverse needs of administrators, mentors, and students with distinct roles. Admins wield comprehensive class management control, mentors effortlessly create and oversee classes, and students access their schedules seamlessly within one intuitive platform.

- **Enhanced security:** MentorUp employs refresh tokens for added security, ensuring your data remains private and protected.

- **Real-time Schedule Access:** Empower students to access their class schedules with ease, guaranteeing they never miss essential sessions

- **Google Integration:**
  Users can securely sign in with their Google accounts and utilize Google Calendar to manage their class schedules effortlessly.
- **Slack Integration:**
  Our integration with Slack empowers administrators to efficiently handle member profiles and customize private and public channels for seamless communication.

## Getting Started

To get started with MentorUp, follow these simple steps:

## Getting Started

1. Create your own .env file (see .env.example)
2. npm install
3. npm run dev
4. Go to http://localhost:3000/ to start our application

## Screenshots

<div>
<img src="" alt="app"  />
<img src="" alt="app"  />
<img src="" alt="app"  />
<img src="" alt="app"  />
</div>

## Endpoints

Base: /api/v1

- AUTH
  - `/auth/register`: admin register students
  - `/auth/directRegister`: create any users
  - `/auth/login`
  - `/auth/logout`
  - `/auth/refreshToken`
  - `/auth/confirmation`
  - `/testAuth`
- PROFILE
  - `/profile`
    - GET - user’s own data including roles and cohorts
    - PATCH - update limited set of values (currently name, email, avatarUrl)
    - DELETE - implemented basic version that simply deletes the profile (doesn’t do any checks for user-cohort or user-session relationships)
  - `/profile/password`
    - PATCH - updates user’s own password (require to provide current and new password in the payload)
- USERS
  - `/users`
    - GET - all user profiles (including cohorts). Possibly limit to Admin only
  - `/users/:userId`
    - GET - profile info of the specific user
    - PATCH - admin only, update user’s roles and cohorts
  - `/users/add-to-cohort/:cohortId`
    - PATCH - add users to the cohort (user.cohorts and cohorts.participants)
- COHORTS
  - `/cohort/`
  - `/cohort/:cohortId`
  - `/cohort/create-weeks/:cohortId`
- WEEK
  - `/week`
    - POST - admin only, creates a new week
  - `/:cohortId`
    - GET - all weeks of a cohort
  - `/:cohortId/current`
    - GET - the current week of a cohort
  - `/:cohortId/:weekId`
    - GET - get one week of a cohort
    - PATCH - updates one week, by changing the week name, start and end
    - DELETE - removes one week
- SESSION
  - `session`
    - GET - get all sessions
    - POST - mentor & student leader only, create session
  - `session/upcoming`
    - GET - mentor & student leader only, get all 6 upcoming sessions
  - `session/student/upcoming`
    - GET - student only, get all 6 upcoming sessions
  - `session/:sessionId/student/updateStatus`
    - POST - update their status to join a session or not
  - `session/:sessionId/student/status`
    - GET: student only, get their confirmation to join a session or not
  - `session/review`
    - POST - student only, write review for any sessions in their cohort
  - `session/:sessionId/review`
    - GET - mentor & student leader only, get reviews for their own sessions
  - `session/:sessionId/review`
    - GET - mentor & student leader only, get reviews of each session belonging to the session’s creator
- SLACK
  - `slack/channels`
    - GET - admin only, fetches the list of private channels from the CTD-Dev Slack workspace
  - `slack/channels/:channelId/members`
    - GET - admin only, fetches the list of members and their information (name, email, title) for a specific channel

## Contributing

👩‍💻We welcome contributions from the community to make MentorUp even better! If you have any bug fixes, feature suggestions, or improvements, please follow our [contribution guidelines](CONTRIBUTING.md).

## Support

🍿If you need any assistance or have questions, you can reach out to our support team at [deerdove23@gmail.com]

<div>
<img src="https://www.educatorstechnology.com/wp-content/webp-express/webp-images/uploads/2023/05/Best-Tools-and-Apps-to-help-you-manage-your-class-1.png.webp" alt="chat"  />
</div>

## License

🧙
MentorUp is released under the [MIT License](LICENSE).

---
