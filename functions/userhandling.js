const bcrypt = require('bcryptjs');
const saltRounds = 10;

async function hashPassword(password, salt = '')
{
	console.log('\nBEGIN HASHING!! ' + password);
	if(!salt)
	{
		salt = await bcrypt.genSalt(saltRounds);
	}
	console.log('salt ' + salt);
	let hash = await bcrypt.hash(password, salt);
	console.log('hash ' + hash +'\n');
	password = undefined;
	return [hash, salt];
}

module.exports = {hashPassword};