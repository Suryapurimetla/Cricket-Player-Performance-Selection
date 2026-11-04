import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function main() {
  const { default: clientPromise, getMongoDb } = await import("../lib/mongodb");

  const client = await clientPromise;

  try {
    await client.db("admin").command({ ping: 1 });

    const db = await getMongoDb();

    console.log("MongoDB connected successfully!");
    console.log("Database:", db.databaseName);
    console.log("Ping successful!");
  } finally {
    await client.close();
    console.log("MongoDB connection closed.");
  }
}

main().catch((error) => {
  console.error("MongoDB connection test failed:", error);
  process.exitCode = 1;
});
