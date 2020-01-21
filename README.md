# Harmoni
Before you start, make sure you have the latest _node.js_ version installed.
To run the firebase commands you need to have firebase installed globally, this can be done with:

```sh
npm install -g firebase-tools
npm install nodemon -g
firebase login 
```

or if you don't have access to the firebase project, or don't wish to use firebase:

```sh
npm install nodemon -g
```
with this option you can only use the _nodemon_ and _npm_ method for running server/client respectively.

**IMPORTANT: The server will not work without the documents mentioned below!**

You need the _properties.js_ file to connect to the database, and the 
_fbcredential.json_ file to use fileupload functionality. Both of these go under the
functions folder.

Alternativly, you can connect you own google cloud credentials by generating a service account for Cloud Storage, and pasting the 
contents in the given file into another, named _fbcredential.json_. If this is the case, 
the bucket where you store your public images needs to set to public.

# run client and server with firebase
From the top repository (npm install must have been run in both functions and public),
here the react app has to be built first, disabling hot reloads.
```sh
cd public
npm run-script build && firebase serve 
```

# run server with hot reloads through nodemon
From the top repository, hot reloads are built in here.
This local server runs under the endpoint http://localhost:8080
```sh
cd functions
npm install && nodemon index.js
```
 
# run client alone with hot reloads through npm
From the top repository
```sh
cd public
npm install && npm start
```

# run firebase server alone
From the top repository, hot reloads are built in here.
The local server runs under the endpoint http://localhost:5001/harmoni-6/us-central1/webApi/api/v1/
while the deployed endpoint runs under https://us-central1-harmoni-6.cloudfunctions.net/webApi/api/v1/
```sh
cd functions
npm install && firebase serve --only functions
```

# deploy
To publish to the internet your google user has to be added to the following firebase project:
https://console.firebase.google.com/u/1/project/harmoni-6/hosting/main and you have to be signed in as this user locally. 
If these requirements are satisfied you can run the following commands from the top level repository:
```sh
firebase deploy
``` 
# Security
**Tokens:**

All user-related api-calls require the _x-access-token_ to be set
in the request header. Token-related api calls  are routed through the
_/auth_ middleware server-side, that verfies said token.


**Router Guards:**

Checks if the user has a valid token, and if so lets the user access
the pages reserved for logged-in users. In a sense, in works similarly to
_/auth_ only clientside.

**Clientside Hashing/Salting:**

The system utilises the _bcrypt_ module to hash/salt password. As an additional 
security feature, all of this is done client-side. Because of this, 
the only person that ever handles the plaintext password is the user himself.
The hash and its salt is then stored in databse.

**Password Checking:**

When a user registers for the system he/she is required to provide 
a substantially difficult password (5 symbols minimum, needs more than just numbers).
This is done with the _zxcvbn_ library to check strength on registration.
