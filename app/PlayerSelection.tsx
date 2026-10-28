
"use client";

import { useEffect, useState } from "react";

type Player = {
  player_id: number;
  player_name: string;
  country: string;
  innings_recorded: number;
  total_runs: number;
  overall_strike_rate: number;
  average_runs_per_record: number;
  selection_score: number;
  selection_category: string;
};

export default function PlayerSelection() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadSelection() {
      try {
        const response = await fetch("/api/selection");
        if (!response.ok) throw new Error("Could not load player rankings.");

        const data = await response.json();
        setPlayers(data.players ?? []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Something went wrong."
        );
      } finally {
        setLoading(false);
      }
    }

    loadSelection();
  }, []);

  return (
    <section
      id="selection"
      className="mt-8 rounded-2xl border border-white/10 bg-slate-900/70 p-6 text-white"
    >
      <div className="mb-5">
        <p className="text-sm font-medium uppercase tracking-widest text-emerald-400">
          Rule-Based Analysis
        </p>
        <h2 className="mt-2 text-2xl font-bold">
          Player Selection Rankings
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          Batters ranked using database-derived runs, strike rate and
          average runs per recorded batting entry.
        </p>
      </div>

      {loading ? (
        <p className="text-slate-400">Calculating player rankings...</p>
      ) : error ? (
        <p className="text-red-300">{error}</p>
      ) : players.length === 0 ? (
        <p className="text-slate-400">No eligible players found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-xs uppercase text-slate-500">
                <th className="px-3 py-4">Rank</th>
                <th className="px-3 py-4">Player</th>
                <th className="px-3 py-4">Country</th>
                <th className="px-3 py-4 text-right">Runs</th>
                <th className="px-3 py-4 text-right">Strike Rate</th>
                <th className="px-3 py-4 text-right">Score / 100</th>
                <th className="px-3 py-4">Category</th>
              </tr>
            </thead>
            <tbody>
              {players.map((player, index) => (
                <tr
                  key={player.player_id}
                  className="border-b border-white/5 hover:bg-white/[0.03]"
                >
                  <td className="px-3 py-4 text-emerald-300">
                    {index + 1}
                  </td>
                  <td className="px-3 py-4 font-medium">
                    {player.player_name}
                  </td>
                  <td className="px-3 py-4 text-slate-400">
                    {player.country}
                  </td>
                  <td className="px-3 py-4 text-right">
                    {Number(player.total_runs).toLocaleString()}
                  </td>
                  <td className="px-3 py-4 text-right">
                    {Number(player.overall_strike_rate).toFixed(2)}
                  </td>
                  <td className="px-3 py-4 text-right font-bold text-emerald-300">
                    {Number(player.selection_score).toFixed(2)}
                  </td>
                  <td className="px-3 py-4">
                    {player.selection_category}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="mt-4 text-xs text-slate-500">
        Prototype ranking for batters only. Scores are rule-based and have
        not yet been validated as a predictive selection model.
      </p>
    </section>
  );
}
