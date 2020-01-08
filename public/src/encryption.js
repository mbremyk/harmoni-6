const bcrypt = require('bcryptjs');
const saltRounds = 10;

function encrypt(password, salt)
{
	if(salt)
	{
		return bcrypt.hash(password, salt);
	}
	else
	{
		let salt = bcrypt.genSalt(saltRounds);
		let promise = bcrypt.hash(password, salt)


	}
}
if(''){
	console.log('true');
}

console.log(encrypt('hei', ''));