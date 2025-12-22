const bcrypt = require('bcryptjs');

async function hashPassword() {
    const password = "Password123!";
    const hash = await bcrypt.hash(password, 10);
    console.log("Password: Password123!");
    console.log("Hash:", hash);
}

hashPassword();
