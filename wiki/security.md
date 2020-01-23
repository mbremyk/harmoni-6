**Tokens:**

Alle brukerrelaterte api-kall krever en _x-access-token_
i forespørsels-headeren. Token-relaterte api-kall sendes gjennom
_/auth_ mellomvareserver-side, som verfies tokenen.


**Router guards:**

Sjekker om brukeren har en gyldig token, og om dette er tilfellet får brukeren tilgang til
sidene som er reservert for påloggede brukere. På en måte fungerer det på samme måte som i
_/ auth_ bare på klientsiden.

**Serverside Hashing / Salting:**

Systemet bruker _bcr****ypt_-modulen for å hash / salt passord. Dette gjøres på serversiden. Passordet sendes til serveren med og HTTPS-tilkobling.
Hashen og saltet blir deretter lagret i databasen.

**Passordkontroll:**

Når en bruker registrerer seg for systemet må han / hun oppgi
et vesentlig vanskelig passord (minimum 5 symboler, trenger mer enn bare tall).
Dette gjøres med _zxcvbn_-biblioteket for å sjekke styrken ved registrering. Denne gir også
brukeren en styrkmåler, som indikerer passordets styrke.

**Innebygde sikkerhetsfunksjoner:**

_React_: Blokkering av Javascript-injeksjon

_Sequelize_: SQL-injeksjonsblokkering
