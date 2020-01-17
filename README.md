# Harmoni

To run the firebase commands you need to have firebase installed globally, this can be done with:

```sh
npm install -g firebase-tools
firebase login 
```

# run client alone with hot reloads
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

# run npm server alone
From the top repository, hot reloads are built in here.
This local server runs under the endpoint http://localhost:8080
while the deployed endpoint runs under https://us-central1-harmoni-6.cloudfunctions.net/webApi/api/v1/
```sh
cd functions
npm install && npm run-script run-local
```

# run client and server
From the top repository (npm install must have been run in both functions and public),
here the react app has to be built first, disabling hot reloads.
```sh
cd public
npm run-script build && firebase serve 
```

# publish
To publish to the internet your google user has to be added to the following firebase project:
https://console.firebase.google.com/u/1/project/harmoni-6/hosting/main and you have to be signed in as this user locally. 
If these requirements are satisfied you can run the following commands from the top level repository:
```sh
firebase deploy
``` 