# Harmoni
For å kjøre enkelte av kommandoene må man ha firebase installert, dette kan gjøres med:

```sh
npm install -g firebase-tools
firebase login 
```

# Kjør klient alene med hot reloads
Fra top mappen
```sh
cd public
npm install
npm start
```

# Kjør server alene
Fra top mappen. Her er hot realoads innebygd.
Den lokale serveren kjøres under http://localhost:5001/harmoni-6/us-central1/webApi/api/v1/
mens det deployerte endepunktet kjøres under https://us-central1-harmoni-6.cloudfunctions.net/webApi/api/v1/
```sh
cd functions
npm install
firebase serve --only functions
```

# Kjør klient og server
Fra top mappen (npm install må være kjørt i functions og public), 
her må react appen bygges først, noe som gjør at hot reloads ikke er mulig.
```sh
cd public
npm run-script build
firebase serve 
```

#Publiser
For å kunne publisere til internett må google-brukeren din være lagt til firebase-prosjektet https://console.firebase.google.com/u/1/project/harmoni-6/hosting/main
og du må være logget inn i firebase lokalt med denne brukeren.
Om dette er tilfredstilt kan du publiserere fra topp mappen med:
```sh
firebase deploy
``` 