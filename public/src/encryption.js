const bcrypt = require('bcryptjs');
const saltRounds = 10;

export async function encrypt(password, salt = '')
{
	if(!salt)
	{
		salt = await bcrypt.genSalt(saltRounds);
	}
	let hash = await bcrypt.hash(password, salt);
	return [hash, salt];
}

// example usage with and without previous salt
async function test()
{
	let credentials1 = await encrypt('heisann', '$2a$10$hxwEGDbtnqrlJ9C8pFNmhe');
	console.log('\nEncrypt with old salt.');
	console.log('Hash : ' + credentials1[0]);
	console.log('Salt : ' + credentials1[1]);

	let credentials2 = await encrypt('heisann');
	console.log('\nEncrypt with new salt.');
	console.log('Hash : ' + credentials1[0]);
	console.log('Salt : ' + credentials1[1]);
}

test();