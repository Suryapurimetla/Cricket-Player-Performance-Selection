# Cricket Player Performance & Selection Intelligence System

## 1. Database Design

### 1.1 Project Overview

The Cricket Player Performance & Selection Intelligence System manages cricket-related data, including players, teams, matches, venues, weather conditions, innings, player roles, batting performance, bowling performance, dismissals, and opponent records.

The system uses MySQL for structured relational data and MongoDB for scouting reports. A web application built with Next.js provides the interface for accessing and managing the data.

### 1.2 Database Technologies

- **MySQL:** Stores structured cricket data using relational tables, primary keys, foreign keys, constraints, indexes, views, and stored procedures.
- **MongoDB:** Stores scouting reports as flexible documents and supports Create, Read, Update, and Delete (CRUD) operations.
- **Next.js:** Provides the web application interface and API routes for database interaction.
- **TypeScript:** Supports type-safe application development.
- **JWT authentication:** Supports authenticated sessions and role-based access checks in the application.

### 1.3 Database Tables

The MySQL database contains the following 12 tables:

1. **`player`** — Stores player names, countries, batting styles, bowling styles, and dates of birth.
2. **`team`** — Stores cricket team information.
3. **`match`** — Stores match details, participating teams, venue, weather reference, format, date, and winner.
4. **`venue`** — Stores venue names, cities, countries, altitude, and pitch type.
5. **`weather`** — Stores weather conditions and measurements.
6. **`innings`** — Stores innings details, batting and bowling teams, runs, wickets, and overs.
7. **`player_role`** — Stores player-role information for cricket formats.
8. **`batting_performance`** — Stores player batting statistics for innings.
9. **`bowling_performance`** — Stores player bowling statistics for innings.
10. **`dismissal`** — Stores dismissal information and references to the batter's performance, bowler, and fielder.
11. **`opponent`** — Associates players, teams, and matches.
12. **`users`** — Stores application users, email addresses, password hashes, roles, and account creation timestamps.

### 1.4 Primary Keys

Each table has a primary key to uniquely identify its records.

| Table | Primary Key |
|---|---|
| `player` | `player_id` |
| `team` | `team_id` |
| `match` | `match_id` |
| `venue` | `venue_id` |
| `weather` | `weather_id` |
| `innings` | `innings_id` |
| `player_role` | `role_id` |
| `batting_performance` | `batting_perf_id` |
| `bowling_performance` | `bowling_perf_id` |
| `dismissal` | `dismissal_id` |
| `opponent` | `opponent_id` |
| `users` | `user_id` |

### 1.5 Foreign-Key Relationships

Foreign keys maintain referential integrity between related tables.

The database defines the following 19 foreign-key relationships:

1. `match.team1_id` → `team.team_id`
2. `match.team2_id` → `team.team_id`
3. `match.venue_id` → `venue.venue_id`
4. `match.weather_id` → `weather.weather_id`
5. `match.winner_team_id` → `team.team_id`
6. `innings.match_id` → `match.match_id`
7. `innings.batting_team_id` → `team.team_id`
8. `innings.bowling_team_id` → `team.team_id`
9. `player_role.player_id` → `player.player_id`
10. `batting_performance.innings_id` → `innings.innings_id`
11. `batting_performance.player_id` → `player.player_id`
12. `bowling_performance.innings_id` → `innings.innings_id`
13. `bowling_performance.player_id` → `player.player_id`
14. `dismissal.batting_perf_id` → `batting_performance.batting_perf_id`
15. `dismissal.bowler_id` → `player.player_id`
16. `dismissal.fielder_id` → `player.player_id`
17. `opponent.player_id` → `player.player_id`
18. `opponent.team_id` → `team.team_id`
19. `opponent.match_id` → `match.match_id`

These relationships connect match, team, player, innings, and performance records while helping prevent references to nonexistent parent records.

### 1.6 Unique Constraints

The database includes the following unique constraints:

- `team.team_name` must be unique.
- `users.email` must be unique.
- `player_role` has a composite unique constraint on `(player_id, format)`.
- `opponent` has a composite unique constraint on `(player_id, team_id, match_id)`.

These constraints prevent duplicate team names, duplicate user email addresses, and duplicate combinations of the specified fields.

### 1.7 Important Check Constraints

The database includes check constraints to validate data before accepting records.

Important examples include:

- Player names must contain at least two characters.
- A match cannot have the same team as both participating teams.
- Match format must be `ODI` or `T20I`.
- Innings numbers must be at least 1.
- Batting and bowling teams must differ.
- Innings runs must be non-negative.
- Innings wickets must remain within the configured range of 0 to 11.
- Batting runs, balls faced, fours, and sixes must be non-negative.
- Batting position must be at least 1 when provided.
- Bowling statistics must satisfy their configured non-negative and range restrictions.
- Dismissal types must belong to the configured list of valid dismissal types.
- Venue altitude cannot be negative.
- The `users` table restricts roles to `admin` and `analyst`, with `analyst` as the default role.

These constraints help maintain data consistency at the database level.

### 1.8 Indexing

Indexes improve the efficiency of searches, joins, and frequently executed queries.

The database uses primary-key indexes, unique indexes, and indexes supporting foreign-key relationships. Additional indexes documented for the project include:

- `idx_match_venue_format` — supports queries involving match venue and format.
- `idx_batting_player_innings` — supports batting-performance lookups by player and innings.
- `idx_bowling_player_innings` — supports bowling-performance lookups by player and innings.
- `idx_opponent_player_team` — supports queries involving opponents, players, and teams.

The composite indexes on batting and bowling performance use `(player_id, innings_id)`.

### 1.9 Views

The MySQL database contains two views.

#### 1. `vw_batting_performance`

This view joins the `batting_performance` table with the `player` and `innings` tables. It combines batting statistics with player details and innings information.

The view includes information such as player ID, player name, country, innings ID, match ID, runs scored, balls faced, fours, sixes, strike rate, batting position, and phase.

It simplifies the retrieval and analysis of batting performance.

#### 2. `vw_player_details`

This view retrieves player information from the `player` table, including:

- Player ID
- Player name
- Country
- Batting style
- Bowling style
- Date of birth

It provides a convenient way to retrieve player details without repeatedly specifying the underlying column list.

### 1.10 ER Diagram

The Entity–Relationship (ER) diagram represents the database entities, their attributes, primary keys, foreign keys, and relationships.

The ER diagram illustrates how the player, team, match, venue, weather, innings, performance, dismissal, opponent, user, and player-role entities are related.

The project's ER diagram image is stored as `ER_DIAGRAM1.png` in the project root directory.

### 1.11 Data Integrity

Read-only validation queries were executed against the existing MySQL data to check selected consistency rules.

The checks confirmed that:

- No match winner in the checked data was outside the two participating teams.
- No innings in the checked data used batting or bowling teams outside the corresponding match.

These results support the consistency of the existing data for the two tested rules. They do not establish that every possible data-integrity rule has been verified.

### 1.12 Summary

The relational database is organized around 12 MySQL tables connected through primary keys and foreign keys. Unique constraints and check constraints help prevent invalid or duplicate records, while indexes support efficient data retrieval.

The database also includes two views, a stored procedure for retrieving player batting statistics, and a trigger for validating batting statistics during insertion.

MongoDB complements MySQL by storing scouting reports as flexible documents. The Next.js application integrates both databases through API routes and provides authentication and role-based access checks.

Together, these components support cricket-data management, performance analysis, and player selection workflows.