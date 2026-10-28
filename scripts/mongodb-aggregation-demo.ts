
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function main() {
  const { default: clientPromise, getMongoDb } = await import("../lib/mongodb");

  try {
    const client = await clientPromise;
    await client.db("admin").command({ ping: 1 });

    const db = await getMongoDb();
    const reports = db.collection("scouting_reports");

    const results = await reports.aggregate([
      {
        $group: {
          _id: "$recommendation",
          totalReports: { $sum: 1 },
        },
      },
      {
        $sort: { totalReports: -1 },
      },
    ]).toArray();

    console.log("\nMongoDB Scouting Report Aggregation");
    console.log("-----------------------------------");

    if (results.length === 0) {
      console.log("No scouting reports found yet.");
    } else {
      for (const result of results) {
        console.log(
          `${result._id ?? "Unspecified"}: ${result.totalReports} report(s)`
        );
      }
    }

    console.log("\nAggregation completed successfully!");
  } finally {
    const { default: clientPromise } = await import("../lib/mongodb");
    const client = await clientPromise;
    await client.close();
  }
}

main().catch((error) => {
  console.error("MongoDB aggregation failed:", error);
  process.exitCode = 1;
});
