
import { connection, NextResponse } from "next/server";
import pool from "../../../lib/db";
import { getSession } from "../../../lib/auth";

export async function GET() {
  await connection();

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
        p.player_id,
        p.player_name,
        p.country,
        COUNT(bp.batting_perf_id) AS innings_recorded,
        SUM(bp.runs_scored) AS total_runs,
        SUM(bp.balls_faced) AS total_balls,
        ROUND(
          SUM(bp.runs_scored) * 100.0 /
          NULLIF(SUM(bp.balls_faced), 0),
          2
        ) AS overall_strike_rate,
        ROUND(AVG(bp.runs_scored), 2) AS average_runs_per_record
      FROM PLAYER p
      JOIN BATTING_PERFORMANCE bp
        ON p.player_id = bp.player_id
      GROUP BY
        p.player_id,
        p.player_name,
        p.country
      HAVING COUNT(bp.batting_perf_id) >= 10
    `);

    const players = (rows as Record<string, unknown>[])
      .map((row) => {
        const runs = Number(row.total_runs ?? 0);
        const strikeRate = Number(row.overall_strike_rate ?? 0);
        const average = Number(row.average_runs_per_record ?? 0);

        const runScore = Math.min((runs / 100) * 40, 40);
        const strikeRateScore = Math.min((strikeRate / 150) * 25, 25);
        const consistencyScore = Math.min((average / 50) * 35, 35);

        const score = Number(
          (runScore + strikeRateScore + consistencyScore).toFixed(2)
        );

        return {
          ...row,
          total_runs: runs,
          overall_strike_rate: strikeRate,
          average_runs_per_record: average,
          selection_score: score,
          selection_category:
            score >= 70 ? "High" : score >= 45 ? "Medium" : "Developing",
        };
      })
      .sort(
        (a, b) =>
          Number(b.selection_score) - Number(a.selection_score)
      )
      .slice(0, 20);

    return NextResponse.json({
      title: "Rule-Based Batter Selection",
      description:
        "Players are ranked using database-derived runs, strike rate, and average runs per recorded batting entry.",
      scoring_rules: {
        total_runs: "Up to 40 points; 1000 runs earns 40 points.",
        strike_rate: "Up to 25 points; strike rate 150 earns 25 points.",
        consistency:
          "Up to 35 points; average 50 runs per recorded entry earns 35 points.",
        minimum_batting_records: 10,
        maximum_score: 100,
      },
      players,
    });
  } catch (error) {
    console.error("Selection API error:", error);

    return NextResponse.json(
      { error: "Unable to calculate player rankings." },
      { status: 500 }
    );
  }
}
