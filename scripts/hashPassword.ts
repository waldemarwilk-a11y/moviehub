import bcrypt from "bcryptjs";

async function generateHash() {
  const password = "haslo123"; // Twoje hasło testowe
  const hash = await bcrypt.hash(password, 10);
  console.log("Hash do wklejenia do bazy:", hash);
}

generateHash();
