
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";

async function main() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || "cricket_selection",
  });

  try {
    const users = [
      {
        name: "Project Admin",
        email: "admin@cricket.local",
        password: "Admin@12345",
        role: "admin",
      },
      {
        name: "Cricket Analyst",
        email: "analyst@cricket.local",
        password: "Analyst@12345",
        role: "analyst",
      },
    ];

    for (const user of users) {
      const passwordHash = await bcrypt.hash(user.password, 12);

      await connection.execute(
        `INSERT INTO users (name, email, password_hash, role)
         VALUES (?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           name = VALUES(name),
           password_hash = VALUES(password_hash),
           role = VALUES(role)`,
        [user.name, user.email, passwordHash, user.role]
      );
    }

    console.log("Admin and Analyst accounts created successfully.");
    console.log("Admin: admin@cricket.local");
    console.log("Analyst: analyst@cricket.local");
    console.log("Change these demo passwords before real deployment.");
  } finally {
    await connection.end();
  }
}

main().catch((error) => {
  console.error("Could not create demo users:", error);
  process.exitCode = 1;
});
