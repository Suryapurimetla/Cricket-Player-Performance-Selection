import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function main() {
  const { default: clientPromise, getMongoDb } = await import("../lib/mongodb");

  const client = await clientPromise;
  await client.db("admin").command({ ping: 1 });

  const db = await getMongoDb();

  console.log("MongoDB connected successfully!");
  console.log("Database:", db.databaseName);
  console.log("Ping successful!");

  await client.close();
}

main().catch((error) => {
  console.error("MongoDB connection failed:", error);
  process.exitCode = 1;
});