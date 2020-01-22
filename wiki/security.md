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
This is done with the _zxcvbn_ library to check strength on registration. This also 
provides the user with a strength meter, indicating the password strength.

**Built-in Security features:**

_React_: Javascript injection blocking 

_Sequelize_: SQL injection blocking
