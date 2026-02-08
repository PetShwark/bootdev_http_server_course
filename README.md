# HTTP Server Course

## What is this?

This was a guided project in the Boot.dev "Learn HTTP Servers in TypeScript" course.

## How to Build?

### Prerequisites

- NVM

### Build

1. nvm use
    - Sets up the needed version of Node.js
    - Version number found in the .nvmrc file
2. npm run build
    - Builds project
3. npm run dev
    - Runs the project.  This starts a web server from which you can use the api.

## API Description

### Tokens

Successful logins generate refresh and access tokens.  Access tokens only are good for an hour, but they can be refreshed with the endpoint described below.

#### Login

Log into an existing user account with email and password.  Success returns access and refresh tokens.

- POST /api/login

#### Refresh

Refresh access token if refresh token is valid.  New refresh and access tokens generated upon successful login.

- POST /api/refresh

#### Revoke

Revoke the refresh token

- POST /api/revoke

### Users

#### Create a user record

- POST /api/users

#### Update a user record

- PUT /api/users

### Chirps

#### Read Chirps

- GET /api/chirps
    - Query parameters:
        - authorId
            - user UUID of the Chirp author
        - sort
            - asc - ascending
            - desc - descending
    - Response body
        - Array of
            - id: string;
            - createdAt: Date;
            - updatedAt: Date;
            - body: string;
            - userId: string;

#### Create Chirps

- POST /api/chirps
    - Headers
        - Authorization
            - Auth token given by /api/login endpoint
            - Format: "Bearer AUTH_TOKEN"
    - JSON body
        - ```{ body: "Chirp text" }```
        - Body is limited to 140 characters

#### Delete a Chirp

- DELETE /api/chirps/:chirpId
    - Headers
        - Authorization
            - Auth token given by /api/login endpoint
            - Format: "Bearer AUTH_TOKEN"
    - No body

### Miscellaneous