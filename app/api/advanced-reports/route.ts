
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

    // Existing advanced SQL report query — unchanged.
    const [rows] = await pool.query(`
      WITH PlayerRuns AS (
        SELECT
          p.player_id,
          p.player_name,
          p.country,
          SUM(bp.runs_scored) AS total_runs
        FROM PLAYER p
        JOIN BATTING_PERFORMANCE bp
          ON p.player_id = bp.player_id
        GROUP BY
          p.player_id,
          p.player_name,
          p.country
      )
      SELECT
        player_name,
        country,
        total_runs,
        RANK() OVER (ORDER BY total_runs DESC) AS player_rank
      FROM PlayerRuns
      ORDER BY player_rank
      LIMIT 20
    `);

    return NextResponse.json({
      report: "Top Batters by Total Runs",
      players: rows,
    });
  } catch (error) {
    console.error("Advanced reports API error:", error);

    return NextResponse.json(
      { error: "Unable to generate the advanced SQL report." },
      { status: 500 }
    );
  }
}
