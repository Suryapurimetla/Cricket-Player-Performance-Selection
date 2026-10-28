
import { NextRequest, NextResponse } from "next/server";
import { RowDataPacket } from "mysql2";
import { ObjectId } from "mongodb";
import pool from "../../../lib/db";
import { getMongoDb } from "../../../lib/mongodb";
import { getSession } from "../../../lib/auth";

// GET: Retrieve saved scouting reports
export async function GET() {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 }
      );
    }

    const db = await getMongoDb();

    const reports = await db
      .collection("scouting_reports")
      .find({})
      .sort({ createdAt: -1 })
      .limit(100)
      .toArray();

    return NextResponse.json({ reports });
  } catch (error) {
    console.error("Scouting reports GET error:", error);

    return NextResponse.json(
      { error: "Unable to fetch scouting reports." },
      { status: 500 }
    );
  }
}

// POST: Create a new scouting report
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 }
      );
    }

    const body = await request.json();

    const playerId = Number(body.playerId);
    const strengths =
      typeof body.strengths === "string" ? body.strengths.trim() : "";
    const weaknesses =
      typeof body.weaknesses === "string" ? body.weaknesses.trim() : "";
    const recommendation =
      typeof body.recommendation === "string"
        ? body.recommendation.trim()
        : "";
    const observations =
      typeof body.observations === "string"
        ? body.observations.trim()
        : "";

    if (
      !Number.isSafeInteger(playerId) ||
      playerId <= 0 ||
      !strengths ||
      strengths.length > 2000 ||
      !weaknesses ||
      weaknesses.length > 2000 ||
      !["Select", "Consider", "Do not select"].includes(recommendation) ||
      observations.length > 4000
    ) {
      return NextResponse.json(
        { error: "Please provide valid scouting report details." },
        { status: 400 }
      );
    }

    // Confirm the player exists in MySQL.
    const [playerRows] = await pool.execute<RowDataPacket[]>(
      `SELECT player_id, player_name
       FROM PLAYER
       WHERE player_id = ?
       LIMIT 1`,
      [playerId]
    );

    if (playerRows.length === 0) {
      return NextResponse.json(
        { error: "The selected player does not exist in MySQL." },
        { status: 400 }
      );
    }

    const playerName = String(playerRows[0].player_name);
    const db = await getMongoDb();

    const result = await db.collection("scouting_reports").insertOne({
      playerId,
      playerName,
      strengths,
      weaknesses,
      recommendation,
      observations,
      createdBy:
        typeof session.email === "string" ? session.email : "unknown",
      createdAt: new Date(),
    });

    return NextResponse.json(
      {
        message: "Scouting report saved successfully.",
        reportId: result.insertedId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Scouting reports POST error:", error);

    return NextResponse.json(
      { error: "Unable to save scouting report." },
      { status: 500 }
    );
  }
}

// PUT: Update an existing scouting report
export async function PUT(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 }
      );
    }

    const body = await request.json();

    const reportId =
      typeof body.reportId === "string" ? body.reportId.trim() : "";
    const playerId = Number(body.playerId);
    const strengths =
      typeof body.strengths === "string" ? body.strengths.trim() : "";
    const weaknesses =
      typeof body.weaknesses === "string" ? body.weaknesses.trim() : "";
    const recommendation =
      typeof body.recommendation === "string"
        ? body.recommendation.trim()
        : "";
    const observations =
      typeof body.observations === "string"
        ? body.observations.trim()
        : "";

    if (
      !reportId ||
      !Number.isSafeInteger(playerId) ||
      playerId <= 0 ||
      !strengths ||
      strengths.length > 2000 ||
      !weaknesses ||
      weaknesses.length > 2000 ||
      !["Select", "Consider", "Do not select"].includes(recommendation) ||
      observations.length > 4000
    ) {
      return NextResponse.json(
        { error: "Please provide valid report details." },
        { status: 400 }
      );
    }

    if (!ObjectId.isValid(reportId)) {
      return NextResponse.json(
        { error: "Invalid scouting report ID." },
        { status: 400 }
      );
    }

    // Confirm the player exists in MySQL.
    const [playerRows] = await pool.execute<RowDataPacket[]>(
      `SELECT player_id, player_name
       FROM PLAYER
       WHERE player_id = ?
       LIMIT 1`,
      [playerId]
    );

    if (playerRows.length === 0) {
      return NextResponse.json(
        { error: "The selected player does not exist in MySQL." },
        { status: 400 }
      );
    }

    const db = await getMongoDb();

    const result = await db.collection("scouting_reports").updateOne(
      { _id: new ObjectId(reportId) },
      {
        $set: {
          playerId,
          playerName: String(playerRows[0].player_name),
          strengths,
          weaknesses,
          recommendation,
          observations,
          updatedAt: new Date(),
          updatedBy:
            typeof session.email === "string" ? session.email : "unknown",
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Scouting report not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Scouting report updated successfully.",
    });
  } catch (error) {
    console.error("Scouting reports PUT error:", error);

    return NextResponse.json(
      { error: "Unable to update scouting report." },
      { status: 500 }
    );
  }
}


 // DELETE: Remove an existing scouting report
export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const reportId = searchParams.get("reportId")?.trim() ?? "";

    if (!ObjectId.isValid(reportId)) {
      return NextResponse.json(
        { error: "Invalid scouting report ID." },
        { status: 400 }
      );
    }

    const db = await getMongoDb();

    const result = await db.collection("scouting_reports").deleteOne({
      _id: new ObjectId(reportId),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Scouting report not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Scouting report deleted successfully.",
    });
  } catch (error) {
    console.error("Scouting reports DELETE error:", error);

    return NextResponse.json(
      { error: "Unable to delete scouting report." },
      { status: 500 }
    );
  }
}
