
import { NextResponse } from "next/server";
import pool from "../../../lib/db";
import { getSession } from "../../../lib/auth";

export async function GET() {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 }
      );
    }

    const [rows] = await pool.query(`
      SELECT
        player_id,
        player_name,
        country,
        batting_style,
        bowling_style
      FROM PLAYER
      ORDER BY player_name
      LIMIT 100
    `);

    return NextResponse.json({ players: rows });
  } catch (error) {
    console.error("Player API error:", error);

    return NextResponse.json(
      { error: "Unable to fetch players from the database." },
      { status: 500 }
    );
  }
}
