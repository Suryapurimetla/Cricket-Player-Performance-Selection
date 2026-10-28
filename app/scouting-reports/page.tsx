
"use client";

import { useEffect, useState } from "react";

type Player = {
  player_id: number;
  player_name: string;
  country?: string;
  batting_style?: string;
  bowling_style?: string;
};

type Report = {
  _id?: string;
  playerId: number;
  playerName: string;
  strengths: string;
  weaknesses: string;
  recommendation: string;
  observations: string;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
};

export default function ScoutingReportsPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [playerId, setPlayerId] = useState("");
  const [strengths, setStrengths] = useState("");
  const [weaknesses, setWeaknesses] = useState("");
  const [recommendation, setRecommendation] = useState("Consider");
  const [observations, setObservations] = useState("");
  const [reports, setReports] = useState<Report[]>([]);
  const [search, setSearch] = useState("");
  const [recommendationFilter, setRecommendationFilter] = useState("All");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [playersLoading, setPlayersLoading] = useState(true);
  const [editingReportId, setEditingReportId] = useState<string | null>(null);

  async function loadPlayers() {
    try {
      const response = await fetch("/api/players");
      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || "Could not load MySQL players.");
        return;
      }

      setPlayers(data.players || []);
    } catch {
      setMessage("Could not connect to the players API.");
    } finally {
      setPlayersLoading(false);
    }
  }

  async function loadReports() {
    try {
      const response = await fetch("/api/scouting-reports");
      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || "Could not load scouting reports.");
        return;
      }

      setReports(data.reports || []);
    } catch {
      setMessage("Could not connect to the scouting reports API.");
    }
  }

  useEffect(() => {
    loadPlayers();
    loadReports();
  }, []);

  function resetForm() {
    setPlayerId("");
    setStrengths("");
    setWeaknesses("");
    setRecommendation("Consider");
    setObservations("");
    setEditingReportId(null);
  }

  function startEditing(report: Report) {
    if (!report._id) {
      setMessage("This report has no ID and cannot be edited.");
      return;
    }

    setEditingReportId(report._id);
    setPlayerId(String(report.playerId));
    setStrengths(report.strengths);
    setWeaknesses(report.weaknesses);
    setRecommendation(report.recommendation);
    setObservations(report.observations || "");
    setMessage("Editing report for " + report.playerName + ".");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setMessage("");

    const selectedPlayer = players.find(
      (player) => String(player.player_id) === playerId
    );

    if (!selectedPlayer) {
      setMessage("Please select a valid player from the list.");
      return;
    }

    setLoading(true);

    try {
      const isEditing = editingReportId !== null;

      const response = await fetch("/api/scouting-reports", {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...(isEditing ? { reportId: editingReportId } : {}),
          playerId: selectedPlayer.player_id,
          strengths,
          weaknesses,
          recommendation,
          observations,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || "Could not save the scouting report.");
        return;
      }

      setMessage(
        isEditing
          ? "Scouting report updated successfully!"
          : "Scouting report saved successfully!"
      );

      resetForm();
      await loadReports();
    } catch {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(report: Report) {
    if (!report._id) {
      setMessage("This report has no ID and cannot be deleted.");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete the scouting report for ${report.playerName}?`
    );

    if (!confirmed) return;

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        `/api/scouting-reports?reportId=${encodeURIComponent(report._id)}`,
        { method: "DELETE" }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || "Could not delete the scouting report.");
        return;
      }

      if (editingReportId === report._id) {
        resetForm();
      }

      setMessage("Scouting report deleted successfully!");
      await loadReports();
    } catch {
      setMessage("Something went wrong while deleting the report.");
    } finally {
      setLoading(false);
    }
  }

  const filteredReports = reports.filter((report) => {
    const matchesName = report.playerName
      .toLowerCase()
      .includes(search.trim().toLowerCase());

    const matchesRecommendation =
      recommendationFilter === "All" ||
      report.recommendation === recommendationFilter;

    return matchesName && matchesRecommendation;
  });

  return (
    <main
      style={{
        maxWidth: 900,
        margin: "40px auto",
        padding: 24,
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1>Cricket Scouting Reports</h1>
      <p>
        Record player observations and recommendations for team selection.
      </p>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "grid",
          gap: 16,
          padding: 24,
          border: "1px solid #ccc",
          borderRadius: 12,
        }}
      >
        <h2 style={{ margin: 0 }}>
          {editingReportId ? "Edit Scouting Report" : "Create Scouting Report"}
        </h2>

        <label>
          Select Player (from MySQL)
          <select
            required
            value={playerId}
            onChange={(event) => setPlayerId(event.target.value)}
            style={inputStyle}
            disabled={playersLoading || players.length === 0 || loading}
          >
            <option value="">
              {playersLoading
                ? "Loading players..."
                : players.length === 0
                  ? "No players available"
                  : "Choose a player"}
            </option>

            {players.map((player) => (
              <option
                key={player.player_id}
                value={String(player.player_id)}
              >
                {player.player_name} (ID: {player.player_id})
                {player.country ? ` — ${player.country}` : ""}
              </option>
            ))}
          </select>
        </label>

        <label>
          Strengths
          <textarea
            required
            maxLength={2000}
            value={strengths}
            onChange={(event) => setStrengths(event.target.value)}
            placeholder="Example: Strong batting technique and good timing"
            style={inputStyle}
          />
        </label>

        <label>
          Weaknesses
          <textarea
            required
            maxLength={2000}
            value={weaknesses}
            onChange={(event) => setWeaknesses(event.target.value)}
            placeholder="Example: Struggles against short-pitched bowling"
            style={inputStyle}
          />
        </label>

        <label>
          Selection Recommendation
          <select
            value={recommendation}
            onChange={(event) => setRecommendation(event.target.value)}
            style={inputStyle}
          >
            <option value="Select">Select</option>
            <option value="Consider">Consider</option>
            <option value="Do not select">Do not select</option>
          </select>
        </label>

        <label>
          Additional Observations
          <textarea
            maxLength={4000}
            value={observations}
            onChange={(event) => setObservations(event.target.value)}
            placeholder="Optional match observations"
            style={inputStyle}
          />
        </label>

        <button
          type="submit"
          disabled={loading || playersLoading || players.length === 0}
          style={{
            padding: 12,
            background: "#1769aa",
            color: "white",
            border: "none",
            borderRadius: 6,
            cursor: loading ? "wait" : "pointer",
          }}
        >
          {loading
            ? "Please wait..."
            : editingReportId
              ? "Update Scouting Report"
              : "Save Scouting Report"}
        </button>

        {editingReportId && (
          <button
            type="button"
            onClick={resetForm}
            disabled={loading}
            style={{
              padding: 12,
              background: "#666",
              color: "white",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            Cancel Edit
          </button>
        )}

        {message && <p role="status">{message}</p>}
      </form>

      <h2 style={{ marginTop: 36 }}>Saved Reports</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 12,
          marginBottom: 16,
        }}
      >
        <input
          type="text"
          placeholder="Search by player name..."
          aria-label="Search reports by player name"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          style={inputStyle}
        />

        <select
          aria-label="Filter reports by recommendation"
          value={recommendationFilter}
          onChange={(event) => setRecommendationFilter(event.target.value)}
          style={inputStyle}
        >
          <option value="All">All Recommendations</option>
          <option value="Select">Select</option>
          <option value="Consider">Consider</option>
          <option value="Do not select">Do not select</option>
        </select>
      </div>

      <p>
        Matching reports: <strong>{filteredReports.length}</strong>
      </p>

      {filteredReports.length === 0 ? (
        <p>No matching scouting reports found.</p>
      ) : (
        <div style={{ display: "grid", gap: 16 }}>
          {filteredReports.map((report) => (
            <article
              key={report._id || `${report.playerId}-${report.createdAt}`}
              style={{
                padding: 20,
                border: "1px solid #ccc",
                borderRadius: 10,
              }}
            >
              <h3>
                {report.playerName} (ID: {report.playerId})
              </h3>

              <p>
                <strong>Strengths:</strong> {report.strengths}
              </p>

              <p>
                <strong>Weaknesses:</strong> {report.weaknesses}
              </p>

              <p>
                <strong>Recommendation:</strong> {report.recommendation}
              </p>

              {report.observations && (
                <p>
                  <strong>Observations:</strong> {report.observations}
                </p>
              )}

              {report.createdBy && (
                <p>
                  <strong>Created by:</strong> {report.createdBy}
                </p>
              )}

              {report.createdAt && (
                <p>
                  <small>
                    Created: {new Date(report.createdAt).toLocaleString()}
                  </small>
                </p>
              )}

              {report.updatedAt && (
                <p>
                  <small>
                    Updated: {new Date(report.updatedAt).toLocaleString()}
                  </small>
                </p>
              )}

              <div
                style={{
                  display: "flex",
                  gap: 10,
                  flexWrap: "wrap",
                  marginTop: 14,
                }}
              >
                <button
                  type="button"
                  onClick={() => startEditing(report)}
                  disabled={loading}
                  style={{
                    padding: "9px 16px",
                    background: "#1769aa",
                    color: "white",
                    border: "none",
                    borderRadius: 6,
                    cursor: loading ? "wait" : "pointer",
                  }}
                >
                  Edit Report
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(report)}
                  disabled={loading}
                  style={{
                    padding: "9px 16px",
                    background: "#c62828",
                    color: "white",
                    border: "none",
                    borderRadius: 6,
                    cursor: loading ? "wait" : "pointer",
                  }}
                >
                  Delete Report
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}

const inputStyle: React.CSSProperties = {
  display: "block",
  width: "100%",
  boxSizing: "border-box",
  padding: 10,
  marginTop: 6,
  border: "1px solid #aaa",
  borderRadius: 6,
  font: "inherit",
};
