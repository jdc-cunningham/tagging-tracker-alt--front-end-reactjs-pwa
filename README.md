### About
This is an alternative take on the front end for the Tagging Tracker project. This app is built with ReactJS and utilizes the built in PWA feature.

### Technical Overview
The main features of this app are:
* offline-first functionality using `Dexie` an `IndexedDB` wrapper
* basic auth with JWT
* remote sync of content
* optional storage of photos with AWS S3
* the images are turned into `base64` strings for local storage

### App overview
This is a mockup of this app, these are the current pages/built out capability
![initial mockup](./tagging-tracker-mockup.png)

The pages/routes are generally built out as:
* navbar
* body
* bottom navbar

Where the top and bottom navbar change based on the current route

### Dev Requirements
This app is based on `create-react-app` so all you need to run it is `node` and `npx`.
Note the `.env.example` if you're developing locally then the `REACT_APP_API_BASE_LOCAL` will probably be `localhost:5000` or whatever you choose. The remote API is only needed for login/syncing content.
`REACT_APP_BASE` is more for deployment, the purpose of this variable is for checking that the remote side where the PWA static files will be deployed is not empty/the PWA does not sync with nothing when the PWA cache is cleared.

### Installation
Clone this repo, `cd` into it and then run `npm install`
Once installed, you can run the app with `npm start`

### Deployment
Note that you can't add to homescreen from incognito. Also for iOS only Safari can add to home screen.

### Work in progress
Here is a TODO list mostly regarding cross browser styling and functionality issues as well as code cleanup/refactoring.