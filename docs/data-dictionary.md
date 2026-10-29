# Data Dictionary

**Project:** Cricket Player Performance & Selection Intelligence System  
**Database:** `cricket_selection`  
**DBMS:** MySQL

## 1. Player and Team Tables

### 1.1 PLAYER

Stores cricket player details.

| Column | Data Type | NULL Allowed? | Key / Constraint | Description |
|---|---|---|---|---|
| `player_id` | INT | No | Primary key, auto-increment | Unique player identifier |
| `player_name` | VARCHAR(100) | No | CHECK constraint | Player's name; must contain at least two characters |
| `country` | VARCHAR(50) | No | — | Player's country |
| `batting_style` | VARCHAR(30) | No | — | Player's batting style |
| `bowling_style` | VARCHAR(50) | Yes | — | Player's bowling style |
| `date_of_birth` | DATE | Yes | — | Player's date of birth |

### 1.2 TEAM

Stores cricket team information.

| Column | Data Type | NULL Allowed? | Key / Constraint | Description |
|---|---|---|---|---|
| `team_id` | INT | No | Primary key, auto-increment | Unique team identifier |
| `team_name` | VARCHAR(50) | No | UNIQUE | Team name; duplicate team names are not permitted |

### 1.3 PLAYER_ROLE

Stores player-role information for cricket formats.

| Column | Data Type | NULL Allowed? | Key / Constraint | Description |
|---|---|---|---|---|
| `role_id` | INT | No | Primary key, auto-increment | Unique role record identifier |
| `player_id` | INT | No | Foreign key, indexed | References `player.player_id` |
| `format` | VARCHAR(10) | No | Composite UNIQUE | Cricket format associated with the role |
| `role` | VARCHAR(50) | No | — | Player's role in that format |

**Composite unique constraint:** `(player_id, format)`.

## 2. Match and Venue Tables

### 2.1 MATCH

Stores match details and references to participating teams, venue, weather, and winner.

| Column | Data Type | NULL Allowed? | Key / Constraint | Description |
|---|---|---|---|---|
| `match_id` | INT | No | Primary key, auto-increment | Unique match identifier |
| `team1_id` | INT | No | Foreign key, indexed | References `team.team_id` for the first participating team |
| `team2_id` | INT | No | Foreign key, indexed | References `team.team_id` for the second participating team |
| `venue_id` | INT | No | Foreign key; composite index | References `venue.venue_id` |
| `weather_id` | INT | Yes | Foreign key, indexed | References `weather.weather_id` |
| `match_format` | VARCHAR(10) | No | CHECK constraint; composite index | Match format; allowed values are `ODI` and `T20I` |
| `match_date` | DATE | No | — | Match date |
| `winner_team_id` | INT | Yes | Foreign key, indexed | References `team.team_id` for the recorded winner |

**Important constraints:**

- `team1_id` and `team2_id` must be different.
- `match_format` must be either `ODI` or `T20I`.

**Additional index:** `idx_match_venue_format` on `(venue_id, match_format)`.

### 2.2 VENUE

Stores cricket venue information.

| Column | Data Type | NULL Allowed? | Key / Constraint | Description |
|---|---|---|---|---|
| `venue_id` | INT | No | Primary key, auto-increment | Unique venue identifier |
| `venue_name` | VARCHAR(100) | No | — | Venue name |
| `city` | VARCHAR(50) | No | — | Venue city |
| `country` | VARCHAR(50) | No | — | Venue country |
| `altitude_m` | INT | Yes | CHECK constraint | Venue altitude in metres; cannot be negative when supplied |
| `pitch_type` | VARCHAR(50) | Yes | — | Pitch type |

### 2.3 WEATHER

Stores weather conditions and measurements.

| Column | Data Type | NULL Allowed? | Key / Constraint | Description |
|---|---|---|---|---|
| `weather_id` | INT | No | Primary key, auto-increment | Unique weather record identifier |
| `weather_condition` | VARCHAR(50) | No | — | Weather description |
| `temperature_c` | DECIMAL(5,2) | Yes | — | Temperature in Celsius |
| `humidity_percent` | DECIMAL(5,2) | Yes | — | Humidity percentage |
| `wind_speed_kmh` | DECIMAL(5,2) | Yes | — | Wind speed in kilometres per hour |
| `rainfall_mm` | DECIMAL(6,2) | Yes | — | Rainfall in millimetres |

## 3. Innings and Performance Tables

### 3.1 INNINGS

Stores innings-level match information.

| Column | Data Type | NULL Allowed? | Key / Constraint | Description |
|---|---|---|---|---|
| `innings_id` | INT | No | Primary key, auto-increment | Unique innings identifier |
| `match_id` | INT | No | Foreign key, indexed | References `match.match_id` |
| `innings_number` | INT | No | CHECK constraint | Innings sequence number; must be at least 1 |
| `batting_team_id` | INT | No | Foreign key, indexed | References `team.team_id` for the batting side |
| `bowling_team_id` | INT | No | Foreign key, indexed | References `team.team_id` for the bowling side |
| `total_runs` | INT | No | Default: 0; CHECK constraint | Total runs scored; must be non-negative |
| `total_wickets` | INT | No | Default: 0; CHECK constraint | Total wickets lost; must be between 0 and 11 |
| `overs_played` | DECIMAL(4,1) | Yes | — | Overs played |

**Important constraint:** `batting_team_id` and `bowling_team_id` must be different.

### 3.2 BATTING_PERFORMANCE

Stores batting statistics for a player in an innings.

| Column | Data Type | NULL Allowed? | Key / Constraint | Description |
|---|---|---|---|---|
| `batting_perf_id` | INT | No | Primary key, auto-increment | Unique batting record identifier |
| `innings_id` | INT | No | Foreign key, indexed | References `innings.innings_id` |
| `player_id` | INT | No | Foreign key, indexed | References `player.player_id` |
| `runs_scored` | INT | No | Default: 0; CHECK constraint | Runs scored; must be non-negative |
| `balls_faced` | INT | No | Default: 0; CHECK constraint | Balls faced; must be non-negative |
| `fours` | INT | No | Default: 0; CHECK constraint | Number of fours; must be non-negative |
| `sixes` | INT | No | Default: 0; CHECK constraint | Number of sixes; must be non-negative |
| `strike_rate` | DECIMAL(6,2) | Yes | — | Batting strike rate |
| `batting_position` | INT | Yes | CHECK constraint | Batting order position; if supplied, must be at least 1 |
| `phase` | VARCHAR(20) | Yes | CHECK constraint | Match phase; allowed values are `Powerplay`, `Middle`, and `Death` |

**Additional index:** `idx_batting_player_innings` on `(player_id, innings_id)`.

**Trigger:** `trg_validate_batting_performance` runs before insertion and rejects negative runs, balls faced, fours, or sixes.

### 3.3 BOWLING_PERFORMANCE

Stores bowling statistics for a player in an innings.

| Column | Data Type | NULL Allowed? | Key / Constraint | Description |
|---|---|---|---|---|
| `bowling_perf_id` | INT | No | Primary key, auto-increment | Unique bowling record identifier |
| `innings_id` | INT | No | Foreign key, indexed | References `innings.innings_id` |
| `player_id` | INT | No | Foreign key, indexed | References `player.player_id` |
| `overs_bowled` | DECIMAL(4,1) | No | Default: 0.0; CHECK constraint | Overs bowled; must be non-negative |
| `runs_conceded` | INT | No | Default: 0; CHECK constraint | Runs conceded; must be non-negative |
| `wickets_taken` | INT | No | Default: 0; CHECK constraint | Wickets taken; must be between 0 and 10 |
| `economy_rate` | DECIMAL(5,2) | Yes | — | Bowling economy rate |
| `phase` | VARCHAR(20) | Yes | CHECK constraint | Match phase; allowed values are `Powerplay`, `Middle`, and `Death` |

**Additional index:** `idx_bowling_player_innings` on `(player_id, innings_id)`.

## 4. Dismissal and Opponent Tables

### 4.1 DISMISSAL

Stores dismissal information and optional references to the relevant batting performance, bowler, and fielder.

| Column | Data Type | NULL Allowed? | Key / Constraint | Description |
|---|---|---|---|---|
| `dismissal_id` | INT | No | Primary key, auto-increment | Unique dismissal identifier |
| `batting_perf_id` | INT | Yes | Foreign key, indexed | References `batting_performance.batting_perf_id` |
| `dismissal_type` | VARCHAR(30) | No | CHECK constraint | Dismissal type; must be one of the configured values |
| `bowler_id` | INT | Yes | Foreign key, indexed | References `player.player_id` for the bowler |
| `fielder_id` | INT | Yes | Foreign key, indexed | References `player.player_id` for the fielder |

The allowed `dismissal_type` values are:

- `caught`
- `bowled`
- `lbw`
- `run out`
- `stumped`
- `caught and bowled`
- `retired hurt`
- `hit wicket`
- `retired out`
- `obstructing the field`
- `retired not out`
- `timed out`
- `hit the ball twice`

The three foreign-key columns in this table are nullable. The schema does not impose a unique constraint on `batting_perf_id`.

### 4.2 OPPONENT

Associates players, teams, and matches.

| Column | Data Type | NULL Allowed? | Key / Constraint | Description |
|---|---|---|---|---|
| `opponent_id` | INT | No | Primary key, auto-increment | Unique opponent record identifier |
| `player_id` | INT | No | Foreign key; composite indexes | References `player.player_id` |
| `team_id` | INT | No | Foreign key; composite indexes | References `team.team_id` |
| `match_id` | INT | No | Foreign key, indexed | References `match.match_id` |

**Unique constraint:** `(player_id, team_id, match_id)`.

**Additional index:** `idx_opponent_player_team` on `(player_id, team_id)`.

## 5. User Table

### 5.1 USERS

Stores application user accounts and roles.

| Column | Data Type | NULL Allowed? | Key / Constraint | Description |
|---|---|---|---|---|
| `user_id` | INT | No | Primary key, auto-increment | Unique user identifier |
| `name` | VARCHAR(100) | No | — | User's name |
| `email` | VARCHAR(150) | No | UNIQUE | User's email address |
| `password_hash` | VARCHAR(255) | No | — | Stored password hash; plaintext passwords are not stored |
| `role` | ENUM('admin','analyst') | No | Default: `analyst` | Application role; restricted by the ENUM definition |
| `created_at` | TIMESTAMP | Yes | Default: current timestamp | Account creation timestamp |

The application uses the `admin` and `analyst` roles to control access to protected functionality. The admin-only user management API checks the authenticated user's role before listing or creating accounts.

## 6. Foreign-Key Relationship Summary

The database defines 19 foreign-key relationships.

| Child Table | Foreign-Key Column | Referenced Table and Column |
|---|---|---|
| `match` | `team1_id` | `team.team_id` |
| `match` | `team2_id` | `team.team_id` |
| `match` | `venue_id` | `venue.venue_id` |
| `match` | `weather_id` | `weather.weather_id` |
| `match` | `winner_team_id` | `team.team_id` |
| `innings` | `match_id` | `match.match_id` |
| `innings` | `batting_team_id` | `team.team_id` |
| `innings` | `bowling_team_id` | `team.team_id` |
| `player_role` | `player_id` | `player.player_id` |
| `batting_performance` | `innings_id` | `innings.innings_id` |
| `batting_performance` | `player_id` | `player.player_id` |
| `bowling_performance` | `innings_id` | `innings.innings_id` |
| `bowling_performance` | `player_id` | `player.player_id` |
| `dismissal` | `batting_perf_id` | `batting_performance.batting_perf_id` |
| `dismissal` | `bowler_id` | `player.player_id` |
| `dismissal` | `fielder_id` | `player.player_id` |
| `opponent` | `player_id` | `player.player_id` |
| `opponent` | `team_id` | `team.team_id` |
| `opponent` | `match_id` | `match.match_id` |

## 7. Views

### 7.1 `vw_batting_performance`

Joins the `player`, `batting_performance`, and `innings` tables to retrieve player details, innings and match information, and batting statistics.

### 7.2 `vw_player_details`

Retrieves player ID, name, country, batting style, bowling style, and date of birth from the `player` table.

## 8. Stored Procedure

### `GetPlayerBattingStats`

This stored procedure accepts a player-name parameter and retrieves matching player details alongside batting statistics. It reports the number of batting-performance records, total runs, fours, and sixes.

The procedure uses a join, aggregate functions, grouping, and a name filter. It was tested using `Virat Kohli`, which returned batting statistics, and a nonexistent name, which returned no matching records.

## 9. Database Integrity and Validation

The database uses primary keys, foreign keys, unique constraints, and CHECK constraints to help maintain data integrity.

The `trg_validate_batting_performance` trigger rejects negative runs scored, balls faced, fours, and sixes during insertion into `batting_performance`. The table also has CHECK constraints for those values.

The trigger is defined for `INSERT`; it does not perform the same custom validation for `UPDATE`.

Read-only data-integrity checks were executed and confirmed that:

- No match winner in the checked data was outside the two participating teams.
- No innings in the checked data used batting or bowling teams outside the corresponding match.

These checks cover the stated rules and do not imply that every possible integrity condition has been tested.

## 10. Notes

- Primary keys uniquely identify records.
- Foreign keys maintain referential integrity between related tables.
- Unique constraints prevent duplicate values or combinations of values.
- CHECK constraints validate configured values and ranges.
- ENUM columns restrict values to the enumerated options.
- Nullable columns can contain `NULL` when a value is unknown or not applicable.
- Default values are applied when an INSERT omits the corresponding column.
- Indexes support selected searches and joins.
- Column definitions and constraints should be rechecked against the live MySQL schema if the database is modified.
- MongoDB is used separately for scouting reports and supports flexible document-based CRUD operations.
