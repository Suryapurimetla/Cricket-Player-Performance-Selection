# Database Design and Data Dictionary

## 1. Overview

The Cricket Player Performance & Selection Intelligence System uses MySQL as its primary relational database and MongoDB as its NoSQL database. The system stores cricket match information, player details, batting and bowling statistics, dismissals, opponents, venues, weather information, and user accounts.

The application is developed using Next.js and TypeScript, with API routes connecting the application to the databases. Authentication and role-based access control are used to protect restricted operations.

## 2. Database Architecture

The system uses two database paradigms:

- **MySQL:** Stores structured cricket data and enforces relational integrity through primary keys, foreign keys, unique constraints, CHECK constraints, indexes, views, a stored procedure, and a trigger.
- **MongoDB:** Stores flexible scouting reports in the `scouting_reports` collection, allowing analysts to maintain player observations and selection-related notes.

### MySQL Database

Database name: `cricket_selection`

The database contains 12 tables and 2 views.

| No. | Table | Purpose |
|---|---|---|
| 1 | `player` | Stores player names, countries, batting styles, bowling styles, and dates of birth. |
| 2 | `team` | Stores cricket team information. |
| 3 | `match` | Stores match details, teams, venue, weather reference, winner, and format. |
| 4 | `venue` | Stores cricket ground details and geographical information, including altitude where available. |
| 5 | `weather` | Stores weather conditions and measurements associated with matches. |
| 6 | `innings` | Stores innings-level information, including batting team, bowling team, runs, and wickets. |
| 7 | `player_role` | Stores player role information for different cricket formats. |
| 8 | `batting_performance` | Stores individual batting statistics for a player in an innings. |
| 9 | `bowling_performance` | Stores individual bowling statistics for a player in an innings. |
| 10 | `dismissal` | Stores dismissal types and optional references to batting performance, bowler, and fielder. |
| 11 | `opponent` | Associates players with opposing teams and matches. |
| 12 | `users` | Stores application user accounts, email addresses, and roles. |

## 3. Primary Keys

Each table has a primary key that uniquely identifies its records.

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

The primary keys uniquely identify records and support relationships between tables.

## 4. Foreign Keys and Relationships

The database uses foreign keys to maintain referential integrity between related tables.

| Child Table | Foreign Key | Referenced Table | Referenced Column |
|---|---|---|---|
| `match` | `team1_id` | `team` | `team_id` |
| `match` | `team2_id` | `team` | `team_id` |
| `match` | `venue_id` | `venue` | `venue_id` |
| `match` | `weather_id` | `weather` | `weather_id` |
| `match` | `winner_team_id` | `team` | `team_id` |
| `innings` | `match_id` | `match` | `match_id` |
| `innings` | `batting_team_id` | `team` | `team_id` |
| `innings` | `bowling_team_id` | `team` | `team_id` |
| `player_role` | `player_id` | `player` | `player_id` |
| `batting_performance` | `innings_id` | `innings` | `innings_id` |
| `batting_performance` | `player_id` | `player` | `player_id` |
| `bowling_performance` | `innings_id` | `innings` | `innings_id` |
| `bowling_performance` | `player_id` | `player` | `player_id` |
| `dismissal` | `batting_perf_id` | `batting_performance` | `batting_perf_id` |
| `dismissal` | `bowler_id` | `player` | `player_id` |
| `dismissal` | `fielder_id` | `player` | `player_id` |
| `opponent` | `player_id` | `player` | `player_id` |
| `opponent` | `team_id` | `team` | `team_id` |
| `opponent` | `match_id` | `match` | `match_id` |

**Total foreign keys: 19.**

The `match.weather_id` and `match.winner_team_id` fields are nullable. The three foreign-key fields in `dismissal` are also nullable, allowing dismissal records to be stored when one or more of those references are unavailable.

The `dismissal.batting_perf_id` foreign key does not have a unique constraint. Therefore, the schema does not enforce a one-to-one relationship between batting performance and dismissal records.

## 5. Unique Constraints

Unique constraints prevent duplicate values or duplicate combinations where required.

| Table | Unique Column(s) | Purpose |
|---|---|---|
| `team` | `team_name` | Prevents duplicate team names. |
| `users` | `email` | Prevents multiple user accounts from sharing the same email address. |
| `player_role` | `(player_id, format)` | Prevents duplicate role records for the same player and format combination. |
| `opponent` | `(player_id, team_id, match_id)` | Prevents duplicate player-team-match associations. |

## 6. Check Constraints and Column Restrictions

CHECK constraints enforce domain and range restrictions on stored values.

### Player

- `player_name` must contain at least two characters, as enforced by `CHAR_LENGTH(player_name) >= 2`.

### Match

- `team1_id` and `team2_id` must be different.
- `match_format` must be either `ODI` or `T20I`.

### Innings

- `innings_number` must be greater than or equal to 1.
- `batting_team_id` and `bowling_team_id` must be different.
- `total_runs` must be greater than or equal to 0.
- `total_wickets` must be between 0 and 11, inclusive.

### Batting Performance

- `runs_scored` must be greater than or equal to 0.
- `balls_faced` must be greater than or equal to 0.
- `fours` must be greater than or equal to 0.
- `sixes` must be greater than or equal to 0.
- `batting_position` must be greater than or equal to 1 when a value is supplied.
- `phase`, when supplied, must be `Powerplay`, `Middle`, or `Death`.

### Bowling Performance

- `overs_bowled` must be greater than or equal to 0.
- `runs_conceded` must be greater than or equal to 0.
- `wickets_taken` must be between 0 and 10, inclusive.
- `phase`, when supplied, must be `Powerplay`, `Middle`, or `Death`.

### Dismissal

The `dismissal_type` column is restricted to the following values:

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

### Venue

- `altitude_m` must be greater than or equal to 0 when a value is supplied.

### User Role Restriction

The `users.role` column uses the MySQL ENUM type with the allowed values `admin` and `analyst`. Its default value is `analyst`. This is a column-level ENUM restriction, not a separate CHECK constraint.

**Note:** SQL CHECK constraints generally permit expressions that evaluate to `UNKNOWN` because of `NULL` values. Where a column is nullable, a CHECK constraint alone does not necessarily require the column to contain a value.

## 7. Defaults and Nullable Columns

Default values reduce the need to supply values explicitly during insertion.

Examples confirmed in the schema include:

- `batting_performance.runs_scored` defaults to `0`.
- `batting_performance.balls_faced` defaults to `0`.
- `batting_performance.fours` defaults to `0`.
- `batting_performance.sixes` defaults to `0`.
- `bowling_performance.overs_bowled` defaults to `0.0`.
- `bowling_performance.runs_conceded` defaults to `0`.
- `bowling_performance.wickets_taken` defaults to `0`.
- `users.role` defaults to `analyst`.
- `users.created_at` defaults to the current timestamp.

Some fields are nullable to accommodate information that may not be available for every record. Examples include `player.bowling_style`, `player.date_of_birth`, `match.weather_id`, `match.winner_team_id`, and the optional foreign-key references in `dismissal`.

## 8. Indexing Strategy

Indexes improve lookup and join performance for commonly queried columns.

The following composite indexes are present in the MySQL schema:

| Index | Table | Indexed Columns | Purpose |
|---|---|---|---|
| `idx_batting_player_innings` | `batting_performance` | `(player_id, innings_id)` | Supports queries involving batting records by player and innings. |
| `idx_bowling_player_innings` | `bowling_performance` | `(player_id, innings_id)` | Supports queries involving bowling records by player and innings. |
| `idx_match_venue_format` | `match` | `(venue_id, match_format)` | Supports match searches by venue and format. |
| `idx_opponent_player_team` | `opponent` | `(player_id, team_id)` | Supports player-team association lookups. |

The database also has primary-key indexes, indexes associated with foreign keys where required, and unique indexes for the configured unique constraints.

## 9. Views

The database contains two views that simplify access to commonly used information.

### `vw_batting_performance`

Provides a reusable view of batting performance information for querying and analysis.

### `vw_player_details`

Provides a reusable view of player details for application queries and reporting.

Views help simplify queries by presenting selected information through a predefined database object. They do not replace the underlying tables.

## 10. Stored Procedure

### `GetPlayerBattingStats`

The database contains the stored procedure `GetPlayerBattingStats`.

It provides a reusable database operation for retrieving player batting statistics. Using a stored procedure centralizes the relevant query logic in MySQL and allows the operation to be invoked without rewriting the query each time.

## 11. Trigger

### `trg_validate_batting_performance`

The database contains a `BEFORE INSERT` trigger on the `batting_performance` table.

The trigger checks the following values before a new batting performance record is inserted:

- `runs_scored`
- `balls_faced`
- `fours`
- `sixes`

If any of these values is negative, the trigger raises SQLSTATE `45000` with the message:

`Batting statistics cannot be negative`

The trigger is defined for INSERT operations only. It does not perform the same validation for UPDATE operations.

The CHECK constraints provide additional database-level restrictions for the configured batting statistics.

## 12. MongoDB Database Design

### Database

`cricket_selection_nosql`

### Collection

`scouting_reports`

The `scouting_reports` collection stores scouting information in a flexible document structure. This is suitable for analyst observations and player assessments whose fields may vary between reports.

Unlike the structured MySQL tables, MongoDB documents can accommodate different combinations of scouting attributes without requiring every report to have an identical set of columns.

The application uses MySQL for relational cricket records and MongoDB for scouting reports, demonstrating the use of two database paradigms within the project.

## 13. Application Integration

The database layer is integrated with a Next.js and TypeScript application.

The application provides API routes for accessing cricket data and scouting functionality. The APIs use the relational database for structured records and MongoDB for scouting documents.

Authentication and role-based authorization distinguish administrative operations from analyst operations. Restricted endpoints check authentication and authorization before allowing access.

Input validation and database constraints provide complementary protections: application validation helps return useful API errors, while database constraints protect the integrity of stored relational data.

## 14. Entity-Relationship Diagram

The ER diagram is documented in `docs/ER_Diagram.md`, with the rendered image stored in the project root as `ER_DIAGRAM1.png`.

The diagram represents the 12 MySQL entities and their relationships, including:

- Players and teams
- Matches, venues, and weather records
- Innings and participating teams
- Player roles
- Batting and bowling performances
- Dismissal records and their optional player/performance references
- Opponent associations
- User accounts

The diagram complements the relational schema by showing the entities, primary keys, foreign keys, and relationships between them.

## 15. Data Integrity and Validation

The database design applies several forms of integrity control:

1. **Entity integrity:** Primary keys uniquely identify records.
2. **Referential integrity:** Foreign keys connect related records and prevent invalid references under the configured constraints.
3. **Uniqueness:** Unique constraints prevent duplicate values and combinations where specified.
4. **Domain and range validation:** CHECK constraints restrict values to configured ranges and allowed categories.
5. **Insertion validation:** The batting performance trigger rejects negative batting statistics during INSERT operations.
6. **Application-level validation:** API routes validate incoming data and enforce authorization requirements before database operations.

These mechanisms work together to maintain consistent relational data while allowing flexible scouting documents in MongoDB.

## 16. Summary

The Cricket Player Performance & Selection Intelligence System uses a hybrid database architecture with MySQL and MongoDB.

The MySQL database contains 12 tables, 2 views, 19 foreign keys, configured unique constraints, CHECK constraints, four composite indexes, the `GetPlayerBattingStats` stored procedure, and the `trg_validate_batting_performance` trigger.

MongoDB stores scouting reports in the `scouting_reports` collection. The Next.js and TypeScript application integrates both databases through API routes, authentication, authorization, and input validation.

This design supports structured cricket performance analysis, relational data integrity, and flexible scouting information for player assessment and selection.
