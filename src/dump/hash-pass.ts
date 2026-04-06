import bcrypt from 'bcrypt';

async function generateHash() {
  const password = 'Test12345';
  const saltRounds = 10;

  const hash = await bcrypt.hash(password, saltRounds);
  console.log('Password:', password);
  console.log('Hash:', hash);
}

generateHash();
