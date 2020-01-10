const bcrypt = require('bcryptjs');
const saltRounds = 10;

export async function hashPassword(password, salt = '')
{
	if(!salt)
	{
		salt = await bcrypt.genSalt(saltRounds);
	}
	let hash = await bcrypt.hash(password, salt);
	password = undefined;
	return [hash, salt];
}

module.exports = {hashPassword}