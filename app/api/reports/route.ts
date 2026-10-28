
import { NextResponse } from "next/server";
import pool from "../../../lib/db";
import { getSession } from "../../../lib/auth";

export async function GET() {
  try {
    // Verify the logged-in user's session.
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 }
      );
    }

    // Existing batting report query — unchanged.
    const [rows] = await pool.query(`
      SELECT
        p.player_id,
        p.player_name,
        p.country,
        COUNT(bp.batting_perf_id) AS innings_recorded,
        SUM(bp.runs_scored) AS total_runs,
        SUM(bp.fours) AS total_fours,
        SUM(bp.sixes) AS total_sixes,
        ROUND(
          SUM(bp.runs_scored) /
          NULLIF(COUNT(bp.batting_perf_id), 0),
          2
        ) AS runs_per_record
      FROM PLAYER p
      JOIN BATTING_PERFORMANCE bp
        ON p.player_id = bp.player_id
      GROUP BY
        p.player_id,
        p.player_name,
        p.country
      HAVING COUNT(bp.batting_perf_id) >= 10
      ORDER BY total_runs DESC
      LIMIT 20
    `);

    return NextResponse.json({ report: rows });
  } catch (error) {
    console.error("Batting report error:", error);

    return NextResponse.json(
      { error: "Unable to generate batting report." },
      { status: 500 }
    );
  }
}
