
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PlayerSelection from "./PlayerSelection";

const stats = [
  { label: "Total Players", value: "8,014", icon: "🏏" },
  { label: "Matches Analyzed", value: "8,816", icon: "🏆" },
  { label: "Batting Records", value: "144K+", icon: "📊" },
  { label: "Bowling Records", value: "105K+", icon: "🎯" },
];

type Player = {
  player_id: number;
  player_name: string;
  country: string;
  batting_style: string;
  bowling_style: string | null;
};

type BattingReportRow = {
  player_id: number;
  player_name: string;
  country: string;
  innings_recorded: number;
  total_runs: string | number;
  total_fours: string | number;
  total_sixes: string | number;
  runs_per_record: string | number;
};

type AdvancedReportRow = {
  player_name: string;
  country: string;
  total_runs: string | number;
  player_rank: number;
};

export default function Home() {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("All");
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalPlayers, setTotalPlayers] = useState<number | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);

    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      router.replace("/login");
      router.refresh();
    } catch {
      setError("Unable to log out. Please try again.");
      setLoggingOut(false);
    }
  }

  useEffect(() => {
    async function loadPlayers() {
      try {
        const response = await fetch("/api/players");

        if (!response.ok) {
          throw new Error("Could not load players");
        }

        const data = await response.json();
        setPlayers(data.players ?? []);
        setTotalPlayers(data.players?.length ?? 0);
      } catch (err) {
        console.error(err);
        setError("Unable to load players from MySQL.");
      } finally {
        setLoading(false);
      }
    }

    loadPlayers();
  }, []);

  const filteredPlayers = players.filter((player) => {
    const query = search.toLowerCase();

    const matchesSearch =
      player.player_name.toLowerCase().includes(query) ||
      player.country.toLowerCase().includes(query);

    const battingStyle = player.batting_style?.toLowerCase() ?? "";

    const matchesStyle =
      selectedStyle === "All" ||
      (selectedStyle === "Right-hand batter" &&
        battingStyle.includes("right")) ||
      (selectedStyle === "Left-hand batter" &&
        battingStyle.includes("left")) ||
      (selectedStyle === "Bowler" &&
        Boolean(player.bowling_style?.trim()));

    return matchesSearch && matchesStyle;
  });

  return (
    <main className="min-h-screen bg-[#08111f] text-slate-100 md:flex">
      <aside className="border-b border-white/10 bg-[#0d1929] p-6 md:min-h-screen md:w-64 md:border-b-0 md:border-r">
        <div className="mb-10 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-400 text-2xl">
            🏏
          </div>

          <div>
            <h1 className="font-bold">CRICKET IQ</h1>
            <p className="text-xs text-slate-400">
              Selection Intelligence
            </p>
          </div>
        </div>

        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-500">
          Main menu
        </p>

        <nav className="space-y-2">
          <a
            href="#dashboard"
            className="block rounded-xl bg-emerald-400/10 px-4 py-3 font-medium text-emerald-300"
          >
            ◈ Dashboard
          </a>

          <a
            href="#players"
            className="block rounded-xl px-4 py-3 text-slate-300 hover:bg-white/5"
          >
            ♙ Players
          </a>

          <a
            href="#selection"
            className="block rounded-xl px-4 py-3 text-slate-300 hover:bg-white/5"
          >
            ◎ Player Selection
          </a>

          <a
            href="#analytics-report"
            className="block rounded-xl px-4 py-3 text-slate-300 hover:bg-white/5"
          >
            ▥ Analytics
          </a>

          <a
            href="#advanced-reports"
            className="block rounded-xl px-4 py-3 text-slate-300 hover:bg-white/5"
          >
            📈 Advanced SQL Reports
          </a>
        </nav>

        <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-sm font-semibold">Project status</p>

          <p className="mt-2 text-xs leading-5 text-slate-400">
            MySQL database and API integration.
          </p>

          <span className="mt-3 inline-block rounded-full bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300">
            {error
              ? "Connection issue"
              : loading
                ? "Connecting..."
                : "API responding"}
          </span>
        </div>
      </aside>

      <section
        id="dashboard"
        className="min-w-0 flex-1 p-5 md:p-9"
      >
        <header className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm text-emerald-300">
              PERFORMANCE OVERVIEW
            </p>

            <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
              Cricket Dashboard
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              Your central hub for player performance and selection.
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="rounded-xl border border-red-400/30 bg-red-400/10 px-5 py-3 text-sm font-semibold text-red-300 transition hover:bg-red-400/20 disabled:opacity-60"
          >
            {loggingOut ? "Logging out..." : "Log out ↗"}
          </button>
        </header>

        <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <article
              key={stat.label}
              className="rounded-2xl border border-white/10 bg-[#101d2e] p-5"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-400">
                  {stat.label}
                </p>
                <span className="text-2xl">{stat.icon}</span>
              </div>

              <p className="mt-4 text-3xl font-bold">
                {stat.label === "Total Players"
                  ? totalPlayers !== null
                    ? totalPlayers.toLocaleString()
                    : "—"
                  : stat.value}
              </p>

              <p className="mt-2 text-xs text-slate-500">
                {stat.label === "Total Players"
                  ? "Players returned by API"
                  : "Dataset overview"}
              </p>
            </article>
          ))}
        </div>

        <div
          id="analytics"
          className="mb-8 grid gap-5 xl:grid-cols-3"
        >
          <article className="rounded-2xl border border-white/10 bg-[#101d2e] p-6 xl:col-span-2">
            <h3 className="text-lg font-semibold">
              Selection Intelligence
            </h3>

            <p className="mt-1 text-sm text-slate-400">
              Explore player records and prepare performance-based
              shortlists.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-white/10 bg-[#0b1625] p-4">
                <p className="text-sm text-slate-400">
                  Players loaded
                </p>

                <p className="mt-2 text-2xl font-bold">
                  {loading ? "..." : players.length.toLocaleString()}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Records returned by the API
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-[#0b1625] p-4">
                <p className="text-sm text-slate-400">
                  Player search
                </p>

                <p className="mt-2 text-2xl font-bold">
                  Search + Filter
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Search by player or country
                </p>
              </div>
            </div>
          </article>

          <article className="rounded-2xl border border-white/10 bg-[#101d2e] p-6">
            <h3 className="font-semibold">Technology Stack</h3>

            <div className="mt-5 space-y-4">
              {[
                ["MySQL", "Relational database"],
                ["Qdrant", "Planned vector search"],
                ["Next.js", "Web application"],
                ["TypeScript", "Application code"],
              ].map(([name, description]) => (
                <div
                  key={name}
                  className="flex items-center justify-between gap-3"
                >
                  <div>
                    <p className="text-sm font-medium">{name}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      {description}
                    </p>
                  </div>

                  <span className="h-2 w-2 rounded-full bg-amber-300" />
                </div>
              ))}
            </div>
          </article>
        </div>

        <section
          id="players"
          className="scroll-mt-6 rounded-2xl border border-white/10 bg-[#101d2e] p-5 md:p-6"
        >
          <div className="mb-6">
            <h3 className="text-xl font-semibold">Player Explorer</h3>

            <p className="mt-1 text-sm text-slate-400">
              Search and filter real player records returned by MySQL.
            </p>
          </div>

          <div className="mb-5 flex flex-col gap-3 sm:flex-row">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search player or country..."
              className="min-w-0 flex-1 rounded-xl border border-white/10 bg-[#0b1625] px-4 py-3 text-sm outline-none focus:border-emerald-400"
            />

            <select
              value={selectedStyle}
              onChange={(event) => setSelectedStyle(event.target.value)}
              className="rounded-xl border border-white/10 bg-[#0b1625] px-4 py-3 text-sm outline-none focus:border-emerald-400"
            >
              <option value="All">All players</option>
              <option value="Right-hand batter">
                Right-hand batter
              </option>
              <option value="Left-hand batter">
                Left-hand batter
              </option>
              <option value="Bowler">Has bowling style</option>
            </select>
          </div>

          {loading && (
            <p className="py-8 text-center text-slate-400">
              Loading players from MySQL...
            </p>
          )}

          {error && (
            <p className="py-8 text-center text-red-300">
              {error}
            </p>
          )}

          {!loading && !error && (
            <>
              <p className="mb-3 text-xs text-slate-400">
                Showing {filteredPlayers.length} of {players.length} records
                returned by the API.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[650px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-slate-500">
                      <th className="px-3 py-4">Player</th>
                      <th className="px-3 py-4">Country</th>
                      <th className="px-3 py-4">Batting Style</th>
                      <th className="px-3 py-4">Bowling Style</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredPlayers.map((player) => (
                      <tr
                        key={player.player_id}
                        className="border-b border-white/5 last:border-0 hover:bg-white/[0.03]"
                      >
                        <td className="px-3 py-4 font-medium">
                          {player.player_name}
                        </td>

                        <td className="px-3 py-4 text-slate-400">
                          {player.country}
                        </td>

                        <td className="px-3 py-4">
                          {player.batting_style || "—"}
                        </td>

                        <td className="px-3 py-4 text-slate-400">
                          {player.bowling_style || "—"}
                        </td>
                      </tr>
                    ))}

                    {filteredPlayers.length === 0 && (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-3 py-8 text-center text-slate-400"
                        >
                          No matching players found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </section>

        {/* Player Selection Rankings */}
        <PlayerSelection />

        {/* Top Batters Report */}
        <section
  id="analytics-report"
  className="mt-8 scroll-mt-6 rounded-2xl border border-white/10 bg-[#101d2e] p-5 md:p-6"
>
          <div className="mb-6">
            <p className="text-sm text-emerald-300">SQL ANALYTICS</p>

            <h3 className="mt-2 text-xl font-semibold">
              Top Batters Report
            </h3>

            <p className="mt-1 text-sm text-slate-400">
              Ranked by total runs recorded in the dataset.
            </p>
          </div>

          <BattingReport />
        </section>

        {/* Advanced SQL Reports */}
        <section
          id="advanced-reports"
          className="mt-8 scroll-mt-6 rounded-2xl border border-white/10 bg-[#101d2e] p-5 md:p-6"
        >
          <div className="mb-6">
            <p className="text-sm text-emerald-300">
              ADVANCED SQL
            </p>

            <h3 className="mt-2 text-xl font-semibold">
              Advanced SQL Reports
            </h3>

            <p className="mt-1 text-sm text-slate-400">
              Top batters ranked using a CTE, JOIN, aggregation,
              and the RANK window function.
            </p>
          </div>

          <AdvancedBattersReport />
        </section>

        <footer className="py-8 text-center text-xs text-slate-500">
          Cricket IQ · Player Performance & Selection Intelligence System
        </footer>
      </section>
    </main>
  );
}

function BattingReport() {
  const [report, setReport] = useState<BattingReportRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadReport() {
      try {
        const response = await fetch("/api/reports");

        if (!response.ok) {
          throw new Error("Report request failed");
        }

        const data = await response.json();
        setReport(data.report ?? []);
      } catch (err) {
        console.error(err);
        setError("Unable to load the batting report.");
      } finally {
        setLoading(false);
      }
    }

    loadReport();
  }, []);

  if (loading) {
    return <p className="text-slate-400">Loading batting report...</p>;
  }

  if (error) {
    return <p className="text-red-300">{error}</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[650px] text-left text-sm">
        <thead>
          <tr className="border-b border-white/10 text-xs uppercase text-slate-500">
            <th className="px-3 py-4">Rank</th>
            <th className="px-3 py-4">Player</th>
            <th className="px-3 py-4">Country</th>
            <th className="px-3 py-4 text-right">Runs</th>
            <th className="px-3 py-4 text-right">Records</th>
            <th className="px-3 py-4 text-right">Fours</th>
            <th className="px-3 py-4 text-right">Sixes</th>
            <th className="px-3 py-4 text-right">Runs/Record</th>
          </tr>
        </thead>

        <tbody>
          {report.map((player, index) => (
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
                {player.innings_recorded}
              </td>

              <td className="px-3 py-4 text-right">
                {Number(player.total_fours).toLocaleString()}
              </td>

              <td className="px-3 py-4 text-right">
                {Number(player.total_sixes).toLocaleString()}
              </td>

              <td className="px-3 py-4 text-right">
                {Number(player.runs_per_record).toFixed(2)}
              </td>
            </tr>
          ))}

          {report.length === 0 && (
            <tr>
              <td
                colSpan={8}
                className="px-3 py-6 text-center text-slate-400"
              >
                No report data available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function AdvancedBattersReport() {
  const [players, setPlayers] = useState<AdvancedReportRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadAdvancedReport() {
      try {
        const response = await fetch("/api/advanced-reports");

        if (!response.ok) {
          throw new Error("Advanced report request failed");
        }

        const data = await response.json();
        setPlayers(data.players ?? []);
      } catch (err) {
        console.error(err);
        setError("Unable to load the advanced SQL report.");
      } finally {
        setLoading(false);
      }
    }

    loadAdvancedReport();
  }, []);

  if (loading) {
    return (
      <p className="text-slate-400">
        Loading advanced SQL report...
      </p>
    );
  }

  if (error) {
    return <p className="text-red-300">{error}</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[550px] text-left text-sm">
        <thead>
          <tr className="border-b border-white/10 text-xs uppercase text-slate-500">
            <th className="px-3 py-4">Rank</th>
            <th className="px-3 py-4">Player</th>
            <th className="px-3 py-4">Country</th>
            <th className="px-3 py-4 text-right">Total Runs</th>
          </tr>
        </thead>

        <tbody>
          {players.map((player) => (
            <tr
              key={`${player.player_rank}-${player.player_name}`}
              className="border-b border-white/5 hover:bg-white/[0.03]"
            >
              <td className="px-3 py-4 font-semibold text-emerald-300">
                {player.player_rank}
              </td>

              <td className="px-3 py-4 font-medium">
                {player.player_name}
              </td>

              <td className="px-3 py-4 text-slate-400">
                {player.country}
              </td>

              <td className="px-3 py-4 text-right font-semibold">
                {Number(player.total_runs).toLocaleString()}
              </td>
            </tr>
          ))}

          {players.length === 0 && (
            <tr>
              <td
                colSpan={4}
                className="px-3 py-6 text-center text-slate-400"
              >
                No advanced report data available.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <p className="mt-4 text-xs text-slate-500">
        Ranking is based on total recorded batting runs across the
        available dataset.
      </p>
    </div>
  );
}
